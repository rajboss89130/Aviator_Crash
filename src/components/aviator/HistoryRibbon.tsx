// ============================================================================
// CRASH MULTIPLIER HISTORY RIBBON
// Interactive round pills with provably fair verification click
// ============================================================================

import React from "react";
import { CrashHistoryItem } from "../../game-engine/types";

interface HistoryRibbonProps {
  history: CrashHistoryItem[];
  onSelectRound: (round: CrashHistoryItem) => void;
  onOpenHistoryModal: () => void;
}

export const HistoryRibbon: React.FC<HistoryRibbonProps> = ({
  history,
  onSelectRound,
  onOpenHistoryModal,
}) => {
  const getPillStyle = (val: number) => {
    if (val < 2.0) {
      return "text-[#38bdf8] hover:bg-[#38bdf8]/10";
    }
    if (val < 10.0) {
      return "text-[#c084fc] hover:bg-[#c084fc]/10";
    }
    return "text-[#e879f9] hover:bg-[#e879f9]/10 font-black";
  };

  return (
    <div
      id="history-ribbon"
      className="w-full flex items-center justify-between gap-1 px-2 sm:px-3 py-1 bg-[#0c0d12] border-b border-white/5 select-none flex-shrink-0"
    >
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100%-34px)] sm:max-w-[calc(100%-44px)]">
        {history.slice(0, 20).map((item, index) => (
          <button
            key={`${item.roundId}-${index}`}
            onClick={() => onSelectRound(item)}
            title={`Round: ${item.roundId} | Click to verify fairness`}
            className={`px-1.5 py-0.5 rounded-md text-xs sm:text-[13px] font-extrabold font-multiplier transition-all duration-150 cursor-pointer flex-shrink-0 ${getPillStyle(
              item.multiplier
            )}`}
          >
            {item.multiplier.toFixed(2)}x
          </button>
        ))}
      </div>

      <button
        onClick={onOpenHistoryModal}
        id="btn-history-expand"
        title="View Detailed Round History"
        className="flex items-center justify-center w-6 h-6 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>
    </div>
  );
};
