// ============================================================================
// HOW TO PLAY - GAME RULES MODAL
// ============================================================================

import React from "react";

export default function RuleModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#141622] border border-white/10 rounded-2xl max-h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#10121a]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ef4444] flex items-center justify-center text-white text-xs font-bold">
              ?
            </div>
            <h2 className="font-extrabold text-lg text-white">How to Play Aviator Crash</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-[#cbd5e1]">
          {/* 3 Step Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0e1017] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-bold text-base">
                1
              </div>
              <strong className="text-white text-sm">Place Bet</strong>
              <p className="text-xs text-[#94a3b8]">
                Select your stake and click the green BET button before the plane takes off.
              </p>
            </div>

            <div className="bg-[#0e1017] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-bold text-base">
                2
              </div>
              <strong className="text-white text-sm">Watch Multiplier</strong>
              <p className="text-xs text-[#94a3b8]">
                As the Lucky Plane ascends, the win multiplier increases exponentially from 1.00x!
              </p>
            </div>

            <div className="bg-[#0e1017] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-bold text-base">
                3
              </div>
              <strong className="text-white text-sm">Cash Out!</strong>
              <p className="text-xs text-[#94a3b8]">
                Cash out before the plane flies away to secure your bet multiplied by the current rate!
              </p>
            </div>
          </div>

          {/* Detailed Rules */}
          <div className="space-y-4">
            <div className="bg-[#191d2c] rounded-xl p-4 border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-base">Key Game Mechanics</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#94a3b8] leading-relaxed">
                <li>The multiplier starts at 1.00x and climbs higher and higher.</li>
                <li>Your payout equals your bet multiplied by the exact cash out coefficient.</li>
                <li>If the plane flies away before you cash out, your bet for that round is forfeited.</li>
                <li>You can place two independent bets simultaneously on the dual consoles!</li>
              </ul>
            </div>

            <div className="bg-[#191d2c] rounded-xl p-4 border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-base">Auto Play & Auto Cash Out</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#94a3b8] leading-relaxed">
                <li>
                  <strong className="text-white">Auto Bet:</strong> Automatically places bets on consecutive rounds.
                </li>
                <li>
                  <strong className="text-white">Auto Cash Out:</strong> Set a target multiplier (e.g., 2.00x). The engine will automatically collect your winnings the moment the plane hits that rate!
                </li>
              </ul>
            </div>

            <div className="bg-[#191d2c] rounded-xl p-4 border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-base">Provably Fair Algorithm</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Every round outcome is mathematically generated via cryptographic SHA-256 HMAC hashing. Results are predetermined before the round starts and cannot be altered by either the casino or player. You can independently verify any round using the seed details in the round history ribbon.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#10121a] flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-6 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
