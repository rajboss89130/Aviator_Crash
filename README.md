# Aviator WebGL Game Engine & UI — Open Source Frontend Demonstration

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Type: Open Source](https://img.shields.io/badge/Type-Open--Source%20Demonstration-green.svg)](#project-positioning)
[![Engine: React 18 | WebGL](https://img.shields.io/badge/Engine-React18%20%7C%20PixiJS%20%7C%20WebGL2-orange.svg)](#architecture)
[![Status: Frontend Only](https://img.shields.io/badge/Status-Frontend%20Only-lightgrey.svg)](#disclaimer)

---

## ⚠️ Important Disclaimer

> **THIS PROJECT IS A FRONTEND DEMONSTRATION ONLY.**
>
> It **does not** include real-money gambling functionality, betting services, payment processing, wallet management, financial transactions, or any backend gambling system.
>
> All game interactions, balance numbers, and multiplier flight curves are **simulated locally on the client side** for demonstration, research, UI experimentation, and educational purposes only.

---

## 1. Project Overview

**Aviator WebGL Game Engine & UI** provides a high-performance, frontend-only implementation of an interactive crash-style game interface. Created for educational research, UI/UX experimentation, and HTML5 WebGL game engine study, this repository showcases modern web rendering techniques using React 18, TypeScript, PixiJS, WebGL 2.0, and the Web Audio API.

### Intended Audience
- **Frontend & WebGL Developers:** Exploring 60FPS canvas rendering loops, particle systems, and mathematical trajectory curves.
- **UI/UX Designers:** Studying responsive gaming dashboards, dual-console interaction design, and real-time visual feedback.
- **Computer Science Students & Educators:** Referencing event-driven state machine architecture and client-side Provably Fair math algorithms (HMAC-SHA256).

---

## 2. Project Positioning

### What This Project IS:
- ✅ **Open-Source Frontend Game Project:** Free and accessible codebase for studying web game mechanics.
- ✅ **Game UI & Animation Demonstration:** Clean, responsive, 60FPS interactive user interface.
- ✅ **HTML5 / WebGL Engine Example:** Demonstrates zero-lag Canvas rendering decoupled from React's virtual DOM.
- ✅ **Interactive Frontend Experience:** Local client-side state simulation for testing user interaction flows.
- ✅ **Developer Learning Resource:** Modular, strictly typed codebase serving as a reference for complex frontend apps.

### What This Project IS NOT:
- ❌ **NOT a Real-Money Gambling Platform:** No real currency is involved or supported.
- ❌ **NOT an Online Betting Service:** No real wagers, payout servers, or gambling backends exist in this repository.
- ❌ **NOT a Casino Operation:** Contains no operator backend, risk management, or house edge engine.
- ❌ **NOT a Payment or Wallet System:** No deposit, withdrawal, banking, or crypto processing capabilities.
- ❌ **NOT a Financial Product:** Purely software demonstration and visual interface code.

---

## 3. Frontend Features

- **60FPS High-Altitude WebGL Canvas:** Smooth exponential trajectory flight rendering using PixiJS / HTML5 Canvas with dynamic particle exhaust, atmospheric glow, and coordinate grids.
- **Interactive Dual-Console Game UI:** Simulated side-by-side betting control panels supporting independent test amounts, auto-bet toggles, and auto-cashout target multipliers.
- **Synthesized Web Audio Sound Effects:** Zero-latency audio feedback using procedural Web Audio API nodes (engine pitch acceleration, Doppler flight sounds, cashout chimes).
- **Responsive & Mobile-Friendly Layout:** Adaptive interface engineered for desktop screens, mobile devices, and installable Progressive Web Apps (PWA).
- **Client-Side Provably Fair Math Demo:** Mathematical demonstration of HMAC-SHA256 seed hashing for transparent crash outcome verification.
- **Live Multiplier History Ribbon:** Visually categorized historical round multiplier chips with color-coded statistical tiers.

---

## 4. Architecture & Technical Breakdown

### System Architecture
```text
┌─────────────────────────────────────────────────────────┐
│             GameEngine Singleton (Client State)         │
│   - State FSM: WAITING | ANIM_STARTED | ANIM_CRASHED    │
│   - Multiplier Clock: Exponential Math Trajectory       │
│   - Local HMAC-SHA256 Outcome Calculator                │
└──────────────┬───────────────────────────┬──────────────┘
               │ requestAnimationFrame      │ Observer Events
               ▼                           ▼
┌──────────────────────────┐  ┌───────────────────────────┐
│   AviatorCanvas (WebGL)  │  │   React UI Components     │
│   - 60FPS Flight Curve   │  │   - Dual Bet Consoles     │
│   - Particle Emissions   │  │   - Multiplier HUD        │
│   - Dynamic Camera Grid  │  │   - Simulated Bet Feed    │
└──────────────────────────┘  └───────────────────────────┘
```

### Technology Stack
| Layer | Technologies & Libraries |
|---|---|
| **UI Framework** | React 18, TypeScript (Strict Mode) |
| **Rendering Engine** | HTML5 Canvas 2D / PixiJS v7, WebGL 2.0 |
| **Styling** | Tailwind CSS, CSS Variables |
| **State Machine** | Custom Event-Driven Game Engine (`src/game-engine/GameEngine.ts`) |
| **Audio Engine** | HTML5 Web Audio API & Procedural Synthesizers |
| **Build System** | Webpack 5, React Scripts, PostCSS, ESLint |

### Backend & Security Boundary Notice
> **Notice:** This project **does not** provide backend authority, user account persistence, payment systems, wallet services, or financial transaction handling. Any developer wishing to connect this frontend to a remote backend must implement their own secure, server-authoritative API and authentication pipeline.

---

## 5. Security Notice

This codebase **does not** collect, transmit, or process:
- User authentication credentials
- Payment or banking information
- Real currency or wallet balances
- Personal identifiable information (PII)
- Real-money transactions

Do not attempt to send or store real financial data within this local demonstration project.

---

## 6. Responsible Use Statement

This project is published solely for software development, education, and frontend game technology research.

Developers, researchers, and users who download or fork this codebase are solely responsible for ensuring that any derivative works or applications they build comply with all applicable local, regional, national, and international laws and regulations regarding web applications and software licensing.

---

## 7. Installation & Local Setup

### Prerequisites
- Node.js `18.x` or `20.x` LTS
- NPM `9.x+` or Yarn / Bun

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/jillu-studios/aviator-webgl-demo.git
cd aviator-webgl-demo

# 2. Install dependencies
npm install

# 3. Start local development server (http://localhost:3000)
npm start

# 4. Create optimized production build
npm run build
```

---

## 8. Project Structure

```text
.
├── LICENSE                    # Open-source MIT License terms
├── README.md                  # Project documentation & maintainer guide
├── GAME_DOCUMENTATION.md      # WebGL & math engine technical specifications
├── LOBBY_INTEGRATION.json     # Sample UI metadata & integration protocol spec
├── CHANGELOG.md               # Version history and release notes
├── metadata.json              # Platform identity manifest
├── public/                    # Static assets, Web App Manifest, icons
└── src/
    ├── api/                   # Local state bridge interface
    ├── assets/                # Branding assets & images
    ├── components/            # React UI components (BetConsole, HistoryRibbon, etc.)
    │   ├── aviator/           # Main game interface containers
    │   ├── modals/            # Rule dialogs & Provably Fair verification modal
    │   └── pixicomp/          # 60FPS WebGL canvas flight renderers
    ├── game-engine/           # Core state machine, math formulas, audio engine
    └── index.tsx              # Application bootstrap
```

---

## 9. Contributing

Contributions from the open-source community are welcome! You can contribute by:
- Improving WebGL rendering performance and particle effects.
- Enhancing accessibility and responsive UI layouts.
- Fixing frontend bugs and expanding test coverage.
- Refining technical documentation and code comments.

### Contribution Process
1. Fork the repository.
2. Create a descriptive feature branch (`git checkout -b feature/ui-enhancement`).
3. Commit your changes (`git commit -m 'Improve canvas particle performance'`).
4. Push to the branch (`git push origin feature/ui-enhancement`).
5. Open a Pull Request for review.

---

## 10. License & Attributions

This project is open-source software released under the permissive **[MIT License](LICENSE)**.

```text
MIT License
Copyright (c) 2026 JILLU Gaming Studios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

Developers are free to study, modify, adapt, and build upon this source code in accordance with the MIT License terms.

---
*Open-Source Frontend Game Demonstration & Technology Reference.*
