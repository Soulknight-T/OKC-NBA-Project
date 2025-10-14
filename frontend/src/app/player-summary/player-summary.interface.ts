export interface Coordinate {
    x: number;
    y: number;
  }
  
  export type HalfCourtAction = 'Pick & Roll' | 'Isolation' | 'Post-up' | 'Off-Ball Screen';
  
  export interface ShotEvent {
    shotId: number;
    actionType: HalfCourtAction;
    location: Coordinate;
    made: boolean;
    timestamp: string;
  }
  
  export interface PassEvent {
    passId: number;
    actionType: HalfCourtAction;
    location: Coordinate;
    completed: boolean;
    timestamp: string;
  }
  
  export interface TurnoverEvent {
    turnoverId: number;
    actionType: HalfCourtAction;
    location: Coordinate;
    reason: string; 
    timestamp: string;
  }
  
  export interface PlayerTotals {
    totalPoints: number;
    totalShotAttempts: number;
    shootingFoulsDrawn: number;
    totalPasses: number;
    completedPasses: number;
    totalPotentialAssists: number;
    totalTurnovers: number;
  
    pickAndRollCount: number;
    isolationCount: number;
    postUpCount: number;
    offBallScreenCount: number;
  }
  
  export interface PlayerRanks {
    totalPointsRank: number;
    totalShotAttemptsRank: number;
    totalPassesRank: number;
    totalPotentialAssistsRank: number;
    totalTurnoversRank: number;
  }
  
  export interface PlayerSummaryResponse {
    player_id: number;
    player_name: string;
    team: string;
  
    totals: PlayerTotals;
    ranks: PlayerRanks;
  }
  
  export interface PlayerSummaryApiResponse {
    player_id: number;
    player_name: string;
    team: string;
  
    totalPoints: number;
    totalShotAttempts: number;
    shootingFoulsDrawn: number;
    totalPasses: number;
    completedPasses: number;
    totalPotentialAssists: number;
    totalTurnovers: number;
  
    pickAndRollCount: number;
    isolationCount: number;
    postUpCount: number;
    offBallScreenCount: number;
  
    totalPointsRank: number;
    totalShotAttemptsRank: number;
    totalPassesRank: number;
    totalPotentialAssistsRank: number;
    totalTurnoversRank: number;
  }
  