// ============================================================================
// LIVE BETS & MULTIPLAYER SOCIAL FEED
// Tabs: All Bets (Real-time live peer cashouts), My Bets, Top Wins
// ============================================================================

import React, { useState } from "react";
import { LiveBetEntry, ActiveBet } from "../../game-engine/types";

interface BetBoardProps {
  liveBets: LiveBetEntry[];
  activeBets: [ActiveBet, ActiveBet];
  currencySymbol: string;
}

export const BetBoard: React.FC<BetBoardProps> = ({ liveBets, activeBets, currencySymbol }) => {
  const [activeTab, setActiveTab] = useState<"all" | "my" | "top">("all");

  const topWins = [
    { username: "LuckyStrike", bet: 1000, mult: 48.6, win: 48600, time: "14:22" },
    { username: "Tiger_Win", bet: 500, mult: 28.3, win: 14150, time: "14:18" },
    { username: "Vikram_R", bet: 2000, mult: 16.4, win: 32800, time: "14:15" },
    { username: "GoldenEagle", bet: 250, mult: 85.2, win: 21300, time: "14:02" },
    { username: "CryptoKing", bet: 1500, mult: 12.5, win: 18750, time: "13:58" },
  ];

  return (
    <div
      id="live-bet-board"
      className="w-full lg:w-72 xl:w-80 bg-[#10121a] border-r border-white/5 flex flex-col h-full select-none"
    >
      {/* Tabs Header */}
      <div className="flex items-center justify-between p-2.5 border-b border-white/5 bg-[#141620]">
        <div className="flex bg-[#1b1e2a] p-0.5 rounded-lg w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "all" ? "bg-[#282d3f] text-white shadow" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            All Bets ({liveBets.length})
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "my" ? "bg-[#282d3f] text-white shadow" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            My Bets
          </button>
          <button
            onClick={() => setActiveTab("top")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "top" ? "bg-[#282d3f] text-white shadow" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Top Wins
          </button>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider border-b border-white/5 bg-[#0e1017]">
        <div className="col-span-5">User</div>
        <div className="col-span-3 text-right">Bet</div>
        <div className="col-span-2 text-right">X</div>
        <div className="col-span-2 text-right">Cashout</div>
      </div>

      {/* Bets List Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/5">
        {/* ALL BETS TAB */}
        {activeTab === "all" && (
          <>
            {liveBets.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-12 px-3 py-2 items-center text-xs transition-colors ${
                  item.cashout ? "bg-[#22c55e]/5" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* User Info */}
                <div className="col-span-5 flex items-center gap-2 overflow-hidden pr-1">
                  <div className="w-5 h-5 rounded-full bg-[#1e2333] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/80 flex-shrink-0">
                    {item.username.charAt(0)}
                  </div>
                  <span className="truncate text-white/80 font-medium text-xs">{item.username}</span>
                </div>

                {/* Bet Amount */}
                <div className="col-span-3 text-right font-medium text-white/90">
                  {currencySymbol}
                  {item.betAmount}
                </div>

                {/* Multiplier */}
                <div className="col-span-2 text-right font-bold font-multiplier">
                  {item.cashout ? (
                    <span className="text-[#38bdf8] bg-[#38bdf8]/10 px-1 py-0.5 rounded text-[11px]">
                      {item.cashout.toFixed(2)}x
                    </span>
                  ) : (
                    <span className="text-white/30">-</span>
                  )}
                </div>

                {/* Cashed Out Amount */}
                <div className="col-span-2 text-right font-bold text-[#22c55e]">
                  {item.cashout ? (
                    <span>
                      {currencySymbol}
                      {(item.betAmount * item.cashout).toFixed(0)}
                    </span>
                  ) : (
                    <span className="text-white/30">-</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* MY BETS TAB */}
        {activeTab === "my" && (
          <div className="p-3 flex flex-col gap-2">
            {activeBets.map((bet, idx) => (
              <div
                key={idx}
                className="bg-[#151824] border border-white/5 rounded-xl p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Bet Console #{idx + 1}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bet.cashoutStatus === "success"
                        ? "bg-[#22c55e]/20 text-[#22c55e]"
                        : bet.status === "success"
                        ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {bet.cashoutStatus === "success"
                      ? "WON"
                      : bet.status === "success"
                      ? "ACTIVE"
                      : "IDLE"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Stake:</span>
                  <strong className="text-white font-multiplier">
                    {currencySymbol}
                    {bet.amount.toFixed(2)}
                  </strong>
                </div>

                {bet.cashoutStatus === "success" && (
                  <div className="flex items-center justify-between text-xs text-[#22c55e]">
                    <span>Payout:</span>
                    <strong className="font-multiplier font-bold">
                      +{currencySymbol}
                      {bet.winAmount?.toFixed(2)} (@{bet.cashedMultiplier?.toFixed(2)}x)
                    </strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TOP WINS TAB */}
        {activeTab === "top" && (
          <>
            {topWins.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-3 py-2.5 items-center text-xs hover:bg-white/[0.02]"
              >
                <div className="col-span-5 flex items-center gap-1.5 truncate">
                  <span className="text-[10px] font-bold text-[#f59e0b] w-4">#{idx + 1}</span>
                  <span className="truncate text-white/90 font-medium">{item.username}</span>
                </div>
                <div className="col-span-3 text-right font-medium text-white/80">
                  {currencySymbol}
                  {item.bet}
                </div>
                <div className="col-span-2 text-right font-bold text-[#f59e0b] font-multiplier">
                  {item.mult.toFixed(1)}x
                </div>
                <div className="col-span-2 text-right font-bold text-[#22c55e]">
                  {currencySymbol}
                  {item.win}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
