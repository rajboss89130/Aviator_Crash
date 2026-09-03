import React, { useEffect, useState } from "react";
import jilluIcon from "../assets/JILLU-ICON.png";
import jilluLogo from "../assets/JILLU-LOGO.png";

const LOADING_STAGES = [
  "Initializing WebGL Engine...",
  "Loading Flight Physics & Assets...",
  "Connecting Provably Fair RNG...",
  "Synchronizing Live Multiplier...",
  "Ready for Takeoff..."
];

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = Math.min(100, p + Math.floor(Math.random() * 12 + 6));
        const idx = Math.min(
          LOADING_STAGES.length - 1,
          Math.floor((next / 100) * LOADING_STAGES.length)
        );
        setStageIndex(idx);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07080c] transition-all duration-500 ease-out select-none ${
        progress >= 100 ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ef4444]/10 via-[#07080c]/80 to-[#07080c] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-sm w-full">
        {/* Provider Brand Visual */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#eab308]/20 to-[#ef4444]/20 rounded-full blur-xl animate-pulse" />
            <img
              src={jilluIcon}
              alt="JILLU"
              className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/JILLU-ICON.png")) {
                  e.currentTarget.src = "/JILLU-ICON.png";
                }
              }}
            />
          </div>

          <img
            src={jilluLogo}
            alt="JILLU Gaming"
            className="h-9 sm:h-12 max-w-[200px] object-contain drop-shadow-[0_2px_12px_rgba(255,215,0,0.4)] brightness-110"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/JILLU-LOGO.png")) {
                e.currentTarget.src = "/JILLU-LOGO.png";
              }
            }}
          />
        </div>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Game Title & Badge */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black italic tracking-widest text-[#ef4444] drop-shadow-[0_2px_10px_rgba(239,68,68,0.4)]">
              AVIATOR
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#fca5a5] font-bold tracking-wider uppercase">
              Pro
            </span>
          </div>
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-semibold">
            By JILLU Gaming Studios
          </span>
        </div>

        {/* Loading Progress Section */}
        <div className="w-full mt-4 flex flex-col gap-2">
          {/* Progress Bar Track */}
          <div className="h-1.5 w-full bg-[#161822] rounded-full overflow-hidden p-[1px] border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#22c55e] rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,158,11,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Status & Percentage */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono">
            <span className="text-white/60 font-medium tracking-tight truncate max-w-[200px]">
              {LOADING_STAGES[stageIndex]}
            </span>
            <span className="font-bold text-[#f59e0b]">{progress}%</span>
          </div>
        </div>

        {/* Provably Fair Certification Footer */}
        <div className="flex items-center gap-1.5 text-[9px] text-white/30 uppercase tracking-widest font-semibold mt-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Provably Fair RNG Engine</span>
        </div>
      </div>
    </div>
  );
};
