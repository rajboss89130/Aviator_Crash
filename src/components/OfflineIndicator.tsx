// ============================================================================
// OFFLINE INDICATOR FOR AVIATOR PWA
// Non-intrusive banner indicating offline standalone sandbox mode
// ============================================================================

import React, { useEffect, useState } from "react";

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-2 left-3 z-50 flex items-center gap-2 rounded-lg bg-[#f59e0b]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-black shadow-lg animate-fade-in border border-amber-300"
    >
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode • Game Running Locally</span>
    </div>
  );
};
