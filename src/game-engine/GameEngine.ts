// ============================================================================
// CASINO CRASH GAME ENGINE
// Core Orchestrator for Animation, State, Betting, and Platform Integration
// ============================================================================

import {
  GameEngineState,
  ProvablyFairData,
  ActiveBet,
  LiveBetEntry,
  CrashHistoryItem,
  CasinoEngineConfig,
  CasinoEngineListener,
} from "./types";
import { ProvablyFairEngine } from "./ProvablyFair";
import { AudioEngine } from "./AudioEngine";
import { CasinoBridge } from "../api/CasinoBridge";
import { RUNTIME_CONFIG } from "../config";

const DEFAULT_CONFIG: CasinoEngineConfig = {
  minBet: RUNTIME_CONFIG.minBet,
  maxBet: RUNTIME_CONFIG.maxBet,
  chips: RUNTIME_CONFIG.chips,
  currency: RUNTIME_CONFIG.currency,
  currencySymbol: RUNTIME_CONFIG.currencySymbol,
  initialBalance: RUNTIME_CONFIG.balance,
  houseEdgePercent: 3,
  roundWaitTimeSec: 5,
  tickIntervalMs: 50,
  demoMode: true,
};

// Initial simulated history matching the user's authentic Aviator reference
const INITIAL_HISTORY: CrashHistoryItem[] = [
  { roundId: "RD-HIST-01", multiplier: 1.27, color: "#38bdf8", hash: "9a2f7c01b5", timestamp: Date.now() - 300000 },
  { roundId: "RD-HIST-02", multiplier: 1.21, color: "#38bdf8", hash: "8b3c6e12c4", timestamp: Date.now() - 280000 },
  { roundId: "RD-HIST-03", multiplier: 2.31, color: "#a855f7", hash: "7c4d5f23d3", timestamp: Date.now() - 260000 },
  { roundId: "RD-HIST-04", multiplier: 3.10, color: "#a855f7", hash: "6d5e4a34e2", timestamp: Date.now() - 240000 },
  { roundId: "RD-HIST-05", multiplier: 1.50, color: "#38bdf8", hash: "5e6f3b45f1", timestamp: Date.now() - 220000 },
  { roundId: "RD-HIST-06", multiplier: 10.28, color: "#e879f9", hash: "4f7a2c56a0", timestamp: Date.now() - 200000 },
  { roundId: "RD-HIST-07", multiplier: 1.98, color: "#38bdf8", hash: "3e8b1d67b1", timestamp: Date.now() - 180000 },
  { roundId: "RD-HIST-08", multiplier: 2.65, color: "#a855f7", hash: "2d9c0e78c2", timestamp: Date.now() - 160000 },
  { roundId: "RD-HIST-09", multiplier: 1.96, color: "#38bdf8", hash: "1cae9f89d3", timestamp: Date.now() - 140000 },
  { roundId: "RD-HIST-10", multiplier: 1.72, color: "#38bdf8", hash: "0bfd8e9ae4", timestamp: Date.now() - 120000 },
  { roundId: "RD-HIST-11", multiplier: 1.02, color: "#38bdf8", hash: "faec7daef5", timestamp: Date.now() - 100000 },
  { roundId: "RD-HIST-12", multiplier: 10.97, color: "#e879f9", hash: "ebdb6cbfe6", timestamp: Date.now() - 80000 },
  { roundId: "RD-HIST-13", multiplier: 1.19, color: "#38bdf8", hash: "daca5bcdf7", timestamp: Date.now() - 60000 },
  { roundId: "RD-HIST-14", multiplier: 2.03, color: "#a855f7", hash: "c9b94abde8", timestamp: Date.now() - 40000 },
];

export class GameEngine {
  private static instance: GameEngine | null = null;

  public config: CasinoEngineConfig = { ...DEFAULT_CONFIG };
  public state: GameEngineState = "WAITING";
  public currentMultiplier = 1.0;
  public progressRatio = 0.0;
  public currentRoundResult: ProvablyFairData | null = null;
  public queuedMultiplier: number | null = null;
  public roundNonce = 1001;
  public balance: number = DEFAULT_CONFIG.initialBalance;

  // Active bets for Console 0 and Console 1 (default 10.00 each, matching screenshot)
  public activeBets: [ActiveBet, ActiveBet] = [
    { betIndex: 0, amount: 10, status: "none", cashoutStatus: "none", isPendingNextRound: false },
    { betIndex: 1, amount: 10, status: "none", cashoutStatus: "none", isPendingNextRound: false },
  ];

  public history: CrashHistoryItem[] = [...INITIAL_HISTORY];
  public liveBets: LiveBetEntry[] = [];
  public waitCountdown = 5;

