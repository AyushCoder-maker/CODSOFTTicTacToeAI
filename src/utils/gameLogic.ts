import { GameBoard, Player } from '../types/game';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export const createEmptyBoard = (): GameBoard => Array(9).fill(null);

export const checkWinner = (board: GameBoard): Player | 'tie' | null => {
  // Check for winning combinations
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Check for tie
  if (board.every(cell => cell !== null)) {
    return 'tie';
  }

  return null;
};

export const getAvailableMoves = (board: GameBoard): number[] => {
  return board.map((cell, index) => cell === null ? index : -1)
              .filter(index => index !== -1);
};

export const makeMove = (board: GameBoard, index: number, player: Player): GameBoard => {
  if (board[index] !== null) {
    throw new Error('Invalid move: Cell already occupied');
  }
  
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
};

export const isValidMove = (board: GameBoard, index: number): boolean => {
  return index >= 0 && index < 9 && board[index] === null;
};

export const getWinningCombination = (board: GameBoard): number[] | null => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination;
    }
  }
  return null;
};