import { GameBoard, Player, Move } from '../types/game';
import { checkWinner, getAvailableMoves, makeMove } from './gameLogic';

const MAX_DEPTH = 9;

export const minimax = (
  board: GameBoard, 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number = -Infinity, 
  beta: number = Infinity
): number => {
  const winner = checkWinner(board);
  
  // Terminal states
  if (winner === 'O') return 10 - depth; // AI wins (O)
  if (winner === 'X') return depth - 10; // Player wins (X)
  if (winner === 'tie' || depth >= MAX_DEPTH) return 0; // Tie or max depth

  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'O');
      const eval_ = minimax(newBoard, depth + 1, false, alpha, beta);
      maxEval = Math.max(maxEval, eval_);
      
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break; // Alpha-Beta pruning
    }
    
    return maxEval;
  } else {
    let minEval = Infinity;
    
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'X');
      const eval_ = minimax(newBoard, depth + 1, true, alpha, beta);
      minEval = Math.min(minEval, eval_);
      
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break; // Alpha-Beta pruning
    }
    
    return minEval;
  }
};

export const getBestMove = (board: GameBoard, difficulty: 'easy' | 'medium' | 'hard' = 'hard'): Move => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    throw new Error('No available moves');
  }

  // Add some randomness for lower difficulties
  if (difficulty === 'easy' && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return { index: availableMoves[randomIndex] };
  }
  
  if (difficulty === 'medium' && Math.random() < 0.15) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return { index: availableMoves[randomIndex] };
  }

  let bestMove: Move = { index: availableMoves[0], score: -Infinity };
  
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, 'O');
    const score = minimax(newBoard, 0, false);
    
    if (score > bestMove.score!) {
      bestMove = { index: move, score };
    }
  }
  
  return bestMove;
};

export const getRandomMove = (board: GameBoard): Move => {
  const availableMoves = getAvailableMoves(board);
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return { index: availableMoves[randomIndex] };
};