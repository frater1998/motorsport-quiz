import { LiveGpInfo, HistoricalRace } from '../types';
import { apiCache } from './cache';

const PRIMARY_API = 'https://api.jolpi.ca/ergast/f1';
const BACKUP_API = 'https://ergast.com/api/f1';
const REQUEST_TIMEOUT_MS = 5000;

// Grand Prix Name Italian Localizer
export function translateGrandPrixName(rawName: string): string {
  if (!rawName) return 'Gran Premio';
  const clean = rawName.trim();
  const map: Record<string, string> = {
    'Australian Grand Prix': 'Gran Premio d\'Australia',
    'Malaysian Grand Prix': 'Gran Premio della Malesia',
    'Chinese Grand Prix': 'Gran Premio della Cina',
    'Bahrain Grand Prix': 'Gran Premio del Bahrain',
    'Spanish Grand Prix': 'Gran Premio di Spagna',
    'Monaco Grand Prix': 'Gran Premio di Monaco',
    'Canadian Grand Prix': 'Gran Premio del Canada',
    'Austrian Grand Prix': 'Gran Premio d\'Austria',
    'British Grand Prix': 'Gran Premio di Gran Bretagna',
    'Hungarian Grand Prix': 'Gran Premio d\'Ungheria',
    'Belgian Grand Prix': 'Gran Premio del Belgio',
    'Italian Grand Prix': 'Gran Premio d\'Italia',
    'Singapore Grand Prix': 'Gran Premio di Singapore',
    'Japanese Grand Prix': 'Gran Premio del Giappone',
    'United States Grand Prix': 'Gran Premio degli Stati Uniti',
    'Mexican Grand Prix': 'Gran Premio del Messico',
    'Mexico City Grand Prix': 'Gran Premio di Città del Messico',
    'Brazilian Grand Prix': 'Gran Premio del Brasile',
    'São Paulo Grand Prix': 'Gran Premio di San Paolo',
    'Abu Dhabi Grand Prix': 'Gran Premio di Abu Dhabi',
    'Saudi Arabian Grand Prix': 'Gran Premio dell\'Arabia Saudita',
    'Miami Grand Prix': 'Gran Premio di Miami',
    'Las Vegas Grand Prix': 'Gran Premio di Las Vegas',
    'Emilia Romagna Grand Prix': 'Gran Premio dell\'Emilia-Romagna (Imola)',
    'Dutch Grand Prix': 'Gran Premio d\'Olanda',
    'Azerbaijan Grand Prix': 'Gran Premio dell\'Azerbaigian',
    'Qatar Grand Prix': 'Gran Premio del Qatar',
    'German Grand Prix': 'Gran Premio di Germania',
    'European Grand Prix': 'Gran Premio d\'Europa',
    'French Grand Prix': 'Gran Premio di Francia',
    'San Marino Grand Prix': 'Gran Premio di San Marino',
    'Turkish Grand Prix': 'Gran Premio di Turchia',
    'Russian Grand Prix': 'Gran Premio di Russia',
    'Portuguese Grand Prix': 'Gran Premio del Portogallo'
  };

  return map[clean] || (clean.toLowerCase().includes('grand prix') ? clean.replace('Grand Prix', 'Gran Premio') : `Gran Premio ${clean}`);
}

// Fetch with timeout and primary/backup fallback
async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  const urls = [`${PRIMARY_API}/${endpoint}`, `${BACKUP_API}/${endpoint}`];

  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json as T;
      }
    } catch {
      clearTimeout(timeoutId);
      // Try next url
    }
  }

  return null;
}

// 1. Fetch Latest Completed Grand Prix Results
export async function getLatestF1Race(): Promise<LiveGpInfo | null> {
  const cacheKey = 'latest_f1_race';
  const cached = apiCache.get<LiveGpInfo>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchFromApi<any>('current/last/results.json');
    if (!data?.MRData?.RaceTable?.Races?.length) {
      return null;
    }

    const race = data.MRData.RaceTable.Races[0];
    const results = race.Results || [];
    const winnerResult = results[0];

    const podium = results.slice(0, 3).map((r: { position: string; Driver: { givenName: string; familyName: string }; Constructor: { name: string } }) => ({
      position: parseInt(r.position, 10),
      name: `${r.Driver.givenName} ${r.Driver.familyName}`,
      constructorName: r.Constructor.name
    }));

    // Also try to fetch current driver leader
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standingsData = await fetchFromApi<any>('current/driverStandings.json');
    let champLeader = undefined;
    if (standingsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      const leader = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
      champLeader = {
        driverName: `${leader.Driver.givenName} ${leader.Driver.familyName}`,
        points: leader.points,
        wins: leader.wins,
        constructorName: leader.Constructors?.[0]?.name
      };
    }

    // Also fetch constructor leader
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructorData = await fetchFromApi<any>('current/constructorStandings.json');
    let constructorLeader = undefined;
    if (constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0]) {
      const cLeader = constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];
      constructorLeader = {
        constructorName: cLeader.Constructor.name,
        points: cLeader.points
      };
    }

    const liveGpInfo: LiveGpInfo = {
      season: race.season,
      round: race.round,
      raceName: translateGrandPrixName(race.raceName),
      circuitName: race.Circuit?.circuitName || 'Circuito',
      country: race.Circuit?.Location?.country || 'Internazionale',
      date: race.date,
      winner: {
        name: winnerResult ? `${winnerResult.Driver.givenName} ${winnerResult.Driver.familyName}` : 'N/D',
        code: winnerResult?.Driver?.code,
        constructorName: winnerResult?.Constructor?.name || 'N/D'
      },
      podium,
      championshipLeader: champLeader,
      constructorLeader,
      updatedAt: new Date().toISOString()
    };

    // Cache for 15 minutes
    apiCache.set(cacheKey, liveGpInfo, 1000 * 60 * 15);
    return liveGpInfo;
  } catch (err) {
    console.warn('Could not fetch latest live GP:', err);
    return null;
  }
}

