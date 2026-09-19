export type Category = 'F1' | 'F2' | 'F3' | 'ALL';

export type Era = '90s' | '00s' | 'hybrid' | 'modern' | 'all';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  category: 'F1' | 'F2' | 'F3';
  year: number;
  templateId: string;
  question: string;
  options: string[];
  correctIndex: number;
  context: string; // Historical explanation or telemetry trivia
  tag: string; // e.g. "Vittoria GP", "Pole Position", "Mondiale Piloti", "Gara Sprint"
  isLiveAutoUpdated?: boolean;
}

export interface PlayerAnswer {
  questionIndex: number;
  question: QuizQuestion;
  selectedIndex: number;
  isCorrect: boolean;
  timeRemaining: number;
  timeTaken: number;
  pointsEarned: number;
}

export interface LiveGpInfo {
  season: string;
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  date: string;
  winner: {
    name: string;
    code?: string;
    constructorName: string;
  };
  polePosition?: {
    name: string;
    constructorName?: string;
  };
  podium: Array<{
    position: number;
    name: string;
    constructorName: string;
  }>;
  championshipLeader?: {
    driverName: string;
    points: string;
    wins: string;
    constructorName?: string;
  };
  constructorLeader?: {
    constructorName: string;
    points: string;
  };
  updatedAt: string;
}

export interface DriverProfile {
  name: string;
  nationality?: string;
  primaryTeam?: string;
  era: Era[];
  years: number[];
  category: 'F1' | 'F2' | 'F3';
}

export interface HistoricalRace {
  year: number;
  round: number;
  raceName: string;
  circuitName: string;
  country: string;
  winner: string;
  winnerTeam: string;
  pole: string;
  poleTeam: string;
  podium: string[];
  contextFact: string;
}

export interface ChampionRecord {
  year: number;
  category: 'F1' | 'F2' | 'F3';
  driver: string;
  team: string;
  runnerUp?: string;
  wins?: number;
  contextFact?: string;
}

export interface JuniorSeriesRace {
  year: number;
  category: 'F2' | 'F3';
  event: string;
  circuit: string;
  raceType: 'Feature Race' | 'Sprint Race' | 'Macau GP';
  winner: string;
  team: string;
  podium: string[];
  contextFact: string;
}

export type ScreenState = 'HOME' | 'LOADING' | 'PLAYING' | 'SUMMARY';

export interface GameStats {
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  averageTime: number;
  maxStreak: number;
  superlicenseTitle: string;
  superlicenseRank: string;
  superlicenseColor: string;
}
