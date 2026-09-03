// ============================================================================
// CASINO ROUND HISTORY MODAL
// ============================================================================

import React, { useState } from "react";
import { CrashHistoryItem } from "../game-engine/types";

interface HistoryModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  history: CrashHistoryItem[];
  onSelectRound: (round: CrashHistoryItem) => void;
  currencySymbol: string;
}

export default function HistoryModal({
  open,
  setOpen,
  history,
  onSelectRound,
  currencySymbol,
}: HistoryModalProps) {
  const [filter, setFilter] = useState<"all" | "high" | "low">("all");

  if (!open) return null;

  const filtered = history.filter((item) => {
    if (filter === "high") return item.multiplier >= 2.0;
    if (filter === "low") return item.multiplier < 2.0;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#141622] border border-white/10 rounded-2xl max-h-[85vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#10121a]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] text-xs font-bold">
              ⏱
            </div>
            <h2 className="font-extrabold text-lg text-white">Round History</h2>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0e1017]">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === "all" ? "bg-[#282d3f] text-white" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              All Rounds ({history.length})
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === "high" ? "bg-[#282d3f] text-[#c084fc]" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              2.00x+ Only
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === "low" ? "bg-[#282d3f] text-[#38bdf8]" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Under 2.00x
            </button>
          </div>

          <span className="text-xs text-[#64748b]">Click round to verify fairness</span>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectRound(item);
                setOpen(false);
              }}
              className="bg-[#181b28] hover:bg-[#202537] border border-white/5 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-10 rounded-lg flex items-center justify-center font-bold font-multiplier text-sm border ${
                    item.multiplier < 2.0
                      ? "bg-[#0284c7]/20 border-[#38bdf8]/30 text-[#38bdf8]"
                      : item.multiplier < 10.0
                      ? "bg-[#7e22ce]/20 border-[#c084fc]/30 text-[#c084fc]"
                      : "bg-[#b45309]/20 border-[#fbbf24]/40 text-[#fbbf24]"
                  }`}
                >
                  {item.multiplier.toFixed(2)}x
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    {item.roundId}
                  </span>
                  <span className="text-[11px] text-[#64748b] font-mono truncate max-w-xs block">
                    Hash: {item.hash.substring(0, 18)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8]">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="text-xs text-[#38bdf8] group-hover:translate-x-0.5 transition-transform">
                  Verify →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
