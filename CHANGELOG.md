# Changelog

All notable changes to the **Aviator by JILLU** casino frontend module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-03 (Initial Casino-Ready Release)

### Added
- **Official JILLU Provider Branding:** Full integration of high-resolution JILLU Gold Crown Icon and Logo across the splash loading screen, navigation header, game rules, and platform metadata.
- **Cinematic Casino Loading Experience:** Multi-stage loading progress sequence with glowing brand backdrop, dynamic status messages, and seamless opacity fade-in transition.
- **Dual Independent Betting Consoles:** Support for simultaneous dual bets per round with independent auto-cashout multipliers and rapid quick-bet presets (`100`, `200`, `500`, `1000`).
- **60FPS High-Altitude Flight Canvas:** Real-time Bézier flight physics with procedural smoke trail, dynamic plane pitch rotation, and high-contrast night sky grid.
- **Provably Fair SHA-256 Verification:** Cryptographic seed generation and round verification modal for independent verification of every flight crash point.
- **Live Multiplayer Bet Feed:** Interactive real-time player ledger displaying concurrent bets, live cashouts, and green profit highlights.
- **Web Audio FX Engine:** Procedural engine acceleration synthesis, Doppler effect takeoff sounds, and celebratory cashout audio chords.
- **Comprehensive Documentation Suite:** Complete `README.md`, `GAME_DOCUMENTATION.md`, `LOBBY_INTEGRATION.json`, and API integration guidelines.
- **Casino Iframe & PostMessage Protocol:** Bi-directional messaging protocol for seamless integration with host casino wallets and lobbies.
- **PWA Support:** Full Progressive Web App compliance with service worker caching and native install capability.

### Changed
- **Desktop UI Optimization:** Streamlined betting console height, inline auto-cashout switches, and side-by-side action buttons for balanced screen proportions.
- **Mobile Immersion:** Edge-to-edge full-viewport layout eliminating dead space on iOS Safari and Android Chrome.

### Security & Performance
- Zero-lag decoupled rendering pipeline connecting HTML5 Canvas directly to the game engine clock via `requestAnimationFrame`.
- Enforced input boundary sanitization (Min bet $1.00, Max bet $1,000.00, Max multiplier 10,000x).
- Cryptographic SHA-256 HMAC fairness guaranteeing tamper-proof round outcomes.

---
*© 2026 JILLU Gaming Studios. All rights reserved.*
