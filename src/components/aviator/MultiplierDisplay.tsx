// ============================================================================
// LIVE MULTIPLIER & ROUND STATUS OVERLAY
// ============================================================================

import React from "react";
import { GameEngineState } from "../../game-engine/types";

interface MultiplierDisplayProps {
  state: GameEngineState;
  multiplier: number;
  countdown: number;
}

export const MultiplierDisplay: React.FC<MultiplierDisplayProps> = ({ state, multiplier, countdown }) => {
  const getMultiplierColor = (val: number) => {
    if (val < 2.0) return "text-white";
    if (val < 10.0) return "text-[#c084fc]";
    return "text-[#fbbf24]";
  };

  return (
    <div
      id="multiplier-overlay"
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none"
    >
      {/* WAITING PHASE */}
      {state === "WAITING" && (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-2 bg-[#161922]/90 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping" />
            <span className="text-xs uppercase tracking-widest text-[#94a3b8] font-semibold">
              WAITING FOR NEXT ROUND
            </span>
          </div>

          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#ef4444] to-[#f59e0b] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${Math.max(0, (countdown / 5) * 100)}%` }}
            />
          </div>

          <span className="text-sm font-medium text-white/70">
            Takeoff in <strong className="text-white font-bold">{countdown}s</strong>
          </span>
        </div>
      )}

      {/* FLYING PHASE */}
      {state === "ANIM_STARTED" && (
        <div className="flex flex-col items-center">
          <span
            className={`font-sans text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter transition-colors duration-150 ${getMultiplierColor(
              multiplier
            )} ${multiplier >= 5.0 ? "anim-multiplier-glow" : ""}`}
          >
            {multiplier.toFixed(2)}x
          </span>
        </div>
      )}

      {/* CRASHED / FLEW AWAY PHASE */}
      {state === "ANIM_CRASHED" && (
        <div className="flex flex-col items-center animate-bounce-short">
          <span className="text-sm sm:text-base uppercase tracking-widest font-black text-[#ef4444] mb-1 drop-shadow-md">
            FLEW AWAY!
          </span>
          <span className="font-sans text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#ef4444] tracking-tighter drop-shadow-[0_0_30px_rgba(239,68,68,0.7)]">
            {multiplier.toFixed(2)}x
          </span>
        </div>
      )}
    </div>
  );
};
