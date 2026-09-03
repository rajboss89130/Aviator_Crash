export const LOBBY_INFO = {
  gameName: "Aviator by JILLU",
  gameId: "jillu_aviator_crash_v1",
  provider: "JILLU",
  category: "Crash / Multiplier Game",
  gameType: "Real-Time Multiplayer Crash",
  supportedDevices: ["Desktop", "Mobile", "Tablet", "iOS", "Android", "PWA"],
  technology: "React 18 / TypeScript / PixiJS / WebGL 2.0 / Web Audio",
  version: "1.0.0",
  releaseDate: "September 2026",
  rtp: "97.00%",
  volatility: "Dynamic / Player-Controlled",
  maxMultiplier: "10,000.00x",
  minBet: 1.0,
  maxBet: 1000.0,
  defaultCurrency: "$",
  shortDescription: "Ascend into high-altitude multipliers with Aviator by JILLU. Place dual bets, enjoy silky 60FPS flight physics, and cash out before the lucky plane flies away!",
  fullDescription: "Aviator by JILLU is an ultra-modern, high-retention Crash game built for premier casino operators. Designed with 60FPS WebGL canvas physics, spatial audio feedback, and dual betting consoles, players experience thrilling multiplier escalations with complete cryptographic fairness. Features include Auto-Bet, Auto-Cashout, interactive live player bets, and on-demand SHA-256 HMAC provably fair verification.",
  tags: [
    "Premium",
    "Mobile Ready",
    "Fast Gameplay",
    "Provably Fair",
    "Multiplayer",
    "Crash Game",
    "Dual Bet",
    "JILLU"
  ],
  thumbnailRequirements: {
    ratios: ["16:9 (1920x1080)", "1:1 (600x600)", "4:3 (800x600)", "9:16 (1080x1920)"],
    formats: ["PNG", "WebP", "AVIF"],
    recommendedResolution: "1920x1080 (HD)",
    brandingElements: ["Red Airplane in ascent", "Golden Multiplier curve", "Official JILLU Logo"]
  },
  integration: {
    launchUrl: "/?token={SESSION_TOKEN}&currency={CURRENCY}&lang={LANG}&operator={OPERATOR_ID}",
    iframeSandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock",
    recommendedFrameRatio: "16/9 desktop, full-viewport mobile",
    postMessageEvents: [
      "JILLU_GAME_READY",
      "JILLU_BET_PLACED",
      "JILLU_CASH_OUT",
      "JILLU_BALANCE_UPDATE",
      "JILLU_EXIT_REQUEST"
    ]
  }
};

