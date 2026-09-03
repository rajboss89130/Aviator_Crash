// ============================================================================
// CASINO PLATFORM INTEGRATION BRIDGE
// Seamless iFrame PostMessage & Host JavaScript Protocol for Casino Aggregators
// ============================================================================

import { GameEngine } from "../game-engine/GameEngine";
import { ProvablyFairData } from "../game-engine/types";

export interface CasinoPlatformMessage {
  type: string;
  payload?: any;
}

export interface CasinoEventLogItem {
  id: string;
  direction: "IN" | "OUT";
  type: string;
  payload: any;
  timestamp: number;
}

type EventLogSubscriber = (logs: CasinoEventLogItem[]) => void;

export class CasinoBridge {
  private static isInitialized = false;
  private static eventLogs: CasinoEventLogItem[] = [];
  private static subscribers: Set<EventLogSubscriber> = new Set();
  private static engineRef: GameEngine | null = null;

  public static initialize(engine: GameEngine) {
    this.engineRef = engine;
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    // Listen to parent frame messages (standard casino aggregator protocol)
    window.addEventListener("message", (event: MessageEvent<CasinoPlatformMessage>) => {
      if (!event.data || !event.data.type) return;

      const { type, payload } = event.data;
      CasinoBridge.recordLog("IN", type, payload);

      switch (type) {
        case "CASINO_SET_BALANCE":
          if (typeof payload?.balance === "number") {
            engine.setBalance(payload.balance);
          }
          break;

        case "CASINO_SET_CURRENCY":
          if (payload?.currency && payload?.symbol) {
            engine.setCurrency(payload.currency, payload.symbol);
          }
          break;

        case "CASINO_SET_CONFIG":
          if (payload) {
            engine.initialize(payload);
          }
          break;

        case "CASINO_FORCE_CRASH":
          if (typeof payload?.multiplier === "number") {
            engine.forceNextCrash(payload.multiplier);
          }
          break;

        case "CASINO_RECEIVE_RESULT":
          if (payload as ProvablyFairData) {
            engine.receiveResult(payload);
          }
          break;

        case "CASINO_PING":
          CasinoBridge.sendToPlatform("CASINO_PONG", { timestamp: Date.now(), status: "ALIVE" });
          break;

        case "CASINO_GET_BALANCE":
          CasinoBridge.sendToPlatform("CASINO_BALANCE_CHANGED", { balance: engine.balance });
          break;

        case "CASINO_GET_STATE":
          CasinoBridge.sendToPlatform("CASINO_STATE_UPDATE", {
            state: engine.state,
            multiplier: engine.currentMultiplier,
            balance: engine.balance,
            activeBets: engine.activeBets,
          });
          break;

        case "CASINO_FORCE_RESET":
          engine.reset();
          break;

        default:
          break;
      }
    });

    // Expose global developer API on window for direct host script integrations
    (window as any).CasinoAviator = {
      version: "2.5.0",
      setBalance: (amount: number) => engine.setBalance(amount),
      setCurrency: (code: string, symbol: string) => engine.setCurrency(code, symbol),
      forceNextCrash: (multiplier: number) => engine.forceNextCrash(multiplier),
      getGameState: () => ({
        state: engine.state,
        multiplier: engine.currentMultiplier,
        balance: engine.balance,
        activeBets: engine.activeBets,
      }),
      placeBet: (betIndex: number, amount: number, autoCashout?: number) =>
        engine.placeBet(betIndex, amount, autoCashout),
      cashOut: (betIndex: number) => engine.cashOut(betIndex),
      getLogs: () => CasinoBridge.getLogs(),
      emit: (type: string, payload: any) => CasinoBridge.sendToPlatform(type, payload),
    };

    // Notify parent casino platform that frontend game module is loaded and ready
    this.sendToPlatform("CASINO_MODULE_READY", {
      game: "AviatorCrash",
      version: "2.5.0",
      capabilities: [
        "DUAL_BET",
        "AUTO_CASHOUT",
        "AUTO_BET",
        "PROVABLY_FAIR",
        "STANDALONE_DEV_MODE",
        "CURRENCY_ADAPTIVE",
      ],
      mode: "STANDALONE_READY",
      timestamp: Date.now(),
    });
  }

  public static sendToPlatform(type: string, payload: any) {
    CasinoBridge.recordLog("OUT", type, payload);

    if (typeof window !== "undefined") {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type, payload }, "*");
        }
      } catch {
        // Cross-origin safe
      }
    }
  }

  public static notifyBetPlaced(betIndex: number, amount: number) {
    this.sendToPlatform("CASINO_BET_PLACED", {
      betIndex,
      amount,
      balanceAfter: this.engineRef ? this.engineRef.balance : undefined,
      timestamp: Date.now(),
    });
  }

  public static notifyBetCancelled(betIndex: number, amount: number) {
    this.sendToPlatform("CASINO_BET_CANCELLED", {
      betIndex,
      amount,
      balanceAfter: this.engineRef ? this.engineRef.balance : undefined,
      timestamp: Date.now(),
    });
  }

  public static notifyCashout(betIndex: number, amount: number, multiplier: number, winAmount: number) {
    this.sendToPlatform("CASINO_CASHOUT", {
      betIndex,
      amount,
      multiplier,
      winAmount,
      balanceAfter: this.engineRef ? this.engineRef.balance : undefined,
      timestamp: Date.now(),
    });
  }

  public static notifyRoundEnd(result: ProvablyFairData) {
    this.sendToPlatform("CASINO_ROUND_END", {
      roundId: result.roundId,
      crashMultiplier: result.crashMultiplier,
      hash: result.hash,
      serverSeed: result.serverSeed,
      clientSeed: result.clientSeed,
      nonce: result.nonce,
      timestamp: Date.now(),
    });
  }

  public static notifyBalanceChanged(balance: number) {
    this.sendToPlatform("CASINO_BALANCE_CHANGED", {
      balance,
      timestamp: Date.now(),
    });
  }

  // --- LOGGING & MONITORING FOR DEVELOPER/OPERATOR SUITE ---
  private static recordLog(direction: "IN" | "OUT", type: string, payload: any) {
    const item: CasinoEventLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      direction,
      type,
      payload,
      timestamp: Date.now(),
    };

    this.eventLogs = [item, ...this.eventLogs.slice(0, 49)];
    this.subscribers.forEach((cb) => cb(this.eventLogs));
  }

  public static getLogs(): CasinoEventLogItem[] {
    return this.eventLogs;
  }

  public static clearLogs() {
    this.eventLogs = [];
    this.subscribers.forEach((cb) => cb([]));
  }

  public static subscribeLogs(subscriber: EventLogSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.eventLogs);
    return () => this.subscribers.delete(subscriber);
  }
}
