export type Player = 'X' | 'O' | null;

export type GameBoard = Player[];

export interface GameState {
  board: GameBoard;
  currentPlayer: Player;
  winner: Player | 'tie' | null;
  isGameOver: boolean;
  gameMode: 'ai' | 'human';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameStats {
  playerWins: number;
  aiWins: number;
  ties: number;
  gamesPlayed: number;
}

export interface Move {
  index: number;
  score?: number;
}