// 2. Fetch Season Race Winners for a given year
export async function getSeasonWinners(year: number): Promise<HistoricalRace[]> {
  const cacheKey = `season_winners_${year}`;
  const cached = apiCache.get<HistoricalRace[]>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchFromApi<any>(`${year}/results/1.json?limit=35`);
    if (!data?.MRData?.RaceTable?.Races?.length) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const races: HistoricalRace[] = data.MRData.RaceTable.Races.map((r: any) => {
      const res = r.Results?.[0];
      return {
        year,
        round: parseInt(r.round, 10),
        raceName: translateGrandPrixName(r.raceName),
        circuitName: r.Circuit?.circuitName || 'Circuito',
        country: r.Circuit?.Location?.country || '',
        winner: res?.Driver ? `${res.Driver.givenName} ${res.Driver.familyName}` : 'N/D',
        winnerTeam: res?.Constructor?.name || 'N/D',
        pole: '', // will be populated or handled in template
        poleTeam: '',
        podium: res?.Driver ? [`${res.Driver.givenName} ${res.Driver.familyName}`] : [],
        contextFact: `Vittoria nel Gran Premio del ${year} a bordo della ${res?.Constructor?.name || 'monoposto'}.`
      };
    });

    // Cache permanently for completed seasons, 15m for current
    const isCurrent = year >= new Date().getFullYear();
    apiCache.set(cacheKey, races, isCurrent ? 1000 * 60 * 15 : 1000 * 60 * 60 * 24 * 7);
    return races;
  } catch {
    return [];
  }
}

// 3. Fetch Season Driver Standings (provides driver pool for intelligent distractors)
export async function getSeasonDrivers(year: number): Promise<Array<{ name: string; team: string; points: number }>> {
  const cacheKey = `season_drivers_${year}`;
  const cached = apiCache.get<Array<{ name: string; team: string; points: number }>>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchFromApi<any>(`${year}/driverStandings.json?limit=40`);
    const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
    if (!list || !list.length) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drivers = list.map((item: any) => ({
      name: `${item.Driver.givenName} ${item.Driver.familyName}`,
      team: item.Constructors?.[0]?.name || 'F1 Team',
      points: parseFloat(item.points || '0')
    }));

    const isCurrent = year >= new Date().getFullYear();
    apiCache.set(cacheKey, drivers, isCurrent ? 1000 * 60 * 15 : 1000 * 60 * 60 * 24 * 7);
    return drivers;
  } catch {
    return [];
  }
}

// 4. Fetch Season Pole Positions
export async function getSeasonPoles(year: number): Promise<Array<{ raceName: string; circuitName: string; poleDriver: string; team: string }>> {
  const cacheKey = `season_poles_${year}`;
  const cached = apiCache.get<Array<{ raceName: string; circuitName: string; poleDriver: string; team: string }>>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchFromApi<any>(`${year}/qualifying/1.json?limit=35`);
    const races = data?.MRData?.RaceTable?.Races;
    if (!races || !races.length) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const poles = races.map((r: any) => {
      const q = r.QualifyingResults?.[0];
      return {
        raceName: translateGrandPrixName(r.raceName),
        circuitName: r.Circuit?.circuitName || 'Circuito',
        poleDriver: q?.Driver ? `${q.Driver.givenName} ${q.Driver.familyName}` : '',
        team: q?.Constructor?.name || ''
      };
    }).filter((p: { poleDriver: string }) => Boolean(p.poleDriver));

    const isCurrent = year >= new Date().getFullYear();
    apiCache.set(cacheKey, poles, isCurrent ? 1000 * 60 * 15 : 1000 * 60 * 60 * 24 * 7);
    return poles;
  } catch {
    return [];
  }
}
