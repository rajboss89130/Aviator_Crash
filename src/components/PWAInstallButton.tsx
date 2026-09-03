// ============================================================================
// PWA INSTALL BUTTON & IOS INSTALL GUIDE MODAL
// Seamless in-app install flow for Android, Chrome, and iOS Safari
// ============================================================================

import React, { useState } from "react";
import { usePWAInstall } from "../utils/usePWAInstall";

interface PWAInstallButtonProps {
  variant?: "header" | "floating" | "banner";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "header",
  className = "",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  // Handle trigger
  const handleClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
    } else {
      // Fallback guide if browser doesn't expose beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  // Header / TopBar Compact Style
  if (variant === "header") {
    return (
      <>
        <button
          onClick={handleClick}
          id="btn-pwa-install-header"
          title="Install Aviator Web App (PWA)"
          disabled={installing}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer text-[#22c55e] bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border-[#22c55e]/30 shadow-[0_0_8px_rgba(34,197,94,0.2)] active:scale-95 ${className}`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>

        {/* iOS / General Install Guide Modal */}
        {showIOSGuide && (
          <div
            id="pwa-install-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          >
            <div className="w-full max-w-sm rounded-2xl bg-[#141724] border border-white/15 p-5 shadow-2xl text-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2a4b] to-[#9f1239] flex items-center justify-center shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Install Aviator PWA</h3>
                    <p className="text-[11px] text-[#94a3b8]">Play fullscreen with instant load</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 space-y-3 text-xs text-[#cbd5e1]">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Open Browser Menu / Share</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                      On iOS Safari: Tap the <strong className="text-white">Share</strong> icon (square with up-arrow) at the bottom. On Chrome: Tap the 3 dots.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">Select "Add to Home Screen"</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                      Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> or <strong className="text-white">"Install App"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">Fast Native Gameplay</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                      Launch Aviator directly from your home screen with zero browser bars, smooth 60fps animations, and offline caching.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2">
                {isInstallable && !isIOS && (
                  <button
                    onClick={() => {
                      setShowIOSGuide(false);
                      install();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#4ade80] hover:to-[#15803d] text-white font-bold text-xs shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                  >
                    Install Now
                  </button>
                )}
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Floating button style for mobile
  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-20 right-3 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-bold shadow-[0_4px_16px_rgba(225,29,72,0.4)] border border-white/20 active:scale-95 transition-all cursor-pointer ${className}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#141724] border border-white/15 p-5 shadow-2xl text-white">
            <h3 className="text-base font-black text-white">Install on Mobile</h3>
            <p className="mt-2 text-xs text-[#94a3b8]">
              Tap your browser's <strong className="text-white">Share</strong> or menu icon, then select <strong className="text-white">"Add to Home Screen"</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
