import React from 'react';
import GameBoard from './components/GameBoard';
import GameStats from './components/GameStats';
import { GameStats as GameStatsType } from './types/game';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [stats, setStats] = useLocalStorage<GameStatsType>('tic-tac-toe-stats', {
    playerWins: 0,
    aiWins: 0,
    ties: 0,
    gamesPlayed: 0
  });

  const resetStats = () => {
    setStats({
      playerWins: 0,
      aiWins: 0,
      ties: 0,
      gamesPlayed: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Game Board */}
          <div className="flex justify-center">
            <GameBoard stats={stats} onStatsUpdate={setStats} />
          </div>

          {/* Statistics */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-2xl">
              <GameStats stats={stats} onReset={resetStats} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/50 text-sm">
          <p>Powered by Minimax Algorithm with Alpha-Beta Pruning</p>
          <p className="mt-1">Challenge the unbeatable AI 🤖</p>
        </footer>
      </div>
    </div>
  );
}

export default App;