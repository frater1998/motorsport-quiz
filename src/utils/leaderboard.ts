import { LeaderboardEntry, Category, Era } from '../types';

const LEADERBOARD_STORAGE_KEY = 'motorsport_quiz_leaderboard_v1';
const PLAYER_NAME_STORAGE_KEY = 'motorsport_quiz_last_player_name';

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const list: LeaderboardEntry[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    // Sort by totalScore desc, then accuracy desc, then date desc
    return list.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (err) {
    console.warn('Errore lettura classifica da localStorage:', err);
    return [];
  }
}

export function saveScoreToLeaderboard(
  entryData: Omit<LeaderboardEntry, 'id' | 'date'>
): LeaderboardEntry {
  const newEntry: LeaderboardEntry = {
    ...entryData,
    id: `lb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toISOString()
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const current = getLeaderboard();
      const updated = [newEntry, ...current];
      // Keep up to top 100 entries to prevent localStorage bloat
      const trimmed = updated
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 100);

      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('Errore salvataggio classifica in localStorage:', err);
    }
  }

  return newEntry;
}

export function clearLeaderboard(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export function getLastPlayerName(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }

  try {
    return localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setLastPlayerName(name: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name.trim());
  } catch {
    // Ignore
  }
}

export function formatLeaderboardDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

export function getCategoryBadgeLabel(cat: Category): string {
  switch (cat) {
    case 'F1':
      return 'F1';
    case 'F2':
      return 'F2';
    case 'F3':
      return 'F3';
    case 'ALL':
      return 'Misto F1/F2/F3';
    default:
      return cat;
  }
}

export function getEraBadgeLabel(era: Era): string {
  switch (era) {
    case '90s':
      return "Anni '90";
    case '00s':
      return '2000-2013';
    case 'hybrid':
      return 'Turbo-Ibrido';
    case 'modern':
      return 'Nuova Era';
    case 'all':
      return 'Tutta la Storia';
    default:
      return era;
  }
}
