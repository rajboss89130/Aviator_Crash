# Aviator Crash Game by JILLU

## 1. Game Overview
Aviator by JILLU is a premium, high-retention Crash game designed for modern online casinos. The game features a real-time ascending multiplier curve (an airplane taking off) that crashes at a randomly generated point. Players must cash out before the crash to win.

## 2. Game Features
- **Real-Time Multiplayer Experience:** Live bets feed, recent round history, and real-time multiplier tracking.
- **Dual Betting Console:** Players can place up to two independent bets per round, allowing for diverse risk strategies (e.g., one safe auto-cashout, one risky manual cashout).
- **Auto Bet & Auto Cashout:** Fully automated gameplay options for continuous play.
- **Provably Fair Engine:** Cryptographically secure RNG with seed generation and client-side verification tools.
- **Responsive Design:** Edge-to-edge mobile optimization with native app-like interactions, seamlessly scaling to desktop ultra-wide views.
- **Premium Audio/Visuals:** 60FPS PixiJS/Canvas rendering, Doppler-effect engine audio, and sleek high-contrast casino UI.

## 3. Technology Stack
- **Frontend Framework:** React 18, TypeScript
- **Styling:** Tailwind CSS (customized for casino luxury theme)
- **Rendering Engine:** HTML5 Canvas (60FPS requestAnimationFrame loop)
- **State Management:** Custom Event-Driven Game Engine
- **Audio:** Web Audio API with spatial/pitch manipulation
- **Build Tool:** Create React App / Webpack

## 4. Project Structure
```text
src/
├── api/             # Future backend/bridge integrations (CasinoBridge.ts)
├── components/      # React components
│   ├── aviator/     # Core game board, consoles, and UI components
│   ├── pixicomp/    # 60FPS Canvas rendering layers
│   └── modals/      # Information and settings modals
├── game-engine/     # Core game logic, state, RNG, and physics
├── store/           # Global state wrappers
└── styles/          # Tailwind and global CSS
```

## 5. Installation Guide
1. Run `npm install` to install all dependencies.
2. Run `npm start` to start the local development server.
3. Run `npm run build` to generate the production-ready static bundle.

## 6. Configuration Guide
Global game configuration can be found and extended within `src/game-engine/GameEngine.ts` (e.g., modifying default chips, currency symbol, minimum/maximum bet limits).

## 7. Frontend Architecture
The frontend utilizes a strict separation of concerns:
- **GameEngine:** An event-emitting singleton that holds the absolute truth of the game state, multiplier, and user balance.
- **React UI:** Subscribes to GameEngine events and updates the DOM declaratively.
- **Canvas Renderer:** Bypasses React state completely for the core flight loop, reading directly from the GameEngine singleton via `requestAnimationFrame` to ensure zero-latency 60FPS visual updates.

## 8. Backend Integration Points
To connect to a real casino backend, modify `src/api/CasinoBridge.ts`. Currently, this acts as a stub to simulate wallet deposits, but it is architected to intercept bet placements and cashout requests to forward them via WebSockets or REST to your game server.

## 9. API Requirements
A complete backend integration will require:
1. `POST /api/bet` - Register a bet for the upcoming round.
2. `POST /api/cashout` - Claim a multiplier before the crash.
3. `WS /socket` - WebSocket stream for round states (Waiting, Takeoff, Crashed) and real-time multiplier ticks.

## 10. Casino Platform Integration Guide
Provide the generated `build/` folder as a static asset to your platform. 
The application can be embedded via `<iframe>` with `allow="autoplay"` to ensure sound engines function properly on load.

## 11. Customization Guide
- **Branding:** To modify the "JILLU" provider branding, update `LoadingScreen.tsx` and `TopLogoBar.tsx`.
- **Theme:** Colors are controlled via `tailwind.config.js` and CSS variables in `src/styles/casino.css`.

---
*Provided by JILLU*
