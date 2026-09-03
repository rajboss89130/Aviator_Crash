// ============================================================================
// CASINO OPERATOR & DEVELOPER INTEGRATION SUITE
// Enables frictionless zero-server development & host casino embedding
// ============================================================================

import React, { useState, useEffect } from "react";
import { GameEngine } from "../../game-engine/GameEngine";
import { CasinoBridge, CasinoEventLogItem } from "../../api/CasinoBridge";
import { SUPPORTED_CURRENCIES } from "../../config";

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: GameEngine;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  engine,
}) => {
  const [activeTab, setActiveTab] = useState<"sandbox" | "embed" | "protocol" | "monitor">("sandbox");
  const [customBalance, setCustomBalance] = useState<string>("");
  const [customMultiplier, setCustomMultiplier] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(engine.config.currency);
  const [logs, setLogs] = useState<CasinoEventLogItem[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = CasinoBridge.subscribeLogs((newLogs) => {
      setLogs([...newLogs]);
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSetBalance = (amount: number) => {
    engine.setBalance(amount);
  };

  const handleSetCustomBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customBalance);
    if (!isNaN(val) && val >= 0) {
      engine.setBalance(val);
      setCustomBalance("");
    }
  };

  const handleQueueCrash = (mult: number) => {
    engine.forceNextCrash(mult);
    setCustomMultiplier("");
  };

  const handleSelectCurrency = (currCode: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === currCode);
    if (found) {
      setSelectedCurrency(found.code);
      engine.setCurrency(found.code, found.symbol);
      engine.config.chips = found.defaultChips;
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const iframeEmbedCode = `<iframe
  src="${typeof window !== "undefined" ? window.location.origin : "https://casino-platform.com"}/?token=USER_TOKEN_123&balance=10000&currency=${engine.config.currency}&symbol=${encodeURIComponent(engine.config.currencySymbol)}"
  width="100%"
  height="780px"
  frameborder="0"
  allow="fullscreen; autoplay"
  title="Aviator Crash Game"
></iframe>`;

  const hostJsCode = `// ============================================================================
// CASINO HOST PLATFORM INTEGRATION (React / Vue / Angular / Plain JS)
// ============================================================================

// 1. Listen for events emitted by Aviator iFrame
window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};
  if (!type) return;

  switch (type) {
    case "CASINO_MODULE_READY":
      console.log("Aviator module initialized", payload);
      break;

    case "CASINO_BET_PLACED":
      // Deduct bet amount from user balance in your casino DB/wallet
      console.log("Bet placed:", payload.amount, "Bet index:", payload.betIndex);
      // Example API call: fetch('/api/casino/deduct-bet', { method: 'POST', body: JSON.stringify(payload) })
      break;

    case "CASINO_BET_CANCELLED":
      // Refund cancelled bet
      console.log("Bet cancelled:", payload.amount);
      break;

    case "CASINO_CASHOUT":
      // Credit winnings to player's wallet
      console.log("Player cashed out win:", payload.winAmount, "at multiplier:", payload.multiplier);
      // Example API call: fetch('/api/casino/credit-win', { method: 'POST', body: JSON.stringify(payload) })
      break;

    case "CASINO_ROUND_END":
      // Log round outcome and provably fair hash
      console.log("Round finished at:", payload.crashMultiplier, "Hash:", payload.hash);
      break;
  }
});

// 2. Send commands to the Aviator iFrame (e.g. update balance after deposit)
function updateGameBalance(iframeElement, newBalance) {
  iframeElement.contentWindow.postMessage({
    type: "CASINO_SET_BALANCE",
    payload: { balance: newBalance }
  }, "*");
}`;

  return (
    <div
      id="casino-integration-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="casino-integration-modal"
        className="w-full max-w-3xl bg-[#121520] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#171b29]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Casino Integration & Developer Suite
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Zero Server Required
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Easily integrate this crash game into any casino platform or run standalone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0f111a] px-5 gap-2 overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "sandbox"
                ? "border-[#38bdf8] text-[#38bdf8]"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            🎮 Sandbox & Controls
          </button>
          <button
            onClick={() => setActiveTab("embed")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "embed"
                ? "border-[#38bdf8] text-[#38bdf8]"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            📦 iFrame Embed
          </button>
          <button
            onClick={() => setActiveTab("protocol")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "protocol"
                ? "border-[#38bdf8] text-[#38bdf8]"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            🔌 postMessage API & SDK
          </button>
          <button
            onClick={() => setActiveTab("monitor")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "monitor"
                ? "border-[#38bdf8] text-[#38bdf8]"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            📡 Live Event Bus
            {logs.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#38bdf8] text-[#0f111a] text-[10px] font-bold flex items-center justify-center">
                {logs.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm text-[#cbd5e1]">
          {/* TAB 1: SANDBOX */}
          {activeTab === "sandbox" && (
            <div className="space-y-6">
              {/* Balance Modifier */}
              <div className="bg-[#181c2b] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Player Balance Injector
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-multiplier">
                    Current: {engine.config.currencySymbol}
                    {engine.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[1000, 5000, 25000, 100000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSetBalance(amt)}
                      className="px-3 py-1.5 rounded-lg bg-[#23283b] hover:bg-[#2d344d] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      Set {engine.config.currencySymbol}{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSetCustomBalance} className="flex gap-2 pt-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Enter custom balance..."
                    value={customBalance}
                    onChange={(e) => setCustomBalance(e.target.value)}
                    className="flex-1 bg-[#10131d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0284c7] text-[#0f111a] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Apply Balance
                  </button>
                </form>
              </div>

              {/* Currency Selector */}
              <div className="bg-[#181c2b] border border-white/5 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Casino Currency & Symbol Adaptor
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleSelectCurrency(curr.code)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedCurrency === curr.code
                          ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white"
                          : "bg-[#10131d] border-white/5 text-[#94a3b8] hover:bg-[#23283b]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{curr.code}</span>
                        <span className="text-sm font-bold text-emerald-400">{curr.symbol}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{curr.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Force Next Crash Multiplier */}
              <div className="bg-[#181c2b] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Next Crash Multiplier (Testing Hook)
                  </span>
                  {engine.queuedMultiplier && (
                    <span className="text-xs font-bold text-[#eab308] bg-[#eab308]/15 px-2 py-0.5 rounded border border-[#eab308]/30">
                      Queued: {engine.queuedMultiplier.toFixed(2)}x
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94a3b8]">
                  Force the plane to crash at an exact multiplier next round to test cashouts, animations, and sound effects:
                </p>

                <div className="flex flex-wrap gap-2">
                  {[1.15, 1.5, 2.0, 5.0, 15.0, 50.0, 100.0].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleQueueCrash(m)}
                      className="px-3 py-1.5 rounded-lg bg-[#23283b] hover:bg-[#2d344d] text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      {m.toFixed(2)}x
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="number"
                    min="1.0"
                    step="0.01"
                    placeholder="Custom multiplier (e.g. 3.75)..."
                    value={customMultiplier}
                    onChange={(e) => setCustomMultiplier(e.target.value)}
                    className="flex-1 bg-[#10131d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                  <button
                    onClick={() => {
                      const val = parseFloat(customMultiplier);
                      if (!isNaN(val) && val >= 1.0) handleQueueCrash(val);
                    }}
                    className="px-4 py-1.5 bg-[#eab308] hover:bg-[#ca8a04] text-[#0f111a] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Queue Multiplier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IFRAME EMBED */}
          {activeTab === "embed" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ready-to-Use HTML iFrame Code
                </span>
                <button
                  onClick={() => copyToClipboard(iframeEmbedCode, "iframe")}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#38bdf8] hover:bg-[#0284c7] text-[#0f111a] font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  {copiedType === "iframe" ? "✓ Copied!" : "📋 Copy iFrame Tag"}
                </button>
              </div>

              <pre className="p-3.5 bg-[#0a0c13] border border-white/10 rounded-xl font-mono text-xs text-[#38bdf8] overflow-x-auto select-all">
                {iframeEmbedCode}
              </pre>

              {/* Parameter Table */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#181c2b]">
                <div className="px-4 py-2.5 bg-[#121520] border-b border-white/10 font-bold text-xs text-white">
                  Supported URL Query Parameters
                </div>
                <div className="divide-y divide-white/5 text-xs">
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-[#38bdf8] font-bold">?balance=10000</span>
                    <span className="text-slate-400">number</span>
                    <span>Initial wallet balance injected into the game</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-[#38bdf8] font-bold">?currency=INR</span>
                    <span className="text-slate-400">string</span>
                    <span>Currency code (INR, USD, EUR, BDT, USDT, etc.)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-[#38bdf8] font-bold">?symbol=₹</span>
                    <span className="text-slate-400">string</span>
                    <span>Currency symbol displayed in buttons & celebrations</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-[#38bdf8] font-bold">?token=TOKEN_123</span>
                    <span className="text-slate-400">string</span>
                    <span>Player auth token passed back in webhook events</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-[#38bdf8] font-bold">?sound=1</span>
                    <span className="text-slate-400">0 or 1</span>
                    <span>Initial audio enabled or muted state</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROTOCOL */}
          {activeTab === "protocol" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Parent Window postMessage SDK
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    Handle debit/credit transactions in your casino platform effortlessly
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(hostJsCode, "hostjs")}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#38bdf8] hover:bg-[#0284c7] text-[#0f111a] font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  {copiedType === "hostjs" ? "✓ Copied!" : "📋 Copy Integration Script"}
                </button>
              </div>

              <pre className="p-3.5 bg-[#0a0c13] border border-white/10 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto select-all max-h-72">
                {hostJsCode}
              </pre>

              <div className="bg-[#181c2b] border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
                <span className="font-bold text-white block">💡 Direct JavaScript Window Access:</span>
                <p className="text-slate-400">
                  If embedding via JavaScript script tag in same-origin environments, you can also directly call:
                </p>
                <div className="p-2 bg-[#0a0c13] rounded font-mono text-[11px] text-[#38bdf8]">
                  window.CasinoAviator.setBalance(20000);<br />
                  window.CasinoAviator.forceNextCrash(5.20);<br />
                  window.CasinoAviator.setCurrency("BDT", "৳");
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE MONITOR */}
          {activeTab === "monitor" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Real-Time Message Bus Traffic ({logs.length})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      CasinoBridge.sendToPlatform("CASINO_PING", { manualTest: true, time: Date.now() });
                    }}
                    className="px-2.5 py-1 rounded bg-[#23283b] hover:bg-[#2d344d] text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Test Ping
                  </button>
                  <button
                    onClick={() => CasinoBridge.clearLogs()}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 transition-colors cursor-pointer"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              <div className="bg-[#0a0c13] border border-white/10 rounded-xl p-2 max-h-80 overflow-y-auto space-y-1.5 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    No events recorded yet. Place a bet, cash out, or test a ping to see live message traffic!
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded bg-[#121520] border border-white/5 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              log.direction === "OUT"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {log.direction === "OUT" ? "→ OUT (To Casino)" : "← IN (From Casino)"}
                          </span>
                          <span className="font-bold text-white">{log.type}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 break-all bg-black/40 p-1.5 rounded">
                        {JSON.stringify(log.payload)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#121520] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Engine Mode: <strong className="text-emerald-400">Standalone Auto-Orchestrator</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#23283b] hover:bg-[#2d344d] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
