/**
 * Casino Integration & Environment Configuration
 * 
 * Designed for frictionless embedding in any host casino platform:
 * 1. Zero external server requirement: Works 100% standalone out-of-the-box in developer mode.
 * 2. URL Parameter Configuration: Pass `?token=...&balance=...&currency=...&symbol=...`
 * 3. IFrame & Window postMessage API: Seamless host-to-game & game-to-host bridge.
 * 4. Window SDK API: `window.CasinoAviator` for direct JS host integrations.
 */

export interface CasinoPlatformConfig {
  devMode: boolean;
  isIframe: boolean;
  token: string;
  operator: string;
  balance: number;
  currency: string;
  currencySymbol: string;
  minBet: number;
  maxBet: number;
  chips: number[];
  soundEnabled: boolean;
  apiUrl: string;
  socketUrl: string;
}

export const SUPPORTED_CURRENCIES = [
  { code: "BDT", symbol: "BDT", name: "Bangladeshi Taka", defaultChips: [100, 200, 500, 1000] },
  { code: "INR", symbol: "₹", name: "Indian Rupee", defaultChips: [100, 200, 500, 1000] },
  { code: "USD", symbol: "$", name: "US Dollar", defaultChips: [1, 5, 10, 50] },
  { code: "EUR", symbol: "€", name: "Euro", defaultChips: [1, 5, 10, 50] },
  { code: "GBP", symbol: "£", name: "British Pound", defaultChips: [1, 5, 10, 50] },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", defaultChips: [5, 20, 50, 200] },
  { code: "USDT", symbol: "₮", name: "Tether (USDT)", defaultChips: [1, 5, 10, 50] },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", defaultChips: [25, 100, 250, 1000] },
];

/**
 * Parses query parameters from window.location.search or custom search string
 */
export function getRuntimeCasinoConfig(): CasinoPlatformConfig {
  let isIframe = false;
  if (typeof window !== "undefined") {
    try {
      isIframe = window.self !== window.top;
    } catch {
      isIframe = true;
    }
  }

  let searchParams = new URLSearchParams();
  if (typeof window !== "undefined" && window.location) {
    searchParams = new URLSearchParams(window.location.search);
  }

  const queryCurrency = searchParams.get("currency") || "BDT";
  const matchedCurrency = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === queryCurrency.toUpperCase()
  );

  const currency = matchedCurrency ? matchedCurrency.code : queryCurrency.toUpperCase();
  const currencySymbol = searchParams.get("symbol") || (matchedCurrency ? matchedCurrency.symbol : "BDT");
  
  const queryBalance = searchParams.get("balance");
  const parsedBalance = queryBalance ? parseFloat(queryBalance) : 13306.92;

  const queryMinBet = searchParams.get("minBet");
  const queryMaxBet = searchParams.get("maxBet");

  const queryChips = searchParams.get("chips");
  const parsedChips = queryChips
    ? queryChips.split(",").map((c) => parseFloat(c.trim())).filter((c) => !isNaN(c) && c > 0)
    : (matchedCurrency ? matchedCurrency.defaultChips : [10, 50, 100, 500]);

  const soundParam = searchParams.get("sound");
  const soundEnabled = soundParam === null ? true : soundParam !== "0" && soundParam !== "false";

  // Check if explicit API or Socket URLs were passed via query or environment (optional overrides)
  const apiUrl = searchParams.get("apiUrl") || "";
  const socketUrl = searchParams.get("socketUrl") || "";

  return {
    devMode: true, // Always allow developer / standalone sandbox execution
    isIframe,
    token: searchParams.get("token") || "demo_player_dev",
    operator: searchParams.get("operator") || "Aviator Gaming",
    balance: isNaN(parsedBalance) ? 5000.0 : parsedBalance,
    currency,
    currencySymbol,
    minBet: queryMinBet ? parseFloat(queryMinBet) : 10,
    maxBet: queryMaxBet ? parseFloat(queryMaxBet) : 10000,
    chips: parsedChips.length > 0 ? parsedChips : [10, 50, 100, 500],
    soundEnabled,
    apiUrl,
    socketUrl,
  };
}

export const RUNTIME_CONFIG = getRuntimeCasinoConfig();
