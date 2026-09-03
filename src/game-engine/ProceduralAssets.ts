// ============================================================================
// PROCEDURAL TEXTURE GENERATOR FOR PIXI.JS
// Zero-Dependency, Retina-Ready Vector Assets for the Casino Game Engine
// ============================================================================

import { Texture } from "pixi.js";

export class ProceduralAssets {
  private static planeTextureCache: Texture | null = null;
  private static parachuteTextureCache: Texture | null = null;
  private static smokeTextureCache: Texture | null = null;
  private static sparkTextureCache: Texture | null = null;

  /**
   * Generates the iconic Aviator Red Racing Plane
   */
  public static getPlaneTexture(propellerAngle = 0): Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");

    if (!ctx) return Texture.WHITE;

    ctx.save();
    ctx.translate(20, 40);

    // Engine Exhaust Glow
    const exhaustGrad = ctx.createRadialGradient(-18, 0, 1, -18, 0, 14);
    exhaustGrad.addColorStop(0, "rgba(255, 200, 50, 0.9)");
    exhaustGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.6)");
    exhaustGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
    ctx.fillStyle = exhaustGrad;
    ctx.beginPath();
    ctx.arc(-18, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Fuselage shadow / bottom
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.moveTo(-15, 6);
    ctx.quadraticCurveTo(40, 16, 90, 4);
    ctx.lineTo(85, -2);
    ctx.quadraticCurveTo(30, 8, -15, 0);
    ctx.closePath();
    ctx.fill();

    // Main Fuselage (Bright Crimson Red)
    const bodyGrad = ctx.createLinearGradient(0, -12, 0, 12);
    bodyGrad.addColorStop(0, "#ef4444");
    bodyGrad.addColorStop(0.6, "#dc2626");
    bodyGrad.addColorStop(1, "#b91c1c");
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.moveTo(-15, -4);
    ctx.quadraticCurveTo(-10, -12, 20, -12);
    ctx.quadraticCurveTo(65, -10, 95, -2);
    ctx.quadraticCurveTo(100, 0, 95, 2);
    ctx.quadraticCurveTo(65, 10, 20, 10);
    ctx.quadraticCurveTo(-10, 8, -15, 2);
    ctx.closePath();
    ctx.fill();

    // White Racing Stripe
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(5, -3);
    ctx.lineTo(85, -1);
    ctx.lineTo(80, 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Cockpit Canopy (Dark Glass with Gloss Highlight)
    const glassGrad = ctx.createLinearGradient(25, -14, 45, -2);
    glassGrad.addColorStop(0, "#38bdf8");
    glassGrad.addColorStop(0.5, "#0284c7");
    glassGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.moveTo(25, -6);
    ctx.quadraticCurveTo(32, -15, 46, -14);
    ctx.quadraticCurveTo(55, -8, 56, -4);
    ctx.lineTo(25, -5);
    ctx.closePath();
    ctx.fill();

    // Canopy glass glare
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, -8);
    ctx.quadraticCurveTo(36, -13, 44, -12);
    ctx.stroke();

    // Pilot Silhouette
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(38, -8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail Fin / Vertical Stabilizer
    ctx.fillStyle = "#b91c1c";
    ctx.beginPath();
    ctx.moveTo(-15, -2);
    ctx.lineTo(-24, -22);
    ctx.lineTo(-14, -22);
    ctx.lineTo(-5, -6);
    ctx.closePath();
    ctx.fill();

    // Tail Fin Yellow Tip
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(-24, -22);
    ctx.lineTo(-20, -22);
    ctx.lineTo(-18, -18);
    ctx.lineTo(-22, -18);
    ctx.closePath();
    ctx.fill();

    // Main Wings (Swept monoplane wings)
    const wingGrad = ctx.createLinearGradient(20, -18, 45, 18);
    wingGrad.addColorStop(0, "#f87171");
    wingGrad.addColorStop(0.5, "#dc2626");
    wingGrad.addColorStop(1, "#991b1b");
    ctx.fillStyle = wingGrad;

    // Upper/Far Wing
    ctx.beginPath();
    ctx.moveTo(28, -6);
    ctx.lineTo(38, -26);
    ctx.lineTo(48, -26);
    ctx.lineTo(42, -6);
    ctx.closePath();
    ctx.fill();

    // Near Wing (Lower)
    ctx.beginPath();
    ctx.moveTo(22, 2);
    ctx.lineTo(26, 24);
    ctx.lineTo(38, 22);
    ctx.lineTo(38, 4);
    ctx.closePath();
    ctx.fill();

    // Propeller Spinner Cone
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(97, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Spinning Propeller Blur Disk
    ctx.save();
    ctx.translate(98, 0);
    ctx.rotate(propellerAngle);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    return Texture.from(canvas);
  }

  /**
   * Generates a cached static plane texture
   */
  public static getStaticPlane(): Texture {
    if (!this.planeTextureCache) {
      this.planeTextureCache = this.getPlaneTexture(0);
    }
    return this.planeTextureCache;
  }

  /**
   * Generates Parachute Texture for cashouts
   */
  public static getParachuteTexture(): Texture {
    if (this.parachuteTextureCache) return this.parachuteTextureCache;

    const canvas = document.createElement("canvas");
    canvas.width = 44;
    canvas.height = 44;
    const ctx = canvas.getContext("2d");

    if (!ctx) return Texture.WHITE;

    // Canopy Dome
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(22, 14, 12, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // White stripes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(22, 14, 7, Math.PI * 1.15, Math.PI * 1.85, false);
    ctx.lineTo(22, 14);
    ctx.closePath();
    ctx.fill();

    // Cords
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 14);
    ctx.lineTo(22, 30);
    ctx.moveTo(34, 14);
    ctx.lineTo(22, 30);
    ctx.moveTo(16, 14);
    ctx.lineTo(22, 30);
    ctx.moveTo(28, 14);
    ctx.lineTo(22, 30);
    ctx.stroke();

    // Figure
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(22, 32, 2.5, 0, Math.PI * 2);
    ctx.fill();

    this.parachuteTextureCache = Texture.from(canvas);
    return this.parachuteTextureCache;
  }

  /**
   * Generates Soft Glow / Smoke particle texture
   */
  public static getSmokeTexture(): Texture {
    if (this.smokeTextureCache) return this.smokeTextureCache;

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    if (!ctx) return Texture.WHITE;

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(239, 68, 68, 0.8)");
    grad.addColorStop(0.35, "rgba(239, 68, 68, 0.35)");
    grad.addColorStop(0.7, "rgba(245, 158, 11, 0.15)");
    grad.addColorStop(1, "rgba(239, 68, 68, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    this.smokeTextureCache = Texture.from(canvas);
    return this.smokeTextureCache;
  }

  /**
   * Sparkle / Win burst star texture
   */
  public static getSparkTexture(): Texture {
    if (this.sparkTextureCache) return this.sparkTextureCache;

    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext("2d");

    if (!ctx) return Texture.WHITE;

    const grad = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(251, 191, 36, 0.8)");
    grad.addColorStop(1, "rgba(245, 158, 11, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(12, 12, 12, 0, Math.PI * 2);
    ctx.fill();

    this.sparkTextureCache = Texture.from(canvas);
    return this.sparkTextureCache;
  }
}
