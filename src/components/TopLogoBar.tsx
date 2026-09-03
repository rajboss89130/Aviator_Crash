// ============================================================================
// CASINO TOP LOGO & WALLET BAR
// ============================================================================

import React, { useState, useRef, useEffect } from "react";
import { PWAInstallButton } from "./PWAInstallButton";

interface TopLogoBarProps {
  balance: number;
  currencySymbol: string;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenFairModal: () => void;
  onOpenIntegration?: () => void;
  onRefillDemo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLiveBets?: () => void;
  showLiveBets?: boolean;
}

export const TopLogoBar: React.FC<TopLogoBarProps> = ({
  balance,
  currencySymbol,
  onOpenRules,
  onOpenSettings,
  onOpenFairModal,
  onOpenIntegration,
  onRefillDemo,
  soundEnabled,
  onToggleSound,
  onToggleLiveBets,
  showLiveBets,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header
      id="casino-header"
      className="w-full h-11 sm:h-12 bg-[#0c0d12] border-b border-white/10 px-2.5 sm:px-4 flex items-center justify-between z-30 select-none flex-shrink-0 relative"
    >
      {/* Left: Back Arrow + Red Icon + Slanted AVIATOR Logo */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            }
          }}
          title="Back to Lobby"
          className="text-[#9ca3af] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer">
          {/* Red Rounded Plane Icon */}
          {/* JILLU ICON */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={`${process.env.PUBLIC_URL}/JILLU-ICON.png`} alt="JILLU" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
          </div>
          {/* AVIATOR Text & Provider */}
          <div className="flex flex-col justify-center ml-0.5">
            <span className="font-black italic tracking-wide text-base sm:text-lg text-white font-sans leading-none drop-shadow-md">
              AVIATOR
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-white/40 tracking-[0.1em] leading-none">by</span>
              <img src={`${process.env.PUBLIC_URL}/JILLU-LOGO.png`} alt="JILLU" className="h-2 sm:h-2.5 object-contain object-left opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Balance in Green + Hamburger Menu */}
      <div className="flex items-center gap-3">
        {/* Real Aviator Bright Green Balance Display */}
        <div
          onClick={onRefillDemo}
          title="Click to refill demo balance"
          className="cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span className="text-sm sm:text-base font-black font-multiplier text-[#28a745] tracking-tight">
            {balance.toFixed(2)} {currencySymbol}
          </span>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            title="Menu"
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Flyout Menu Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-64 bg-[#141622] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 animate-fade-in flex flex-col gap-1.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1.5">
                <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Aviator Menu</span>
                <span className="text-xs font-bold text-[#28a745]">{currencySymbol}</span>
              </div>

              {/* Sound FX Toggle */}
              <button
                onClick={() => {
                  onToggleSound();
                }}
                className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <span>Sound FX</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${soundEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {soundEnabled ? "ON" : "OFF"}
                </span>
              </button>

              {/* Live Bets Feed Toggle */}
              {onToggleLiveBets && (
                <button
                  onClick={() => {
                    onToggleLiveBets();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Live Bets Panel</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${showLiveBets ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/60"}`}>
                    {showLiveBets ? "OPEN" : "CLOSED"}
                  </span>
                </button>
              )}

              {/* Game Rules */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenRules();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>How to Play / Rules</span>
              </button>

              {/* Provably Fair */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenFairModal();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Provably Fair Verification</span>
              </button>

              {/* Refill Balance */}
              <button
                onClick={() => {
                  onRefillDemo();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-[#28a745] hover:bg-[#28a745]/10 transition-colors cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Refill Demo Balance (+5,000 {currencySymbol})</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Game Settings</span>
              </button>

              {/* Dev Mode Integration */}
              {onOpenIntegration && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenIntegration();
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-colors cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  <span>Developer Integration</span>
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={() => {
                  toggleFullscreen();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-bold text-white hover:bg-[#202434] transition-colors cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <span>Toggle Fullscreen</span>
              </button>

              {/* PWA Install in Menu */}
              <div className="pt-1 border-t border-white/10">
                <PWAInstallButton variant="header" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

