// ============================================================================
// CASINO GAME SETTINGS MODAL
// ============================================================================

import React, { useState } from "react";


interface SettingModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chips: number[];
  onSaveChips: (newChips: number[]) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function SettingModal({
  open,
  setOpen,
  chips,
  onSaveChips,
  soundEnabled,
  onToggleSound,
}: SettingModalProps) {
  const [localChips, setLocalChips] = useState<number[]>(chips);

  if (!open) return null;

  const handleChipChange = (index: number, val: string) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return;
    const copy = [...localChips];
    copy[index] = Math.max(1, Math.min(10000, parsed));
    setLocalChips(copy);
  };

  const handleSave = () => {
    onSaveChips(localChips);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#141622] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-bold text-base text-white">Game Settings</h3>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="bg-[#0e1017] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Audio & FX</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sound Effects (SFX)</span>
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                soundEnabled ? "bg-[#22c55e]" : "bg-[#2a2f42]"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Bet Chips Configuration */}
        <div className="bg-[#0e1017] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
            Quick Bet Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            {localChips.slice(0, 6).map((chipVal, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] text-[#64748b]">Slot {i + 1}</span>
                <input
                  type="number"
                  value={chipVal}
                  onChange={(e) => handleChipChange(i, e.target.value)}
                  className="bg-[#181b28] border border-white/10 rounded-lg py-1.5 px-2 text-center text-sm font-bold font-multiplier text-white outline-none focus:border-[#ef4444]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-xs font-bold text-black transition-colors cursor-pointer shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
