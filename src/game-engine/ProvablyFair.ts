// ============================================================================
// PROVABLY FAIR SHA-256 ENGINE
// Standard Cryptographic Verification for Casino Crash Games
// ============================================================================

import { ProvablyFairData } from "./types";

/**
 * Standard SHA-256 implementation with clean TypeScript typing
 */
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  let i = 0;
  let j = 0;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

  ascii += "\x80";
  while ((ascii.length % 64) - 56) ascii += "\x00";

  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);

      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += hexDigits[(b >> 4) & 0x0f] + hexDigits[b & 0x0f];
    }
  }
  return result;
}

export class ProvablyFairEngine {
  private static randomHex(length: number): string {
    const chars = "0123456789abcdef";
    let output = "";
    for (let i = 0; i < length; i++) {
      output += chars[Math.floor(Math.random() * chars.length)];
    }
    return output;
  }

  /**
   * Generates a provably fair round outcome
   */
  public static generateRound(nonce: number, clientSeed = "aviator_casino_client_seed"): ProvablyFairData {
    const serverSeed = this.randomHex(64);
    const combined = `${serverSeed}:${clientSeed}:${nonce}`;
    const hash = sha256Sync(combined);

    const subHash = hash.substring(0, 13);
    const intVal = parseInt(subHash, 16);
    const e = Math.pow(2, 52);

    let multiplier = 1.0;
    // 3% instant crash
    if (intVal % 33 === 0) {
      multiplier = 1.0;
    } else {
      const floatVal = (e - intVal) / e;
      const raw = Math.floor((100 * 0.97) / (1.0 - floatVal + 0.0000000001)) / 100;
      multiplier = Math.max(1.0, Math.min(raw, 500.0));
    }

    if (isNaN(multiplier) || multiplier < 1.0) {
      multiplier = 1.0;
    }

    return {
      roundId: `RD-${Date.now().toString(36).toUpperCase()}-${nonce}`,
      crashMultiplier: parseFloat(multiplier.toFixed(2)),
      serverSeed,
      clientSeed,
      nonce,
      hash,
      timestamp: Date.now(),
    };
  }

  public static generateForcedRound(
    nonce: number,
    forcedMultiplier: number,
    clientSeed = "aviator_dev_forced_seed"
  ): ProvablyFairData {
    const serverSeed = this.randomHex(64);
    const combined = `${serverSeed}:${clientSeed}:${nonce}:${forcedMultiplier}`;
    const hash = sha256Sync(combined);

    return {
      roundId: `RD-DEV-${Date.now().toString(36).toUpperCase()}-${nonce}`,
      crashMultiplier: parseFloat(Math.max(1.0, forcedMultiplier).toFixed(2)),
      serverSeed,
      clientSeed,
      nonce,
      hash,
      timestamp: Date.now(),
    };
  }

  /**
   * Verifies an existing round result against the cryptographic seeds
   */
  public static verifyResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number
  ): { calculatedHash: string; multiplier: number } {
    const combined = `${serverSeed}:${clientSeed}:${nonce}`;
    const hash = sha256Sync(combined);

    const subHash = hash.substring(0, 13);
    const intVal = parseInt(subHash, 16);
    const e = Math.pow(2, 52);

    let multiplier = 1.0;
    if (intVal % 33 === 0) {
      multiplier = 1.0;
    } else {
      const floatVal = (e - intVal) / e;
      const raw = Math.floor((100 * 0.97) / (1.0 - floatVal + 0.0000000001)) / 100;
      multiplier = Math.max(1.0, Math.min(raw, 500.0));
    }

    return {
      calculatedHash: hash,
      multiplier: parseFloat(multiplier.toFixed(2)),
    };
  }
}
