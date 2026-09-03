// ============================================================================
// CASINO CRASH GAME ENGINE - TYPES DEFINITION
// ============================================================================

export type GameEngineState = 
  | "WAITING"        // Accepting bets, countdown to launch (e.g. 5 seconds)
  | "ANIM_STARTED"   // Plane in flight, multiplier increasing exponentially
  | "ANIM_CRASHED"   // Flew away / crashed, showing final crash multiplier
  | "ROUND_ENDED";   // Resetting board for next round

export interface ProvablyFairData {
  roundId: string;
  crashMultiplier: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  hash: string;
  timestamp: number;
}

export type BetPlacementStatus = "none" | "placing" | "success" | "failed";
export type BetCashoutStatus = "none" | "caching" | "success" | "failed";

export interface ActiveBet {
  betIndex: number;          // 0 = primary bet, 1 = secondary bet
  amount: number;
  status: BetPlacementStatus;
  cashoutStatus: BetCashoutStatus;
  cashedMultiplier?: number;
  winAmount?: number;
  autoCashoutMultiplier?: number;
  isPendingNextRound: boolean;
}

export interface LiveBetEntry {
  id: string;
  username: string;
  avatar: string;
  betAmount: number;
  crashedAt?: number;
  cashout?: number;
  isCurrentUser?: boolean;
  time: string;
}

export interface CrashHistoryItem {
  roundId: string;
  multiplier: number;
  color: string;
  hash: string;
  serverSeed?: string;
  clientSeed?: string;
  nonce?: number;
  timestamp: number;
}

export interface AutoBetConfig {
  rounds: number;
  remainingRounds: number;
  stopOnLoss?: number;
  stopOnProfit?: number;
  baseBet: number;
}

export interface CasinoEngineConfig {
  minBet: number;
  maxBet: number;
  chips: number[];
  currency: string;
  currencySymbol: string;
  initialBalance: number;
  houseEdgePercent: number; // typically 1% to 3%
  roundWaitTimeSec: number;
  tickIntervalMs: number;
  demoMode: boolean;
  socketUrl?: string;
  apiUrl?: string;
  authToken?: string;
}

export interface CasinoEngineListener {
  onStateChange?: (state: GameEngineState) => void;
  onMultiplierTick?: (multiplier: number, progressRatio: number) => void;
  onCrash?: (result: ProvablyFairData) => void;
  onBetResult?: (betIndex: number, win: number, multiplier: number) => void;
  onBalanceUpdate?: (newBalance: number) => void;
  onHistoryUpdate?: (history: CrashHistoryItem[]) => void;
  onLiveBetsUpdate?: (bets: LiveBetEntry[]) => void;
  onCountdownTick?: (secondsRemaining: number) => void;
}
