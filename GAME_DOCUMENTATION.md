# Technical Documentation

## Game Engine Explanation
The core of the Aviator game operates on a custom, event-driven `GameEngine` singleton (`src/game-engine/GameEngine.ts`). 
It manages the strict state machine of the crash game:
- `WAITING` (Players place bets)
- `ANIM_STARTED` (Plane is flying, multiplier is ticking up)
- `ANIM_CRASHED` (Plane flew away, round over)

The engine calculates the crash point using a `ProvablyFairEngine` and derives the current multiplier strictly from elapsed time using an exponential curve: `multiplier = Math.exp(elapsedMs / 6500)`.

## Main Components
- **GameBoard (`src/components/aviator/GameBoard.tsx`):** The primary view controller. Orchestrates the layout and subscribes to `GameEngine` events.
- **BetConsole (`src/components/aviator/BetConsole.tsx`):** The dual-betting interface handling user inputs, auto-cashout toggles, and bet validation.
- **AviatorCanvas (`src/components/pixicomp/AviatorCanvas.tsx`):** The high-performance rendering layer for the plane, curve, and particles.
- **CasinoBridge (`src/api/CasinoBridge.ts`):** The designated integration layer for operator wallet and backend WebSocket connections.

## Asset Structure
Images, SVG components, and styling configurations are modularized.
- SVG assets: `src/components/svgs.tsx`
- Fonts & CSS: `src/styles/casino.css`

## Animation System
The animation system explicitly avoids React's render cycle for the plane's movement. 
Inside `AviatorCanvas.tsx`, a `requestAnimationFrame` loop polls `GameEngine.getInstance().currentMultiplier` directly. This zero-delay synchronization guarantees the visual curve matches the cryptographic multiplier exactly on every single frame.

## State Management
React state (`useState`) is strictly used for UI components (modals, forms, buttons). The source of truth for the game always remains the `GameEngine`. React components subscribe to the engine via `engine.subscribe({ onStateChange: ... })` to trigger renders when necessary.

## Future Backend Connection
For production real-money environments, the `GameEngine` should be transitioned from generating outcomes locally to receiving them via WebSockets.
1. Replace `ProvablyFairEngine.generateRound()` with a payload received from the server.
2. Sync the `flightStartTime` with the server's NTP timestamp.
3. Replace local balance deductions with API calls in `placeBet` and `cashOut`.
