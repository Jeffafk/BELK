
export type AppTab = 'home' | 'games' | 'moi' | 'mood' | 'profile';

export interface CoupleChallenge {
  title: string;
  description: string;
  category: 'play' | 'gratitude' | 'reflection';
}

export interface RelationshipQuest {
  title: string;
  description: string;
  category: string;
  isLdr: boolean;
}

export interface MoodEntry {
  user: 'You' | 'Partner';
  emoji: string;
  label: string;
  timestamp: string;
}

export interface Wallpaper {
  id: string;
  url: string;
  name: string;
}

export interface Song {
  title: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  type: 'meetup' | 'anniversary' | 'special';
}