  private listeners: Set<CasinoEngineListener> = new Set();
  private waitTimer: ReturnType<typeof setInterval> | null = null;
  private flightAnimationTimer: ReturnType<typeof requestAnimationFrame> | null = null;
  private flightStartTime = 0;
  private flightDurationMs = 0;

  private constructor() {
    this.initSimulatedLiveBets();
  }

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
      if (typeof window !== "undefined") {
        (window as unknown as { CasinoGameEngine: GameEngine }).CasinoGameEngine = GameEngine.instance;
      }
    }
    return GameEngine.instance;
  }

  // ==========================================================================
  // CASINO PLATFORM HOOKS (Phase 04 Specification)
  // ==========================================================================

  /**
   * Initializes the Game Engine with casino platform settings
   */
  public initialize(customConfig?: Partial<CasinoEngineConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
      if (customConfig.initialBalance !== undefined) {
        this.balance = customConfig.initialBalance;
      }
    }
    this.startWaitPhase();
  }

  /**
   * Starts game loop
   */
  public start() {
    this.startWaitPhase();
  }

  /**
   * External Casino Platform hook to inject predetermined crash result
   */
  public receiveResult(result: ProvablyFairData) {
    this.currentRoundResult = result;
  }

  /**
   * Forces the next round crash multiplier (ideal for testing, operator hooks, and sandbox demos)
   */
  public forceNextCrash(multiplier: number) {
    this.queuedMultiplier = Math.max(1.0, multiplier);
  }

  /**
   * Dynamically sets player balance from casino wallet
   */
  public setBalance(newBalance: number) {
    this.balance = Math.max(0, newBalance);
    this.notifyBalanceUpdate();
    CasinoBridge.notifyBalanceChanged(this.balance);
  }

  /**
   * Sets game currency code and symbol
   */
  public setCurrency(currency: string, currencySymbol: string) {
    this.config.currency = currency;
    this.config.currencySymbol = currencySymbol;
    this.notifyBalanceUpdate();
  }

  /**
   * Triggers flight animation to a specific state & multiplier
   */
  public playAnimation(targetState: GameEngineState, multiplier: number) {
    this.state = targetState;
    this.currentMultiplier = multiplier;
    this.notifyStateChange(targetState);
    this.notifyMultiplierTick(multiplier, this.progressRatio);
  }

  /**
   * Celebrates player win
   */
  public showWin(betIndex: number, winAmount: number, multiplier: number) {
    AudioEngine.playWinSound();
    this.listeners.forEach((l) => l.onBetResult && l.onBetResult(betIndex, winAmount, multiplier));
  }

  /**
   * Resets the round state
   */
  public reset() {
    this.stopFlightLoop();
    if (this.waitTimer) clearInterval(this.waitTimer);
    this.currentMultiplier = 1.0;
    this.progressRatio = 0.0;
    this.state = "WAITING";
    this.notifyStateChange(this.state);
  }

  // ==========================================================================
  // SUBSCRIPTIONS & EVENT DISPATCH
  // ==========================================================================

  public subscribe(listener: CasinoEngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyStateChange(state: GameEngineState) {
    this.listeners.forEach((l) => l.onStateChange && l.onStateChange(state));
  }

  private notifyMultiplierTick(multiplier: number, progressRatio: number) {
    this.listeners.forEach((l) => l.onMultiplierTick && l.onMultiplierTick(multiplier, progressRatio));
  }

  private notifyBalanceUpdate() {
    this.listeners.forEach((l) => l.onBalanceUpdate && l.onBalanceUpdate(this.balance));
  }

  private notifyCountdownTick(sec: number) {
    this.listeners.forEach((l) => l.onCountdownTick && l.onCountdownTick(sec));
  }

  // ==========================================================================
  // CORE ROUND LIFECYCLE
  // ==========================================================================

  private startWaitPhase() {
    this.state = "WAITING";
    this.currentMultiplier = 1.0;
    this.progressRatio = 0.0;
    this.waitCountdown = this.config.roundWaitTimeSec;
    this.notifyStateChange(this.state);
    this.notifyCountdownTick(this.waitCountdown);

    // Apply any pending bets queued for next round
    this.activeBets.forEach((bet) => {
      if (bet.isPendingNextRound) {
        if (this.balance >= bet.amount) {
          this.balance -= bet.amount;
          bet.status = "success";
          bet.cashoutStatus = "none";
          bet.isPendingNextRound = false;
        } else {
          bet.isPendingNextRound = false;
          bet.status = "none";
        }
      } else if (bet.status === "failed" || bet.status === "success") {
        bet.status = "none";
        bet.cashoutStatus = "none";
      }
    });
    this.notifyBalanceUpdate();

    // Prepare simulated other players bets
    this.initSimulatedLiveBets();

    if (this.waitTimer) clearInterval(this.waitTimer);
    this.waitTimer = setInterval(() => {
      this.waitCountdown -= 1;
      this.notifyCountdownTick(Math.max(0, this.waitCountdown));
      if (this.waitCountdown <= 3 && this.waitCountdown > 0) {
        AudioEngine.playTickSound();
      }

      if (this.waitCountdown <= 0) {
        if (this.waitTimer) clearInterval(this.waitTimer);
        this.startTakeoffPhase();
      }
    }, 1000);
  }

  private startTakeoffPhase() {
    // Lock bets (check if developer or platform queued a forced multiplier)
    if (this.queuedMultiplier && this.queuedMultiplier >= 1.0) {
      this.currentRoundResult = ProvablyFairEngine.generateForcedRound(
        this.roundNonce++,
        this.queuedMultiplier
      );
      this.queuedMultiplier = null;
    } else if (!this.currentRoundResult) {
      this.currentRoundResult = ProvablyFairEngine.generateRound(this.roundNonce++);
    }

    // Authentic crash game multiplier curve:
    // It should reach 2x at ~4.5s, 10x at ~15s, 100x at ~30s.
    // Math.exp(elapsedMs / 6500)
    const targetCrash = this.currentRoundResult.crashMultiplier;
    this.flightDurationMs = Math.log(targetCrash) * 6500;

    this.startFlightPhase();
  }

  private startFlightPhase() {
    this.state = "ANIM_STARTED";
    this.flightStartTime = 0; // Will be set on the very first frame for exact synchronization
    this.currentMultiplier = 1.0;
    this.progressRatio = 0.0;
    this.notifyStateChange(this.state);

    this.flightAnimationTimer = requestAnimationFrame(this.runFlightLoop);
  }

  private runFlightLoop = (time?: number) => {
    const now = time || performance.now();
    
    // Initialize exactly on the very first frame to ensure zero execution cycle desync
    if (this.flightStartTime === 0) {
      this.flightStartTime = now;
    }

    const elapsed = now - this.flightStartTime;
    const progress = this.flightDurationMs > 0 ? Math.min(1.0, elapsed / this.flightDurationMs) : 1.0;
    this.progressRatio = progress;

    const targetCrash = this.currentRoundResult ? this.currentRoundResult.crashMultiplier : 2.0;

    // Authentic crash game smooth exponential growth: multiplier = Math.exp(elapsed / 6500)
    const rawMultiplier = Math.exp(elapsed / 6500);
    this.currentMultiplier = Math.min(targetCrash, Math.max(1.0, parseFloat(rawMultiplier.toFixed(2))));

    // Sound update
    AudioEngine.updatePlaneSound(this.currentMultiplier, true);

    // Check Auto-Cashouts
    this.activeBets.forEach((bet) => {
      if (
        bet.status === "success" &&
        bet.cashoutStatus === "none" &&
        bet.autoCashoutMultiplier &&
        bet.autoCashoutMultiplier > 1.0 &&
        this.currentMultiplier >= bet.autoCashoutMultiplier
      ) {
        this.cashOut(bet.betIndex);
      }
    });

    // Update simulated multiplayer cashouts
    this.updateSimulatedCashouts(this.currentMultiplier);

    this.notifyMultiplierTick(this.currentMultiplier, this.progressRatio);

    if (progress >= 1.0 || this.currentMultiplier >= targetCrash) {
      this.crashPlane(targetCrash);
    } else {
      this.flightAnimationTimer = requestAnimationFrame(this.runFlightLoop);
    }
  };

  private crashPlane(finalMultiplier: number) {
    this.stopFlightLoop();
    this.state = "ANIM_CRASHED";
    this.currentMultiplier = finalMultiplier;
    AudioEngine.playCrashSound();
    this.notifyStateChange(this.state);

    // Record player bet losses if not cashed out
    this.activeBets.forEach((bet) => {
      if (bet.status === "success" && bet.cashoutStatus === "none") {
        bet.cashoutStatus = "failed";
      }
    });

    // Add to history
    if (this.currentRoundResult) {
      const color =
        finalMultiplier < 2.0 ? "#38bdf8" : finalMultiplier < 10.0 ? "#a855f7" : "#eab308";
      const item: CrashHistoryItem = {
        roundId: this.currentRoundResult.roundId,
        multiplier: finalMultiplier,
        color,
        hash: this.currentRoundResult.hash,
        serverSeed: this.currentRoundResult.serverSeed,
        clientSeed: this.currentRoundResult.clientSeed,
        nonce: this.currentRoundResult.nonce,
        timestamp: Date.now(),
      };
      this.history = [item, ...this.history.slice(0, 30)];
      this.listeners.forEach((l) => l.onHistoryUpdate && l.onHistoryUpdate(this.history));
      this.listeners.forEach((l) => l.onCrash && l.onCrash(this.currentRoundResult!));
      CasinoBridge.notifyRoundEnd(this.currentRoundResult);
    }

    // Prepare next round result
    this.currentRoundResult = null;

    // Wait 3.5 seconds to show "FLEW AWAY!" then reset to waiting
    setTimeout(() => {
      this.state = "ROUND_ENDED";
      this.notifyStateChange(this.state);
      setTimeout(() => {
        this.startWaitPhase();
      }, 500);
    }, 3200);
  }

  private stopFlightLoop() {
    if (this.flightAnimationTimer) {
      cancelAnimationFrame(this.flightAnimationTimer);
      this.flightAnimationTimer = null;
    }
    AudioEngine.stopPlaneSound();
  }

  // ==========================================================================
  // USER BETTING ACTIONS
  // ==========================================================================

  public placeBet(betIndex: number, amount: number, autoCashout?: number) {
    AudioEngine.playClickSound();
    const bet = this.activeBets[betIndex];

    if (this.state === "WAITING") {
      if (this.balance < amount) return false;
      this.balance -= amount;
      bet.amount = amount;
      bet.status = "success";
      bet.cashoutStatus = "none";
      bet.autoCashoutMultiplier = autoCashout;
      bet.isPendingNextRound = false;
      this.notifyBalanceUpdate();
      CasinoBridge.notifyBetPlaced(betIndex, amount);
      return true;
    } else {
      // Queue for next round
      bet.amount = amount;
      bet.autoCashoutMultiplier = autoCashout;
      bet.isPendingNextRound = true;
      CasinoBridge.notifyBetPlaced(betIndex, amount);
      return true;
    }
  }

  public cancelBet(betIndex: number) {
    AudioEngine.playClickSound();
    const bet = this.activeBets[betIndex];

    if (bet.isPendingNextRound) {
      bet.isPendingNextRound = false;
      CasinoBridge.notifyBetCancelled(betIndex, bet.amount);
      return true;
    }

    if (this.state === "WAITING" && bet.status === "success") {
      this.balance += bet.amount;
      bet.status = "none";
      bet.cashoutStatus = "none";
      this.notifyBalanceUpdate();
      CasinoBridge.notifyBetCancelled(betIndex, bet.amount);
      return true;
    }

    return false;
  }

  public cashOut(betIndex: number) {
    const bet = this.activeBets[betIndex];
    if (this.state !== "ANIM_STARTED" || bet.status !== "success" || bet.cashoutStatus !== "none") {
      return false;
    }

    const winMultiplier = this.currentMultiplier;
    const winAmount = parseFloat((bet.amount * winMultiplier).toFixed(2));

    bet.cashoutStatus = "success";
    bet.cashedMultiplier = winMultiplier;
    bet.winAmount = winAmount;

    this.balance += winAmount;
    this.notifyBalanceUpdate();
    this.showWin(betIndex, winAmount, winMultiplier);
    CasinoBridge.notifyCashout(betIndex, bet.amount, winMultiplier, winAmount);
    return true;
  }

  public depositDemo(amount = 2000) {
    this.balance += amount;
    this.notifyBalanceUpdate();
  }

  // ==========================================================================
  // MULTIPLAYER SIMULATED PEER BETS
  // ==========================================================================

  private initSimulatedLiveBets() {
    const names = [
      "Vikram_R", "Priya_88", "CryptoKing", "Rahul_K", "AviatorPro",
      "Neha_Sharma", "LuckyStrike", "Alex_V", "Deepak_Casino", "Star_Player",
      "Maya_VIP", "Rajesh_99", "Ananya_B", "Tiger_Win", "Rohan_S",
      "Kavita_M", "Bullet_Bet", "Thunder_Ace", "Sanjay_77", "GoldenEagle"
    ];

    const bets: LiveBetEntry[] = [];
    const count = 15 + Math.floor(Math.random() * 8);

    for (let i = 0; i < count; i++) {
      const name = names[i % names.length];
      const amount = [50, 100, 200, 500, 1000, 2500][Math.floor(Math.random() * 6)];
      // Target multiplier when they will cash out
      const cashTarget = parseFloat((1.15 + Math.random() * 4.5).toFixed(2));
      bets.push({
        id: `bet-${i}-${Date.now()}`,
        username: name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        betAmount: amount,
        crashedAt: cashTarget,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    this.liveBets = bets;
    this.listeners.forEach((l) => l.onLiveBetsUpdate && l.onLiveBetsUpdate(this.liveBets));
  }

  private updateSimulatedCashouts(currentMult: number) {
    let changed = false;
    this.liveBets.forEach((b) => {
      if (!b.cashout && b.crashedAt && currentMult >= b.crashedAt) {
        b.cashout = b.crashedAt;
        changed = true;
      }
    });
    if (changed) {
      this.listeners.forEach((l) => l.onLiveBetsUpdate && l.onLiveBetsUpdate([...this.liveBets]));
    }
  }
}
