// ============================================================================
// CASINO WIN CELEBRATION TOAST (COMPACT & CLEAN AVIATOR STYLE)
// Ultra-compact, sleek notification when player cashes out
// ============================================================================

import React, { useEffect } from "react";

interface WinCelebrationProps {
  winData: { amount: number; multiplier: number; betIndex: number } | null;
  currencySymbol: string;
  onDismiss: () => void;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  winData,
  currencySymbol,
  onDismiss,
}) => {
  useEffect(() => {
    if (!winData) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [winData, onDismiss]);

  if (!winData) return null;

  return (
    <div
      id="win-celebration-toast"
      className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto transition-all duration-200 animate-in fade-in slide-in-from-top-2"
    >
      {/* Compact, clean pill-shaped cashout badge */}
      <div className="bg-[#0b1f12]/95 backdrop-blur-md border border-[#22c55e]/70 rounded-full pl-2 pr-1.5 py-1 sm:pl-3 sm:pr-2 sm:py-1.5 shadow-[0_4px_16px_rgba(34,197,94,0.35)] flex items-center gap-2 sm:gap-2.5 text-white max-w-[92vw]">
        {/* Left: Checkmark Icon */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#22c55e] text-[#052e16] flex items-center justify-center shrink-0 shadow-sm">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-current stroke-[3]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Center: Cashed Out Label & Multiplier */}
        <div className="flex flex-col text-left leading-none">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#86efac] leading-tight">
            CASHED OUT
          </span>
          <span className="text-[11px] sm:text-xs font-black text-white leading-tight">
            @{winData.multiplier.toFixed(2)}x
          </span>
        </div>

        {/* Right: Win Amount Badge (Clean Spribe-Style Green Tag) */}
        <div className="flex items-center gap-1 bg-[#22c55e] text-[#052e16] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-black text-[11px] sm:text-xs shadow-sm">
          <span className="text-[8px] sm:text-[9px] uppercase font-bold opacity-80">WIN</span>
          <span className="font-multiplier tracking-tight">
            +{winData.amount.toFixed(2)} {currencySymbol}
          </span>
        </div>

        {/* Dismiss Close Button */}
        <button
          onClick={onDismiss}
          title="Dismiss"
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer ml-0.5 shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

