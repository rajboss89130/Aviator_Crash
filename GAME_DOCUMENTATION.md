# Technical Architecture & Game Engine Documentation
## Aviator by JILLU — Version 1.0.0

---

## 1. Game Engine & State Machine
The core engine (`src/game-engine/GameEngine.ts`) implements a robust finite-state machine (FSM) tailored for deterministic, high-throughput crash games.

```
       ┌───────────────────────────────┐
       │            WAITING            │
       │   - 5.0s countdown timer      │
       │   - Accepting bets for round  │
       └───────────────┬───────────────┘
                       │ (Takeoff Trigger)
                       ▼
       ┌───────────────────────────────┐
       │         ANIM_STARTED          │
       │   - Multiplier escalates      │
       │   - Plane ascends dynamically │
       │   - Cashouts enabled          │
       └───────────────┬───────────────┘
                       │ (Crash Threshold Met)
                       ▼
       ┌───────────────────────────────┐
       │         ANIM_CRASHED          │
       │   - "Flew Away" notification  │
       │   - Losses deducted           │
       │   - Multiplier Ribbon updated │
       └───────────────┬───────────────┘
                       │ (3.0s Delay)
                       └───────────────► [Return to WAITING]
```

---

## 2. Mathematical Flight Curve & Multiplier Formulas

### Multiplier Growth Function
The instantaneous multiplier $M(t)$ is calculated from elapsed milliseconds $t$ according to an exponential acceleration curve:

$$M(t) = \exp\left(\frac{t}{6500}\right)$$

Where:
- $t$: Elapsed time in milliseconds since the start of flight (`flightStartTime`).
- When $t = 0\text{ ms}$, $M(0) = 1.00\text{x}$.
- When $t = 6500\text{ ms}$, $M(6500) \approx 2.718\text{x}$.
- When $t = 15000\text{ ms}$, $M(15000) \approx 10.05\text{x}$.

### Coordinate Translation for 2D Flight Canvas
The canvas coordinate $(X, Y)$ of the ascending plane is calculated using a Bézier quadratic curve relative to current container width $W$ and height $H$:

$$X(t) = \min\left(W \times 0.85, \; W \times \left(0.10 + 0.75 \times \frac{M(t) - 1}{M(t) + 4}\right)\right)$$
$$Y(t) = H - \min\left(H \times 0.82, \; H \times \left(0.15 + 0.70 \times \left(1 - \frac{1}{M(t)^{0.6}}\right)\right)\right)$$

This mapping ensures the plane smoothly tracks across the canvas without clipping into top headers or side borders.

---

## 3. Cryptographic Provably Fair Algorithm
Every flight outcome is generated using the industry-standard **HMAC-SHA256** Provably Fair algorithm:

1. **Input Seeds:**
   - **Server Seed:** A secret 64-character hexadecimal string created by the operator.
   - **Client Seed:** A randomized or player-chosen seed string.
   - **Nonce:** A sequential integer representing the game round number.
2. **Hash Generation:**
   $$\text{Hash} = \text{HMAC\_SHA256}(\text{ServerSeed}, \; \text{ClientSeed} + \text{":"} + \text{Nonce})$$
3. **Multiplier Derivation:**
   - Extract the first 52 bits (13 hex characters) of the hash.
   - Divide by $2^{52}$ to get a uniform float $r \in [0, 1)$.
   - Apply the 3% house edge factor ($\text{RTP} = 97\%$):
     $$\text{CrashPoint} = \max\left(1.00, \; \left\lfloor \frac{97}{1 - r} \right\rfloor \times 0.01\right)$$
4. **Instant Crash Rate:** There is an inherent 3% mathematical probability of instant crash ($1.00\text{x}$), matching international regulatory compliance standards.

---

## 4. Main Components Overview

### `GameBoard.tsx`
- Serves as the primary layout coordinator.
- Manages dual-console responsive states, audio player bindings, and overlay modals.
- Adjusts layout for split desktop views and unified mobile views.

### `BetConsole.tsx`
- Controls user input, quick-chip chips (`100`, `200`, `500`, `1000`), Auto-Bet switches, and Auto-Cashout threshold multipliers.
- Computes real-time potential win amounts: $\text{Amount} \times \text{CurrentMultiplier}$.

### `AviatorCanvas.tsx`
- High-performance HTML5 Canvas rendering layer.
- Runs independent 60FPS `requestAnimationFrame` drawing loops for:
  - Dynamic gradient curved trail.
  - Plane rotation based on ascent slope angle $\theta = \arctan2(\Delta Y, \Delta X)$.
  - Exhaust flame and thrust particles.
  - Coordinate grid lines and time markers.

### `HistoryRibbon.tsx`
- Displays the most recent 20-50 round multiplier outcomes.
- Clicking any badge opens the **Provably Fair Verification Modal** displaying the exact server seed, client seed, nonce, and hash.

---

## 5. Web Audio Sound Engine
The sound subsystem (`src/game-engine/SoundEngine.ts`) employs the browser's Web Audio API for zero-latency procedural sound synthesis:
- **Engine Drone:** Frequency-modulated oscillator that scales in pitch from 120Hz up to 880Hz as the multiplier increases.
- **Cashout Chime:** Dual harmonic sine wave arpeggio ($E_5 \to G\#_5 \to B_5$).
- **Crash Warning:** Low-pass filtered noise burst with rapid exponential decay.

---

## 6. Real-Time Operator WebSocket Protocol
For production deployment with a remote multiplayer backend, replace the local tick generator with the following WebSocket schema:

```json
// Server -> Client: Round Waiting (Betting Open)
{
  "type": "ROUND_WAITING",
  "data": {
    "roundId": "rd_20260903_9841",
    "countdownMs": 5000,
    "serverSeedHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}

// Server -> Client: Flight Started
{
  "type": "FLIGHT_STARTED",
  "data": {
    "roundId": "rd_20260903_9841",
    "startTime": 1788451200000
  }
}

// Server -> Client: Multiplier Tick (100ms interval)
{
  "type": "TICK",
  "data": {
    "roundId": "rd_20260903_9841",
    "multiplier": 3.42,
    "elapsedMs": 8040
  }
}

// Client -> Server: Place Bet
{
  "type": "PLACE_BET",
  "data": {
    "roundId": "rd_20260903_9841",
    "betIndex": 0,
    "amount": 250.00,
    "autoCashout": 2.00
  }
}

// Client -> Server: Request Cashout
{
  "type": "CASH_OUT",
  "data": {
    "roundId": "rd_20260903_9841",
    "betIndex": 0
  }
}

// Server -> Client: Flight Crash Event
{
  "type": "FLIGHT_CRASHED",
  "data": {
    "roundId": "rd_20260903_9841",
    "finalMultiplier": 7.84,
    "serverSeed": "9a2f7c01b5e39d481029481a0293481029384019283049182039481029384019",
    "clientSeed": "jillu_player_seed_alpha",
    "nonce": 9841
  }
}
```

---
*Open-Source Technical Specifications & Engine Reference — Released under the MIT License.*
