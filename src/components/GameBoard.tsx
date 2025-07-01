import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Cpu, User, Zap, Settings } from 'lucide-react';
import GameCell from './GameCell';
import { GameState, GameStats, Player } from '../types/game';
import { 
  createEmptyBoard, 
  checkWinner, 
  makeMove, 
  isValidMove,
  getWinningCombination 
} from '../utils/gameLogic';
import { getBestMove } from '../utils/minimax';

interface GameBoardProps {
  stats: GameStats;
  onStatsUpdate: (stats: GameStats) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ stats, onStatsUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false,
    gameMode: 'ai',
    difficulty: 'hard'
  });

  const [isThinking, setIsThinking] = useState(false);
  const [winningCells, setWinningCells] = useState<number[]>([]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false
    }));
    setWinningCells([]);
  }, []);

  const updateStats = useCallback((winner: Player | 'tie') => {
    const newStats = { ...stats };
    newStats.gamesPlayed += 1;
    
    if (winner === 'X') {
      newStats.playerWins += 1;
    } else if (winner === 'O') {
      newStats.aiWins += 1;
    } else if (winner === 'tie') {
      newStats.ties += 1;
    }
    
    onStatsUpdate(newStats);
  }, [stats, onStatsUpdate]);

  const handleCellClick = useCallback((index: number) => {
    if (!isValidMove(gameState.board, index) || gameState.isGameOver || gameState.currentPlayer !== 'X') {
      return;
    }

    const newBoard = makeMove(gameState.board, index, 'X');
    const winner = checkWinner(newBoard);
    
    if (winner) {
      const winningCombo = getWinningCombination(newBoard);
      setWinningCells(winningCombo || []);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        winner,
        isGameOver: true
      }));
      updateStats(winner);
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: 'O'
      }));
    }
  }, [gameState, updateStats]);

  const makeAIMove = useCallback(async () => {
    if (gameState.currentPlayer !== 'O' || gameState.isGameOver) {
      return;
    }

    setIsThinking(true);
    
    // Add a small delay to show thinking animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const bestMove = getBestMove(gameState.board, gameState.difficulty);
      const newBoard = makeMove(gameState.board, bestMove.index, 'O');
      const winner = checkWinner(newBoard);
      
      if (winner) {
        const winningCombo = getWinningCombination(newBoard);
        setWinningCells(winningCombo || []);
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          winner,
          isGameOver: true
        }));
        updateStats(winner);
      } else {
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 'X'
        }));
      }
    } catch (error) {
      console.error('AI move error:', error);
    } finally {
      setIsThinking(false);
    }
  }, [gameState, updateStats]);

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.isGameOver && gameState.gameMode === 'ai') {
      makeAIMove();
    }
  }, [gameState.currentPlayer, gameState.isGameOver, gameState.gameMode, makeAIMove]);

  const getGameStatusMessage = () => {
    if (isThinking) {
      return (
        <div className="flex items-center gap-2 text-purple-300">
          <Cpu className="w-5 h-5 animate-pulse" />
          <span>AI is thinking...</span>
        </div>
      );
    }
    
    if (gameState.winner === 'X') {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <User className="w-5 h-5" />
          <span>You Won! 🎉</span>
        </div>
      );
    }
    
    if (gameState.winner === 'O') {
      return (
        <div className="flex items-center gap-2 text-purple-400">
          <Cpu className="w-5 h-5" />
          <span>AI Wins! 🤖</span>
        </div>
      );
    }
    
    if (gameState.winner === 'tie') {
      return (
        <div className="flex items-center gap-2 text-orange-400">
          <Zap className="w-5 h-5" />
          <span>It's a Tie! 🤝</span>
        </div>
      );
    }
    
    if (gameState.currentPlayer === 'X') {
      return (
        <div className="flex items-center gap-2 text-blue-400">
          <User className="w-5 h-5" />
          <span>Your Turn (X)</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-purple-400">
        <Cpu className="w-5 h-5" />
        <span>AI's Turn (O)</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            Tic-Tac-Toe AI
          </h1>
          
          <div className="flex items-center gap-3">
            <select
              value={gameState.difficulty}
              onChange={(e) => setGameState(prev => ({ 
                ...prev, 
                difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
              }))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-sm"
              disabled={!gameState.isGameOver && gameState.board.some(cell => cell !== null)}
            >
              <option value="easy" className="bg-gray-800">Easy</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="hard" className="bg-gray-800">Hard</option>
            </select>
            
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 
                       text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg 
                       transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              New Game
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <div className="text-lg font-semibold">
              {getGameStatusMessage()}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-4 mb-8 aspect-square max-w-md mx-auto">
          {gameState.board.map((cell, index) => (
            <GameCell
              key={index}
              value={cell}
              onClick={() => handleCellClick(index)}
              isWinningCell={winningCells.includes(index)}
              isDisabled={gameState.isGameOver || gameState.currentPlayer !== 'X' || isThinking}
              index={index}
            />
          ))}
        </div>

        {/* Game Over Actions */}
        {gameState.isGameOver && (
          <div className="flex justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 
                       hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 
                       hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        )}

        {/* Difficulty Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Settings className="w-4 h-4" />
            <span>
              Playing against AI on {gameState.difficulty} difficulty
              {gameState.difficulty === 'hard' && ' (Unbeatable)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;