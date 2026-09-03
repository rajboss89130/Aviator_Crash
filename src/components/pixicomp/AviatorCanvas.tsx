// ============================================================================
// CASINO AVIATOR CANVAS RENDERER
// 60FPS Continuous Flight Physics, Dynamic Climb & Cruise Wave, & Aircraft FX
// ============================================================================

import React, { useEffect, useRef } from "react";
import { GameEngineState } from "../../game-engine/types";
import { GameEngine } from "../../game-engine/GameEngine";

interface AviatorCanvasProps {
  // Props are kept for React re-render compatibility, but the internal render loop reads directly from the engine for zero-delay synchronization.
  state: GameEngineState;
  multiplier: number;
  progressRatio: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export const AviatorCanvas: React.FC<AviatorCanvasProps> = ({ state, multiplier, progressRatio }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep latest props accessible to the continuous 60fps render loop without re-triggering effect
  const propsRef = useRef({ state, multiplier, progressRatio });
  useEffect(() => {
    propsRef.current = { state, multiplier, progressRatio };
  }, [state, multiplier, progressRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Flight state tracking inside persistent loop
    let prevState: GameEngineState = GameEngine.getInstance().state;
    let propellerAngle = 0;
    const particles: Particle[] = [];

    // Crash fly-away state
    const crashAnim = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      alpha: 1.0,
    };

    // Resize handler (only sets canvas buffer dimensions when container truly resizes)
    const handleResize = () => {
      if (!container || !canvas) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      if (w === width && h === height && dpr === Math.min(window.devicePixelRatio || 1, 2)) return;

      width = w;
      height = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    // Initial canvas sizing
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const initCtx = canvas.getContext("2d");
    if (initCtx) {
      initCtx.scale(dpr, dpr);
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // ========================================================================
    // 60FPS CONTINUOUS RENDER LOOP
    // ========================================================================
    const render = (now: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Read directly from the GameEngine to bypass React's asynchronous setState delay.
      // This ensures the visual plane rendering is identically synchronized with the core multiplier tick on the exact same frame.
      const engine = GameEngine.getInstance();
      const currentState = engine.state;
      const currentMultiplier = engine.currentMultiplier;

      // Detect state transitions
      if (currentState !== prevState) {
        if (currentState === "ANIM_STARTED") {
          crashAnim.active = false;
        } else if (currentState === "ANIM_CRASHED" && !crashAnim.active) {
          crashAnim.active = true;
          crashAnim.vx = 14;
          crashAnim.vy = -10;
          crashAnim.rot = -0.35;
          crashAnim.alpha = 1.0;

          // Spawn burst particles at crash location
          for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 3 + Math.random() * 6;
            particles.push({
              x: crashAnim.x,
              y: crashAnim.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              alpha: 1.0,
              size: 3 + Math.random() * 4,
              color: Math.random() > 0.4 ? "#ef4444" : "#f59e0b",
            });
          }
        }
        prevState = currentState;
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Authentic Aviator Radial Sunburst Rays Background (Matching Screenshot)
      drawSunburstBackground(ctx, width, height, now, currentState === "ANIM_STARTED");

      // 2. Draw Arena Elements based on state
      if (currentState === "ANIM_STARTED" || currentState === "ANIM_CRASHED") {
        drawFlightCurveAndPlane(ctx, width, height, now, currentState, currentMultiplier);
      } else {
        drawIdleRunway(ctx, width, height, currentState);
      }

      // 3. Update & Draw Particles (Exhaust sparks, burst fire)
      updateAndDrawParticles(ctx);

      animId = requestAnimationFrame(render);
    };

    // ========================================================================
    // AUTHENTIC AVIATOR RADIAL SUNBURST BACKGROUND (MATCHING SCREENSHOT)
    // Deep dark navy radial vignette with alternating radiating sunburst rays
    // ========================================================================
    const drawSunburstBackground = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      now: number,
      isFlying: boolean
    ) => {
      ctx.save();

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(w, h) * 0.75;

      // 1. Deep navy radial base gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      bgGrad.addColorStop(0, "#161e2e"); // Subtle illuminated central glow
      bgGrad.addColorStop(0.28, "#0e1422");
      bgGrad.addColorStop(0.62, "#070a12");
      bgGrad.addColorStop(1, "#020306"); // Dark edge
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Alternating radiating sunburst rays (matching screenshot)
      const numRays = 36;
      const angleStep = (Math.PI * 2) / numRays;
      // Gentle cinematic rotation during flight, smooth and atmospheric
      const rot = isFlying ? (now * 0.0001) % (Math.PI * 2) : 0;

      for (let i = 0; i < numRays; i++) {
        if (i % 2 === 0) {
          const startAngle = rot + i * angleStep;
          const endAngle = startAngle + angleStep;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, maxR, startAngle, endAngle);
          ctx.closePath();

          // Lighter ray sector matching screenshot's dark blue-grey contrast
          ctx.fillStyle = "rgba(255, 255, 255, 0.038)";
          ctx.fill();
        }
      }

      // 3. Smooth radial vignette darkening toward borders
      const vignette = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.16, cx, cy, maxR);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.42, "rgba(0, 0, 0, 0.18)");
      vignette.addColorStop(0.78, "rgba(0, 0, 0, 0.65)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.96)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
    };

    // ========================================================================
    // IDLE RUNWAY STATE (WAITING & PREPARING TAKEOFF - FLUSH BOTTOM-LEFT)
    // ========================================================================
    const drawIdleRunway = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      curState: GameEngineState
    ) => {
      // Resting flush against bottom-left corner with zero unnecessary margin
      const planeStartX = 24;
      const planeStartY = h - 14;

      ctx.save();
      ctx.translate(planeStartX, planeStartY);

      drawAirplaneVector(ctx, false);
      ctx.restore();
    };

