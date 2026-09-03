// ============================================================================
// CASINO GAME BOARD - CORE PRESENTATIONAL & INTERACTION COMPONENT
// ============================================================================

import React, { useState, useEffect } from "react";
import { GameEngine } from "../../game-engine/GameEngine";
import {
  GameEngineState,
  CrashHistoryItem,
  LiveBetEntry,
  ActiveBet,
} from "../../game-engine/types";
import { TopLogoBar } from "../TopLogoBar";
import { HistoryRibbon } from "./HistoryRibbon";
import { AviatorCanvas } from "../pixicomp/AviatorCanvas";
import { MultiplierDisplay } from "./MultiplierDisplay";
import { BetConsole } from "./BetConsole";
import { BetBoard } from "./BetBoard";
import { FairVerificationModal } from "../modals/FairVerificationModal";
import { IntegrationModal } from "../modals/IntegrationModal";
import RuleModal from "../RuleDialog";
import SettingModal from "../SettingModal";
import HistoryModal from "../HistoryModal";
import { WinCelebration } from "../WinCelebration";
import { AudioEngine } from "../../game-engine/AudioEngine";
import { CasinoBridge } from "../../api/CasinoBridge";
import { OfflineIndicator } from "../OfflineIndicator";

export const GameBoard: React.FC = () => {
  const engine = GameEngine.getInstance();

  // Reactive state synced with GameEngine
  const [engineState, setEngineState] = useState<GameEngineState>(engine.state);
  const [multiplier, setMultiplier] = useState<number>(engine.currentMultiplier);
  const [progressRatio, setProgressRatio] = useState<number>(engine.progressRatio);
  const [countdown, setCountdown] = useState<number>(engine.waitCountdown);
  const [balance, setBalance] = useState<number>(engine.balance);
  const [history, setHistory] = useState<CrashHistoryItem[]>(engine.history);
  const [liveBets, setLiveBets] = useState<LiveBetEntry[]>(engine.liveBets);
  const [activeBets, setActiveBets] = useState<[ActiveBet, ActiveBet]>([
    { ...engine.activeBets[0] },
    { ...engine.activeBets[1] },
  ]);

  // Modals & Popups
  const [fairModalOpen, setFairModalOpen] = useState(false);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<CrashHistoryItem | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(AudioEngine.soundEnabled);
  const [chips, setChips] = useState<number[]>(engine.config.chips);
  const [winToast, setWinToast] = useState<{
    amount: number;
    multiplier: number;
    betIndex: number;
  } | null>(null);

  // Live Bets drawer toggle (default closed for full-screen immersive Aviator experience)
  const [showLiveBets, setShowLiveBets] = useState(false);

  useEffect(() => {
    // Initialize Casino Bridge
    CasinoBridge.initialize(engine);

    // Subscribe to engine events
    const unsubscribe = engine.subscribe({
      onStateChange: (newState) => {
        setEngineState(newState);
        setActiveBets([{ ...engine.activeBets[0] }, { ...engine.activeBets[1] }]);
      },
      onMultiplierTick: (mult, prog) => {
        setMultiplier(mult);
        setProgressRatio(prog);
      },
      onCountdownTick: (sec) => {
        setCountdown(sec);
      },
      onBalanceUpdate: (newBal) => {
        setBalance(newBal);
      },
      onHistoryUpdate: (newHist) => {
        setHistory([...newHist]);
      },
      onLiveBetsUpdate: (newBets) => {
        setLiveBets([...newBets]);
      },
      onBetResult: (betIdx, winAmt, mult) => {
        setWinToast({ amount: winAmt, multiplier: mult, betIndex: betIdx });
        setActiveBets([{ ...engine.activeBets[0] }, { ...engine.activeBets[1] }]);
      },
    });

    // Start engine if waiting
    engine.start();

    return () => {
      unsubscribe();
    };
  }, [engine]);

  // Betting Actions
  const handlePlaceBet = (betIndex: number, amount: number, autoCashout?: number) => {
    const ok = engine.placeBet(betIndex, amount, autoCashout);
    if (ok) {
      setActiveBets([{ ...engine.activeBets[0] }, { ...engine.activeBets[1] }]);
    }
  };

  const handleCancelBet = (betIndex: number) => {
    engine.cancelBet(betIndex);
    setActiveBets([{ ...engine.activeBets[0] }, { ...engine.activeBets[1] }]);
  };

  const handleCashout = (betIndex: number) => {
    engine.cashOut(betIndex);
  };

  const handleSelectRound = (round: CrashHistoryItem) => {
    setSelectedRound(round);
    setFairModalOpen(true);
  };

  const handleToggleSound = () => {
    const next = AudioEngine.toggleSound();
    setSoundEnabled(next);
  };

  const handleRefillDemo = () => {
    engine.depositDemo(2500);
  };

  const handleSaveChips = (newChips: number[]) => {
    setChips(newChips);
    engine.config.chips = newChips;
  };

  return (
    <div
      id="aviator-main-layout"
      className="flex flex-col w-full h-screen h-[100dvh] max-h-screen bg-[#000000] text-white overflow-hidden"
    >
      {/* 1. TOP LOGO & WALLET BAR */}
      <TopLogoBar
        balance={balance}
        currencySymbol={engine.config.currencySymbol}
        onOpenRules={() => setRulesOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenFairModal={() => {
          if (history.length > 0) {
            setSelectedRound(history[0]);
            setFairModalOpen(true);
          }
        }}
        onOpenIntegration={() => setIntegrationModalOpen(true)}
        onRefillDemo={handleRefillDemo}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onToggleLiveBets={() => setShowLiveBets(!showLiveBets)}
        showLiveBets={showLiveBets}
      />

      {/* 2. RECENT MULTIPLIERS RIBBON (Directly below Top Bar, edge-to-edge) */}
      <HistoryRibbon
        history={history}
        onSelectRound={handleSelectRound}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
      />

      {/* 3. MAIN GAME SECTION (Full width & height, zero unnecessary outer spacing) */}
      <div className="flex-1 flex overflow-hidden relative w-full bg-[#000000]">
        {/* Optional Slide-out Drawer for Live Bets Feed */}
        {showLiveBets && (
          <div className="absolute inset-y-0 left-0 z-40 w-72 sm:w-80 shadow-2xl bg-[#10121a] border-r border-white/10 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#141620]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Bets Feed</span>
              <button
                onClick={() => setShowLiveBets(false)}
                className="text-white/60 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <BetBoard
                liveBets={liveBets}
                activeBets={activeBets}
                currencySymbol={engine.config.currencySymbol}
              />
            </div>
          </div>
        )}

        {/* Aviator Game Arena + Dual Consoles */}
        <div className="flex-1 flex flex-col h-full w-full max-w-[1400px] mx-auto overflow-hidden p-0 sm:p-2 md:p-2.5 gap-0 sm:gap-2 md:gap-2.5">
          {/* Flight Arena Canvas Card */}
          <div className="flex-1 relative w-full rounded-none sm:rounded-2xl border-0 sm:border border-white/10 bg-black overflow-hidden min-h-0 shadow-2xl">
            <AviatorCanvas
              state={engineState}
              multiplier={multiplier}
              progressRatio={progressRatio}
            />
            <MultiplierDisplay
              state={engineState}
              multiplier={multiplier}
              countdown={countdown}
            />
          </div>

          {/* Betting Controls Consoles Area: Responsive 2-Column Side-by-Side Grid */}
          <div className="grid grid-cols-2 gap-0 sm:gap-2 md:gap-3 w-full flex-shrink-0">
            <BetConsole
              betIndex={0}
              bet={activeBets[0]}
              engineState={engineState}
              currentMultiplier={multiplier}
              balance={balance}
              currencySymbol={engine.config.currencySymbol}
              chips={chips}
              onPlaceBet={handlePlaceBet}
              onCancelBet={handleCancelBet}
              onCashout={handleCashout}
            />
            <BetConsole
              betIndex={1}
              bet={activeBets[1]}
              engineState={engineState}
              currentMultiplier={multiplier}
              balance={balance}
              currencySymbol={engine.config.currencySymbol}
              chips={chips}
              onPlaceBet={handlePlaceBet}
              onCancelBet={handleCancelBet}
              onCashout={handleCashout}
            />
          </div>
        </div>
      </div>

      {/* 3. MODALS & POPUPS */}
      <IntegrationModal
        isOpen={integrationModalOpen}
        onClose={() => setIntegrationModalOpen(false)}
        engine={engine}
      />

      <FairVerificationModal
        open={fairModalOpen}
        onClose={() => setFairModalOpen(false)}
        selectedRound={selectedRound}
      />

      <RuleModal open={rulesOpen} setOpen={setRulesOpen} />

      <SettingModal
        open={settingsOpen}
        setOpen={setSettingsOpen}
        chips={chips}
        onSaveChips={handleSaveChips}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <HistoryModal
        open={historyModalOpen}
        setOpen={setHistoryModalOpen}
        history={history}
        onSelectRound={handleSelectRound}
        currencySymbol={engine.config.currencySymbol}
      />

      <WinCelebration
        winData={winToast}
        currencySymbol={engine.config.currencySymbol}
        onDismiss={() => setWinToast(null)}
      />

      {/* 4. PWA OFFLINE INDICATOR */}
      <OfflineIndicator />
    </div>
  );
};
