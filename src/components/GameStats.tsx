import React from 'react';
import { Trophy, Target, Users, BarChart3 } from 'lucide-react';
import { GameStats as GameStatsType } from '../types/game';

interface GameStatsProps {
  stats: GameStatsType;
  onReset: () => void;
}

const GameStats: React.FC<GameStatsProps> = ({ stats, onReset }) => {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.playerWins / stats.gamesPlayed) * 100) 
    : 0;

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Game Statistics
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 
                   border border-red-500/30 rounded-lg transition-all duration-300 
                   hover:scale-105 hover:shadow-lg font-medium"
        >
          Reset Stats
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="w-5 h-5 text-blue-300" />}
          label="Your Wins"
          value={stats.playerWins}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-purple-300" />}
          label="AI Wins"
          value={stats.aiWins}
          color="bg-purple-500/20"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-green-300" />}
          label="Ties"
          value={stats.ties}
          color="bg-green-500/20"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-orange-300" />}
          label="Win Rate"
          value={winRate}
          color="bg-orange-500/20"
        />
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Total Games Played</span>
            <span className="text-white font-bold">{stats.gamesPlayed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Win Rate</span>
            <span className="text-white font-bold">{winRate}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;