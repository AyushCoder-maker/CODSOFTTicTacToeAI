import React from 'react';
import { X, Circle } from 'lucide-react';
import { Player } from '../types/game';

interface GameCellProps {
  value: Player;
  onClick: () => void;
  isWinningCell: boolean;
  isDisabled: boolean;
  index: number;
}

const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  onClick, 
  isWinningCell, 
  isDisabled,
  index 
}) => {
  const getCellClasses = () => {
    let classes = `
      aspect-square bg-white/10 backdrop-blur-sm border-2 border-white/20 
      rounded-xl flex items-center justify-center cursor-pointer
      transition-all duration-300 ease-out hover:scale-105 hover:bg-white/20
      hover:border-white/40 hover:shadow-lg group relative overflow-hidden
    `;
    
    if (isWinningCell) {
      classes += ' bg-green-400/30 border-green-400/50 shadow-green-400/20 shadow-lg';
    }
    
    if (isDisabled) {
      classes += ' cursor-not-allowed opacity-75 hover:scale-100 hover:bg-white/10';
    }
    
    return classes;
  };

  const getIconClasses = () => {
    let classes = 'w-12 h-12 transition-all duration-300 ease-out group-hover:scale-110';
    
    if (value === 'X') {
      classes += ' text-blue-400 stroke-[3]';
    } else if (value === 'O') {
      classes += ' text-purple-400 stroke-[3]';
    }
    
    if (isWinningCell) {
      classes += ' scale-125';
    }
    
    return classes;
  };

  return (
    <div 
      className={getCellClasses()}
      onClick={!isDisabled ? onClick : undefined}
      role="button"
      tabIndex={!isDisabled ? 0 : -1}
      aria-label={`Cell ${index + 1}, ${value || 'empty'}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
          onClick();
        }
      }}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {value === 'X' && (
          <X 
            className={getIconClasses()}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {value === 'O' && (
          <Circle 
            className={getIconClasses()}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </div>
      
      {/* Ripple effect on click */}
      {!isDisabled && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-active:scale-150 transition-transform duration-200 ease-out" />
        </div>
      )}
    </div>
  );
};

export default GameCell;