
import React from 'react';
import { Home, Gamepad2, Heart, Smile, User } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 px-6 py-3 pb-8 sm:pb-4 flex justify-between items-center z-40 max-w-[400px] mx-auto">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-rose-500 scale-110' : 'text-gray-400'}`}
      >
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button 
        onClick={() => onTabChange('games')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'games' ? 'text-rose-500 scale-110' : 'text-gray-400'}`}
      >
        <Gamepad2 size={22} />
        <span className="text-[10px] font-medium">Games</span>
      </button>
      <button 
        onClick={() => onTabChange('moi')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'moi' ? 'text-rose-500 scale-110' : 'text-gray-400'}`}
      >
        <Heart size={22} />
        <span className="text-[10px] font-medium">Moi</span>
      </button>
      <button 
        onClick={() => onTabChange('mood')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'mood' ? 'text-rose-500 scale-110' : 'text-gray-400'}`}
      >
        <Smile size={22} />
        <span className="text-[10px] font-medium">Mood</span>
      </button>
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-rose-500 scale-110' : 'text-gray-400'}`}
      >
        <User size={22} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};
