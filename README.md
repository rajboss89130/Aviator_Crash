# Aviator Crash Game by JILLU — Casino Ready Frontend Module

[![Game Version](https://img.shields.io/badge/version-v1.0.0-gold.svg)](https://jillu.games)
[![Provider](https://img.shields.io/badge/provider-JILLU-red.svg)](https://jillu.games)
[![RTP](https://img.shields.io/badge/RTP-97.00%25-green.svg)](https://jillu.games)
[![Engine](https://img.shields.io/badge/Engine-React18%20%7C%20PixiJS%20%7C%20WebGL2-blue.svg)](https://jillu.games)

---

## 1. Game Overview
**Aviator by JILLU** is a premier, high-velocity multiplier Crash game engineered specifically for commercial online casino platforms. The game features an ascending Lucky Red Plane rendered on a 60FPS WebGL canvas curve that scales dynamically from **1.00x** up to **10,000.00x**. 

Players strategically place up to two simultaneous bets and must decide when to **Cash Out** before the plane unexpectedly flies away. Built with authentic casino psychology, spatial audio feedback, and cryptographic Provably Fair verification, this module delivers elite player retention and engagement across all devices.

---

## 2. Game Features
- **Dual Independent Betting Consoles:** Allows simultaneous conservative and aggressive bet strategies (e.g. Bet 1: Auto Cashout at 1.50x to protect bankroll; Bet 2: Manual Cashout chasing 50.00x+).
- **Automated Betting (Auto Bet & Auto Cashout):** Hands-free continuous gameplay with configurable multi-round bet cycles and target coefficient thresholds.
- **60FPS High-Altitude WebGL Canvas:** Smooth exponential flight trajectory with dynamic particle thrust, grid coordinate markers, and atmospheric backdrop glow.
- **Provably Fair SHA-256 Engine:** Mathematical fairness where every flight crash point is deterministically computed via HMAC-SHA256 hash chains using operator Server Seeds and player Client Seeds.
- **Live Multiplayer Bet Feed:** Real-time simulated and operator-synced player ledger displaying active wagers, cashout events, and green win highlights.
- **Dynamic Multiplier History Ribbon:** Instant visual access to previous round multipliers with color-coded tiers (Blue <2x, Purple 2x-10x, Gold 10x+).
- **Spatial Audio & Sound Synthesis:** Dynamic engine acceleration pitch shifts, warning Doppler sounds, and celebratory cashout audio stingers.
- **PWA (Progressive Web App) Installable:** Instant add-to-homescreen capability on iOS and Android for app-like native responsiveness.

---

## 3. Technology Stack
| Layer | Technologies & Libraries |
|---|---|
| **Core Framework** | React 18, TypeScript (Strict Mode) |
| **Rendering Engine** | HTML5 Canvas 2D / PixiJS v7, WebGL 2.0 accelerated |
| **Styling & Theme** | Tailwind CSS (Tailwind v3/v4), CSS Variables |
| **State & Engine** | Custom Event-Driven Game Engine (`GameEngine.ts`) |
| **Cryptography** | SHA-256 HMAC Provably Fair (`ProvablyFair.ts`) |
| **Audio Engine** | HTML5 Web Audio API & Synth Audio Nodes |
| **Build & Tooling** | Webpack 5, React Scripts, PostCSS, ESLint |

---

## 4. Project Structure
```text
.
├── LOBBY_INTEGRATION.json     # Complete casino lobby card and launch specifications
├── GAME_DOCUMENTATION.md      # In-depth technical architecture & math models
├── CHANGELOG.md               # Version history and release notes
├── metadata.json              # Platform identity and permission manifest
├── public/                    # Static assets, Web App Manifest, Service Worker
│   ├── JILLU-ICON.png         # Official JILLU Gold Crown Provider Icon
│   ├── JILLU-LOGO.png         # Official JILLU Gaming Brand Logo
│   ├── index.html             # HTML entry point with synchronized OpenGraph metadata
│   └── manifest.json          # Web App Manifest for mobile installation
└── src/
    ├── api/                   # Integration bridge (CasinoBridge.ts for wallet/operator API)
    ├── assets/                # Bundled images & high-resolution branding assets
    ├── components/            # React UI presentation components
    │   ├── aviator/           # GameBoard, BetConsole, HistoryRibbon, MultiplierDisplay
    │   ├── modals/            # FairVerificationModal, IntegrationModal
    │   ├── pixicomp/          # 60FPS AviatorCanvas, AppStage, Sprite renderers
    │   ├── LoadingScreen.tsx  # JILLU branded casino splash & progress sequence
    │   ├── TopLogoBar.tsx     # Operator header, wallet bar, and flyout drawer
    │   ├── RuleDialog.tsx     # How to play modal with JILLU metadata
    │   └── SettingModal.tsx   # Custom chip presets and SFX configuration
    ├── game-engine/           # Core state machine, math curves, and Provably Fair RNG
    └── index.tsx              # Application root bootstrap
```

---

## 5. Installation Guide

### Prerequisites
- Node.js version `18.x` or `20.x` LTS
- NPM `9.x+` or Yarn / Bun

### Step-by-Step Setup
```bash
# 1. Clone the repository or extract the production ZIP
cd jillu-aviator-casino-ready-v1

# 2. Install package dependencies
npm install

# 3. Start local development server (runs on port 3000)
npm start

# 4. Compile optimized production build
npm run build
```

---

## 6. Configuration Guide
Customization of game defaults is centralized in `src/game-engine/GameEngine.ts` and `src/lobby-info.js`:

```typescript
// Default Bet Configuration
export const DEFAULT_CONFIG = {
  minBet: 1.0,               // Minimum bet limit
  maxBet: 1000.0,            // Maximum bet limit
  currencySymbol: "$",       // Currency symbol (overridable via URL/iFrame query params)
  defaultChips: [100, 200, 500, 1000], // Quick-selection chip presets
  rtp: 0.97,                 // 97% Return-to-Player standard
  maxMultiplier: 10000.0     // Hard cap ceiling
};
```

---

## 7. Frontend Architecture

### Decoupled Engine & Render Loop
```
┌─────────────────────────────────────────────────────────┐
│              GameEngine Singleton (State)               │
│   - State: WAITING | ANIM_STARTED | ANIM_CRASHED       │
│   - Multiplier Clock: Exponential Math Curve            │
│   - Provably Fair SHA-256 Outcome Calculator            │
└──────────────┬───────────────────────────┬──────────────┘
               │ requestAnimationFrame      │ Observer Events
               ▼                           ▼
┌──────────────────────────┐  ┌───────────────────────────┐
│   AviatorCanvas (WebGL)  │  │   React UI Components     │
│   - 60FPS Flight Curve   │  │   - Dual Bet Consoles     │
│   - Particle Emissions   │  │   - Multiplier HUD        │
│   - Dynamic Camera Grid  │  │   - Live Bets Ledger      │
└──────────────────────────┘  └───────────────────────────┘
```

1. **Zero-Latency Rendering:** The `AviatorCanvas` directly queries `GameEngine.getInstance().currentMultiplier` during its native `requestAnimationFrame` render loop, bypassing React's reconciliation cycle to guarantee stutter-free 60FPS animation.
2. **Declarative State Subscriptions:** UI controls (buttons, inputs, status tags) listen to discrete engine events (`onStateChange`, `onBetPlaced`, `onCashedOut`) to trigger re-renders only when necessary.

---

## 8. Backend Integration Points
To link the game to your centralized casino wallet and remote game servers:

1. **Seamless Wallet Integration:**
   - In `src/api/CasinoBridge.ts`, implement `deductBalance(amount)` and `creditWin(amount, multiplier)` to call your platform's remote wallet API.
2. **Server-Authoritative Multiplier Sync:**
   - Switch `GameEngine.ts` from local RNG generation to listening to your backend WebSocket server ticks:
   ```typescript
   socket.on("ROUND_START", (payload) => engine.startFlight(payload.crashPoint));
   socket.on("TICK", (payload) => engine.setMultiplier(payload.multiplier));
   socket.on("CRASH", (payload) => engine.triggerCrash());
   ```

---

## 9. API Requirements
For an operator hosting their own server-authoritative multiplayer backend:

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/session` | `POST` | Validates session token, returns user ID, username, and balance |
| `/api/v1/game/bet` | `POST` | Places bet on active round; reserves funds from wallet |
| `/api/v1/game/cashout` | `POST` | Claims cashout at current server timestamp & multiplier |
| `/api/v1/game/history` | `GET` | Fetches last 50 round multipliers and seed hashes |
| `wss://operator.com/aviator` | `WS` | Broadcasts real-time flight multiplier ticks and multiplayer bets |

---

## 10. Casino Platform Integration Guide

### Iframe Embed Code
```html
<iframe 
  src="https://your-casino.com/games/jillu-aviator/?token=USER_AUTH_TOKEN&currency=USD&lang=en&operator=CASINO_CORP" 
  width="100%" 
  height="100%" 
  style="border: none; width: 100vw; height: 100vh;" 
  allow="autoplay; fullscreen; clipboard-write;"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
></iframe>
```

### PostMessage Interop Protocol
The module communicates lifecycle events with the host casino frame via `window.parent.postMessage`:

```javascript
window.addEventListener("message", (event) => {
  switch(event.data.type) {
    case "JILLU_GAME_READY":
      console.log("Game loaded successfully");
      break;
    case "JILLU_BET_PLACED":
      console.log("Bet placed:", event.data.payload);
      break;
    case "JILLU_CASH_OUT":
      console.log("Cashout won:", event.data.payload);
      break;
    case "JILLU_EXIT_REQUEST":
      window.location.href = "https://your-casino.com/lobby";
      break;
  }
});
```

---

## 11. Customization Guide
- **Provider Logo & Branding:** Update `/src/assets/JILLU-ICON.png` and `/src/assets/JILLU-LOGO.png` to refresh brand assets.
- **Color Palettes & Styling:** Modify `tailwind.config.js` or `src/styles/casino.css` to align button gradients, canvas glow, and panel backdrops with your casino theme.
- **Audio Themes:** Customize sounds in `src/game-engine/SoundEngine.ts` to swap audio synthesizers or supply pre-rendered audio sprites.

---

### Official Metadata
- **Game Name:** Aviator by JILLU
- **Provider:** JILLU Gaming Studios
- **Category:** Crash / Multiplier Game
- **Game Type:** Real-Time Multiplayer Crash Game
- **Supported Devices:** Desktop, Mobile, Tablet, iOS, Android, PWA
- **Technology:** React 18, TypeScript, PixiJS v7, WebGL 2.0, Web Audio, Tailwind CSS
- **Version:** 1.0.0
- **Release Date:** September 2026

*© 2026 JILLU Gaming Studios. All rights reserved. Commercial Casino Frontend Module.*
