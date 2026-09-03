// ============================================================================
// WEB AUDIO API SYNTHESIZER
// High-fidelity Zero-Dependency Casino Audio Engine
// ============================================================================

export class AudioEngine {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static sfxGain: GainNode | null = null;
  private static engineOsc: OscillatorNode | null = null;
  private static engineGain: GainNode | null = null;

  public static soundEnabled = true;
  public static musicEnabled = true;
  private static isEngineRunning = false;

  private static getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public static toggleSound(enabled?: boolean): boolean {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopPlaneSound();
    }
    return this.soundEnabled;
  }

  public static toggleMusic(enabled?: boolean): boolean {
    this.musicEnabled = enabled !== undefined ? enabled : !this.musicEnabled;
    return this.musicEnabled;
  }

  /**
   * Continuous rising engine pitch for the ascending Lucky Plane
   */
  public static updatePlaneSound(multiplier: number, isFlying: boolean) {
    if (!this.soundEnabled || !isFlying) {
      this.stopPlaneSound();
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.isEngineRunning || !this.engineOsc || !this.engineGain) {
      // Start continuous engine drone
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sawtooth";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        osc.frequency.setValueAtTime(95, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start();
        this.engineOsc = osc;
        this.engineGain = gain;
        this.isEngineRunning = true;
      } catch {
        // Audio policy ignore
      }
    }

    if (this.engineOsc && this.isEngineRunning) {
      // Map multiplier 1.0 -> 50.0 to frequency 95Hz -> 380Hz
      const freq = Math.min(420, 95 + Math.log2(Math.max(1, multiplier)) * 60);
      this.engineOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.1);
    }
  }

  public static stopPlaneSound() {
    if (this.engineGain && this.ctx && this.isEngineRunning) {
      try {
        this.engineGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
        setTimeout(() => {
          if (this.engineOsc) {
            try {
              this.engineOsc.stop();
              this.engineOsc.disconnect();
            } catch {}
            this.engineOsc = null;
          }
          this.engineGain = null;
          this.isEngineRunning = false;
        }, 160);
      } catch {
        this.engineOsc = null;
        this.engineGain = null;
        this.isEngineRunning = false;
      }
    } else {
      this.isEngineRunning = false;
    }
  }

  /**
   * Payout celebration win chime
   */
  public static playWinSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.36);
    });
  }

  /**
   * Airplane flew away / crash burst sound
   */
  public static playCrashSound() {
    this.stopPlaneSound();
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Descending pitch swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } catch {}
  }

  /**
   * Casino chip click sound
   */
  public static playClickSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * Countdown tick
   */
  public static playTickSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }
}
