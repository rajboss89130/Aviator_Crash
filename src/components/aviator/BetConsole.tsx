// ============================================================================
// CASINO BET CONSOLE (PRIMARY & SECONDARY)
// Features: Manual/Auto Betting, Stepper, Quick Chips, Auto-Cashout Multiplier
// ============================================================================

import React, { useState } from "react";
import { ActiveBet, GameEngineState } from "../../game-engine/types";

interface BetConsoleProps {
  betIndex: number;
  bet: ActiveBet;
  engineState: GameEngineState;
  currentMultiplier: number;
  balance: number;
  currencySymbol: string;
  chips: number[];
  onPlaceBet: (betIndex: number, amount: number, autoCashout?: number) => void;
  onCancelBet: (betIndex: number) => void;
  onCashout: (betIndex: number) => void;
}

export const BetConsole: React.FC<BetConsoleProps> = ({
  betIndex,
  bet,
  engineState,
  currentMultiplier,
  balance,
  currencySymbol,
  chips,
  onPlaceBet,
  onCancelBet,
  onCashout,
}) => {
  const [tab, setTab] = useState<"bet" | "auto">("bet");
  const [amount, setAmount] = useState<number>(bet.amount || (betIndex === 0 ? 100 : 200));
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState<number>(2.0);

  const handleAmountChange = (newVal: number) => {
    const clamped = Math.max(10, Math.min(10000, newVal));
    setAmount(clamped);
  };

  const handleQuickChip = (chip: number) => {
    setAmount(chip);
  };

  const handleMainAction = () => {
    if (engineState === "ANIM_STARTED" && bet.status === "success" && bet.cashoutStatus === "none") {
      onCashout(betIndex);
    } else if (bet.status === "success" || bet.isPendingNextRound) {
      onCancelBet(betIndex);
    } else {
      const autoCash = autoCashoutEnabled ? autoCashoutValue : undefined;
      onPlaceBet(betIndex, amount, autoCash);
    }
  };

  // Determine Main Button Appearance
  const isCashingOut = engineState === "ANIM_STARTED" && bet.status === "success" && bet.cashoutStatus === "none";
  const isCashedOut = bet.cashoutStatus === "success";
  const isPending = bet.isPendingNextRound;
  const isWaitingWithBet = engineState === "WAITING" && bet.status === "success";

  return (
    <div
      id={`bet-console-${betIndex}`}
      className={`flex-1 w-full bg-[#12141c] border-t sm:border border-white/10 rounded-none sm:rounded-2xl p-1.5 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 shadow-xl select-none ${betIndex === 0 ? 'border-r' : ''}`}
    >
      {/* 1. Top Mode Switcher & Auto Cashout Header Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Centered on mobile, aligned on desktop: [ Bet | Auto ] pill */}
        <div className="flex mx-auto md:mx-0 bg-[#0a0b10] p-0.5 rounded-full border border-white/5 flex-shrink-0">
          <button
            onClick={() => setTab("bet")}
            className={`px-3.5 sm:px-4 md:px-3.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full transition-all cursor-pointer ${
              tab === "bet"
                ? "bg-[#282c38] text-white shadow-sm"
                : "text-[#7e8597] hover:text-white"
            }`}
          >
            Bet
          </button>
          <button
            onClick={() => setTab("auto")}
            className={`px-3.5 sm:px-4 md:px-3.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full transition-all cursor-pointer ${
              tab === "auto"
                ? "bg-[#282c38] text-white shadow-sm"
                : "text-[#7e8597] hover:text-white"
            }`}
          >
            Auto
          </button>
        </div>

        {/* Auto Cashout Controls - Inline on Desktop, saves vertical height */}
        {tab === "auto" && (
          <div className="hidden md:flex items-center gap-2 bg-[#0a0b10] border border-white/10 rounded-full px-2 py-0.5 animate-fade-in">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCashoutEnabled}
                onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                className="w-3 h-3 rounded accent-[#22c55e]"
              />
              <span className="text-[10px] text-[#94a3b8] font-bold whitespace-nowrap">Auto Cash</span>
            </label>

            <div className="flex items-center gap-1 bg-[#181a24] px-1.5 py-0.5 rounded-full border border-white/10">
              <input
                type="number"
                step="0.1"
                min="1.01"
                max="100"
                disabled={!autoCashoutEnabled}
                value={autoCashoutValue}
                onChange={(e) => setAutoCashoutValue(parseFloat(e.target.value) || 1.1)}
                className={`w-9 bg-transparent text-right font-bold text-[10px] sm:text-xs outline-none ${
                  autoCashoutEnabled ? "text-[#f59e0b]" : "text-white/30"
                }`}
              />
              <span className="text-[10px] font-bold text-white/50">x</span>
            </div>
          </div>
        )}
      </div>

      {/* Auto Cashout Controls - Mobile Only (Below Switcher) */}
      {tab === "auto" && (
        <div className="flex md:hidden items-center justify-between bg-[#0a0b10] border border-white/10 rounded-lg px-2 py-0.5 animate-fade-in">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCashoutEnabled}
              onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
              className="w-3 h-3 rounded accent-[#22c55e]"
            />
            <span className="text-[10px] text-[#94a3b8] font-semibold whitespace-nowrap">Auto Cash</span>
          </label>

          <div className="flex items-center gap-1 bg-[#181a24] px-1.5 py-0.5 rounded border border-white/10">
            <input
              type="number"
              step="0.1"
              min="1.01"
              max="100"
              disabled={!autoCashoutEnabled}
              value={autoCashoutValue}
              onChange={(e) => setAutoCashoutValue(parseFloat(e.target.value) || 1.1)}
              className={`w-10 bg-transparent text-right font-bold text-[10px] sm:text-xs outline-none ${
                autoCashoutEnabled ? "text-[#f59e0b]" : "text-white/30"
              }`}
            />
            <span className="text-[10px] sm:text-xs font-bold text-white/50">x</span>
          </div>
        </div>
      )}

      {/* 2. Main Interactive Section: Horizontal Split on Desktop (`md:flex md:flex-row md:items-stretch md:gap-2.5`), Vertical on Mobile */}
      <div className="flex flex-col md:flex-row md:items-stretch gap-1.5 md:gap-2.5 flex-1">
        {/* Left Sub-Section (Stepper + Chips) */}
        <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5">
          {/* Stepper Input: [ -  10.00  + ] */}
          <div className="flex items-center justify-between bg-[#0a0b10] border border-white/10 rounded-full px-1.5 py-0.5 h-7 sm:h-7.5 md:h-8">
            <button
              onClick={() => handleAmountChange(amount - 10)}
              title="Decrease Bet"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#181a24] hover:bg-[#252837] text-[#9ca3af] hover:text-white flex items-center justify-center font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
            >
              —
            </button>
            <div className="flex items-center justify-center flex-1 px-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 10)}
                className="w-full bg-transparent text-center text-white font-bold font-multiplier text-xs sm:text-sm outline-none"
              />
            </div>
            <button
              onClick={() => handleAmountChange(amount + 10)}
              title="Increase Bet"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#181a24] hover:bg-[#252837] text-[#9ca3af] hover:text-white flex items-center justify-center font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
            >
              +
            </button>
          </div>

          {/* Quick Chips: 2x2 Grid on Mobile, Sleek 1x4 Row on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-1.5">
            {(chips && chips.length >= 4 ? chips.slice(0, 4) : [100, 200, 500, 1000]).map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickChip(chip)}
                className={`py-0.5 md:py-1 rounded-md md:rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  amount === chip
                    ? "bg-[#282c38] text-white border border-white/20 shadow-sm"
                    : "bg-[#181a24] text-[#8e95a5] hover:bg-[#222533] hover:text-white border border-white/5"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Right Sub-Section: Main Action Button (Side-by-side on desktop, compact & powerful) */}
        <div className="w-full md:w-36 lg:w-44 flex-shrink-0 flex items-stretch pt-0.5 md:pt-0">
          {/* Active Flight Cashout State */}
          {isCashingOut && (
            <button
              onClick={handleMainAction}
              className="w-full h-10 sm:h-11 md:h-full min-h-[44px] md:min-h-[64px] rounded-lg md:rounded-xl bg-gradient-to-b from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#b45309] text-black font-black flex flex-col items-center justify-center gap-0 shadow-[0_2px_12px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 cursor-pointer"
            >
              <span className="text-[10px] sm:text-xs md:text-xs uppercase tracking-wider font-black leading-none">
                CASH OUT
              </span>
              <span className="text-xs sm:text-sm md:text-sm font-multiplier font-black leading-tight mt-0.5">
                {(amount * currentMultiplier).toFixed(2)} {currencySymbol}
              </span>
              <span className="text-[9px] font-bold opacity-80 leading-none">
                @{currentMultiplier.toFixed(2)}x
              </span>
            </button>
          )}

          {/* Already Cashed Out State */}
          {isCashedOut && (
            <div className="w-full h-10 sm:h-11 md:h-full min-h-[44px] md:min-h-[64px] rounded-lg md:rounded-xl bg-[#112419] border border-[#22c55e]/40 text-[#22c55e] flex flex-col items-center justify-center">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold leading-none">CASHED OUT</span>
              <span className="text-xs sm:text-sm font-multiplier font-black leading-tight mt-0.5">
                +{bet.winAmount?.toFixed(2)} {currencySymbol}
              </span>
              <span className="text-[9px] opacity-80 leading-none">@{bet.cashedMultiplier?.toFixed(2)}x</span>
            </div>
          )}

          {/* Waiting with Placed Bet State -> CANCEL */}
          {isWaitingWithBet && (
            <button
              onClick={handleMainAction}
              className="w-full h-10 sm:h-11 md:h-full min-h-[44px] md:min-h-[64px] rounded-lg md:rounded-xl bg-gradient-to-b from-[#ef4444] to-[#b91c1c] hover:from-[#f87171] hover:to-[#991b1b] text-white font-bold flex flex-col items-center justify-center gap-0 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold leading-none">BET PLACED</span>
              <span className="text-xs sm:text-sm font-black leading-tight mt-0.5">CANCEL</span>
              <span className="text-[9px] opacity-80 leading-none">{amount.toFixed(2)} {currencySymbol}</span>
            </button>
          )}

          {/* Queued For Next Round */}
          {isPending && (
            <button
              onClick={handleMainAction}
              className="w-full h-10 sm:h-11 md:h-full min-h-[44px] md:min-h-[64px] rounded-lg md:rounded-xl bg-[#282617] border border-[#f59e0b]/40 text-[#f59e0b] font-bold flex flex-col items-center justify-center gap-0 active:scale-95 cursor-pointer"
            >
              <span className="text-[9px] uppercase tracking-wider font-bold leading-none">NEXT ROUND</span>
              <span className="text-xs sm:text-sm font-black leading-tight mt-0.5">CANCEL BET</span>
              <span className="text-[9px] opacity-80 leading-none">{amount.toFixed(2)} {currencySymbol}</span>
            </button>
          )}

          {/* Default Ready to Place Bet State (Iconic Aviator Green) */}
          {!isCashingOut && !isCashedOut && !isWaitingWithBet && !isPending && (
            <button
              onClick={handleMainAction}
              disabled={balance < amount}
              className={`w-full h-10 sm:h-11 md:h-full min-h-[44px] md:min-h-[64px] rounded-lg md:rounded-xl font-bold flex flex-col items-center justify-center gap-0 transition-all transform active:scale-95 cursor-pointer ${
                balance < amount
                  ? "bg-[#252836] text-[#64748b] cursor-not-allowed"
                  : engineState === "WAITING"
                  ? "bg-gradient-to-b from-[#28a745] to-[#1e7e34] hover:from-[#34b854] hover:to-[#228e3b] text-white shadow-[0_2px_12px_rgba(40,167,69,0.35)]"
                  : "bg-gradient-to-b from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#7f1d1d] text-white shadow-[0_2px_12px_rgba(220,38,38,0.3)]"
              }`}
            >
              <span className="text-[10px] sm:text-xs md:text-xs uppercase tracking-wider font-black leading-tight">
                {engineState === "WAITING" ? "BET" : "NEXT ROUND"}
              </span>
              <span className="text-xs sm:text-sm md:text-sm font-multiplier font-black leading-tight mt-0.5">
                {amount.toFixed(2)} {currencySymbol}
              </span>
              {balance < amount && (
                <span className="text-[8px] text-[#fca5a5] font-semibold leading-none mt-0.5">Low Balance</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