    // ========================================================================
    // IN-FLIGHT CURVE & AIRPLANE MOVEMENT (ORIGIN AT EXACT BOTTOM-LEFT: 0, h)
    // ========================================================================
    const drawFlightCurveAndPlane = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      now: number,
      curState: GameEngineState,
      curMultiplier: number
    ) => {
      // Exact bottom-left corner origin: 0 left margin, 0 bottom margin
      const startX = 0;
      const startY = h;

      const originPlaneX = 24;
      const originPlaneY = h - 14;

      // Authentic Aviator Flight Trajectory:
      // 1. Initial Takeoff & Climb Phase (first 2.2 seconds):
      //    Plane smoothly accelerates from runway origin and climbs upwards.
      // 2. Cruising Phase (t >= 2.2s):
      //    Plane reaches the upper-right cruising zone (~68% width, ~35% height)
      //    and floats with natural aerodynamic wave/turbulence as multiplier continues climbing!
      // Derive elapsed time exactly from the multiplier for flawless engine synchronization
      const flightElapsedSec = Math.max(0, 6.5 * Math.log(Math.max(1.0, curMultiplier)));

      // Target cruising position (responsive to screen size)
      const baseCruiseX = Math.min(w - 70, Math.max(originPlaneX + 180, w * 0.68));
      const baseCruiseY = Math.max(60, Math.min(h * 0.44, h * 0.35));

      let currentX = originPlaneX;
      let currentY = originPlaneY;
      let pitchAngle = -0.15;

      if (flightElapsedSec <= 2.2) {
        // Smooth ease-out climb from bottom-left corner into sky
        const t = Math.min(1.0, flightElapsedSec / 2.2);
        const easeOut = 1 - Math.pow(1 - t, 3);
        currentX = originPlaneX + (baseCruiseX - originPlaneX) * easeOut;
        currentY = originPlaneY - (originPlaneY - baseCruiseY) * Math.pow(easeOut, 1.25);
        pitchAngle = -0.42 * (1 - t * 0.4); // Steeper pitch during initial climb
      } else {
        // Cruising & Floating Wave Phase
        const cruiseTime = flightElapsedSec - 2.2;
        // Natural aerodynamic hovering bob
        const floatY = Math.sin(cruiseTime * 2.5) * 12 + Math.sin(cruiseTime * 4.3) * 4;
        const floatX = Math.sin(cruiseTime * 1.6) * 7;

        // Subtle extra altitude rise as multiplier climbs higher
        const altGain = Math.min(h * 0.12, Math.log10(Math.max(1, curMultiplier)) * 16);

        currentX = baseCruiseX + floatX;
        currentY = baseCruiseY + floatY - altGain;
        pitchAngle = -0.18 + Math.cos(cruiseTime * 2.5) * 0.06;
      }

      // Record coordinates for crash animation
      if (curState === "ANIM_STARTED") {
        crashAnim.x = currentX;
        crashAnim.y = currentY;
      }

      // Smooth parabolic control point
      const cpX = startX + (currentX - startX) * 0.55;
      const cpY = startY;

      // 1. Red Gradient Area Fill under flight trajectory
      const areaGrad = ctx.createLinearGradient(0, currentY, 0, startY);
      areaGrad.addColorStop(0, "rgba(225, 29, 72, 0.32)");
      areaGrad.addColorStop(0.6, "rgba(225, 29, 72, 0.10)");
      areaGrad.addColorStop(1, "rgba(225, 29, 72, 0.0)");

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(cpX, cpY, currentX, currentY);
      ctx.lineTo(currentX, startY);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // 2. Glowing Red Flight Curve
      ctx.save();
      ctx.shadowColor = "#e11d48";
      ctx.shadowBlur = 12;
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(cpX, cpY, currentX, currentY);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Airplane
      if (curState === "ANIM_STARTED") {
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(pitchAngle);
        drawAirplaneVector(ctx, true);
        ctx.restore();

        // Engine exhaust trail behind the plane
        if (Math.random() > 0.2) {
          particles.push({
            x: currentX - 22,
            y: currentY + (Math.random() - 0.5) * 8,
            vx: -3 - Math.random() * 3,
            vy: (Math.random() - 0.5) * 2,
            alpha: 0.9,
            size: 2.5 + Math.random() * 3.5,
            color: Math.random() > 0.4 ? "#ef4444" : "#f59e0b",
          });
        }
      } else if (curState === "ANIM_CRASHED" && crashAnim.active) {
        // Plane zooms away into the stratosphere!
        crashAnim.x += crashAnim.vx;
        crashAnim.y += crashAnim.vy;
        crashAnim.rot -= 0.02;
        crashAnim.alpha = Math.max(0, crashAnim.alpha - 0.025);

        if (crashAnim.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = crashAnim.alpha;
          ctx.translate(crashAnim.x, crashAnim.y);
          ctx.rotate(crashAnim.rot);
          drawAirplaneVector(ctx, true);
          ctx.restore();
        }
      }
    };

    // ========================================================================
    // AUTHENTIC AVIATOR RED PROPELLER AIRPLANE (VECTOR ARTWORK)
    // ========================================================================
    const drawAirplaneVector = (ctx: CanvasRenderingContext2D, isFlying: boolean) => {
      ctx.save();
      ctx.scale(0.85, 0.85);

      // Jet Thruster Plume (When flying)
      if (isFlying) {
        const exhaustGrad = ctx.createRadialGradient(-20, 0, 1, -20, 0, 18);
        exhaustGrad.addColorStop(0, "rgba(255, 235, 120, 0.95)");
        exhaustGrad.addColorStop(0.4, "rgba(239, 68, 68, 0.75)");
        exhaustGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = exhaustGrad;
        ctx.beginPath();
        ctx.arc(-20, 0, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fuselage Underbelly Shadow
      ctx.fillStyle = "#7f1d1d";
      ctx.beginPath();
      ctx.moveTo(-16, 5);
      ctx.quadraticCurveTo(35, 14, 76, 4);
      ctx.lineTo(72, -2);
      ctx.quadraticCurveTo(25, 8, -16, 0);
      ctx.closePath();
      ctx.fill();

      // Main Crimson Fuselage Body
      const bodyGrad = ctx.createLinearGradient(0, -12, 0, 12);
      bodyGrad.addColorStop(0, "#f87171");
      bodyGrad.addColorStop(0.35, "#ef4444");
      bodyGrad.addColorStop(0.8, "#dc2626");
      bodyGrad.addColorStop(1, "#991b1b");
      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.moveTo(-16, -4);
      ctx.quadraticCurveTo(-10, -12, 18, -12);
      ctx.quadraticCurveTo(55, -9, 80, -2);
      ctx.quadraticCurveTo(84, 0, 80, 2);
      ctx.quadraticCurveTo(55, 9, 18, 9);
      ctx.quadraticCurveTo(-10, 7, -16, 2);
      ctx.closePath();
      ctx.fill();

      // White Racing Stripe across fuselage
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(6, -3);
      ctx.lineTo(72, -1);
      ctx.lineTo(68, 1.5);
      ctx.lineTo(2, 0);
      ctx.closePath();
      ctx.fill();

      // Cockpit Canopy (Deep Sky Blue Glass with Glare)
      const glassGrad = ctx.createLinearGradient(20, -12, 38, -2);
      glassGrad.addColorStop(0, "#bae6fd");
      glassGrad.addColorStop(0.5, "#0284c7");
      glassGrad.addColorStop(1, "#0c4a6e");
      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.moveTo(20, -5);
      ctx.quadraticCurveTo(26, -13, 38, -12);
      ctx.quadraticCurveTo(46, -7, 47, -4);
      ctx.lineTo(20, -4);
      ctx.closePath();
      ctx.fill();

      // Pilot Head Silhouette
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(31, -7, 3, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Tail Fin
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath();
      ctx.moveTo(-16, -2);
      ctx.lineTo(-24, -18);
      ctx.lineTo(-15, -18);
      ctx.lineTo(-6, -5);
      ctx.closePath();
      ctx.fill();

      // Tail Fin Gold Accent Tip
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-24, -18);
      ctx.lineTo(-20, -18);
      ctx.lineTo(-18, -14);
      ctx.lineTo(-22, -14);
      ctx.closePath();
      ctx.fill();

      // Main Swept Red Wing
      const wingGrad = ctx.createLinearGradient(15, -14, 35, 14);
      wingGrad.addColorStop(0, "#f87171");
      wingGrad.addColorStop(0.5, "#dc2626");
      wingGrad.addColorStop(1, "#991b1b");
      ctx.fillStyle = wingGrad;

      // Far Wing (Top)
      ctx.beginPath();
      ctx.moveTo(22, -5);
      ctx.lineTo(30, -22);
      ctx.lineTo(39, -22);
      ctx.lineTo(34, -5);
      ctx.closePath();
      ctx.fill();

      // Near Wing (Bottom)
      ctx.beginPath();
      ctx.moveTo(18, 2);
      ctx.lineTo(21, 20);
      ctx.lineTo(31, 18);
      ctx.lineTo(31, 4);
      ctx.closePath();
      ctx.fill();

      // Gold Nose Cone
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(82, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Spinning Front Propeller
      propellerAngle += isFlying ? 0.5 : 0.08;
      ctx.save();
      ctx.translate(83, 0);
      ctx.rotate(propellerAngle);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 2, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(251, 191, 36, 0.8)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    // ========================================================================
    // PARTICLE FX (EXHAUST SMOKE & BURST FLAMES)
    // ========================================================================
    const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size *= 0.96;

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Start 60fps loop
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []); // Run ONLY ONCE on mount to ensure persistent 60fps loop

  return (
    <div
      ref={containerRef}
      id="aviator-canvas-container"
      className="relative w-full h-full min-h-0 flex items-center justify-center overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
