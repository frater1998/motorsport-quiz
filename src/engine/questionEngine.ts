import { Category, Era, QuizQuestion, LiveGpInfo, HistoricalRace, ChampionRecord } from '../types';
import { F1_CHAMPIONS, F1_CONSTRUCTORS_CHAMPIONS, ICONIC_F1_RACES } from '../data/f1HistoricalData';
import { F2_CHAMPIONS, ICONIC_F2_RACES } from '../data/f2HistoricalData';
import { F3_CHAMPIONS, MACAU_GP_RACES } from '../data/f3HistoricalData';
import {
  createGpWinnerQuestion,
  createPolePositionQuestion,
  createWorldChampionQuestion,
  createPodiumTeamQuestion,
  createConstructorChampionQuestion,
  createF2RaceQuestion,
  createF2ChampionQuestion,
  createF3ChampionQuestion,
  createMacauGpQuestion,
  createLiveRaceWinnerQuestion,
  createLiveChampionshipLeaderQuestion,
  createLivePodiumQuestion,
  createLiveConstructorLeaderQuestion
} from './templates';
import { shuffleArray } from './distractorGenerator';
import { getSeasonWinners } from '../api/motorsportApi';

function isYearInEra(year: number, era: Era): boolean {
  if (era === 'all') return true;
  if (era === '90s') return year >= 1990 && year <= 1999;
  if (era === '00s') return year >= 2000 && year <= 2009;
  if (era === 'hybrid') return year >= 2014 && year <= 2021;
  if (era === 'modern') return year >= 2022;
  return true;
}

interface GenerateQuizOptions {
  category: Category;
  era: Era;
  liveGp: LiveGpInfo | null;
  count?: number;
}

export async function generateQuizQuestions({
  category,
  era,
  liveGp,
  count = 10
}: GenerateQuizOptions): Promise<QuizQuestion[]> {
  const generated: QuizQuestion[] = [];
  const usedQuestionTitles = new Set<string>();

  const canUseF1 = category === 'F1' || category === 'ALL';
  const canUseF2 = category === 'F2' || category === 'ALL';
  const canUseF3 = category === 'F3' || category === 'ALL';

  // -------------------------------------------------------------
  // STEP 1: Live Grand Prix Auto-Update Injection
  // If modern era or all history, and we have live GP info, inject live questions!
  // -------------------------------------------------------------
  if (canUseF1 && liveGp && (era === 'modern' || era === 'all')) {
    const liveWinnerQ = createLiveRaceWinnerQuestion(liveGp);
    generated.push(liveWinnerQ);
    usedQuestionTitles.add(liveWinnerQ.question);

    const liveLeaderQ = createLiveChampionshipLeaderQuestion(liveGp);
    if (liveLeaderQ && Math.random() > 0.3) {
      generated.push(liveLeaderQ);
      usedQuestionTitles.add(liveLeaderQ.question);
    }

    const livePodiumQ = createLivePodiumQuestion(liveGp);
    if (livePodiumQ && Math.random() > 0.5) {
      generated.push(livePodiumQ);
      usedQuestionTitles.add(livePodiumQ.question);
    }

    const liveConstructorQ = createLiveConstructorLeaderQuestion(liveGp);
    if (liveConstructorQ && Math.random() > 0.5) {
      generated.push(liveConstructorQ);
      usedQuestionTitles.add(liveConstructorQ.question);
    }
  }

  // -------------------------------------------------------------
  // STEP 2: Optional Dynamic API Fetch for additional fresh questions
  // Fetch race winners for a random year matching the chosen era
  // -------------------------------------------------------------
  if (canUseF1 && generated.length < count) {
    try {
      let candidateYears: number[] = [];
      if (era === '90s') candidateYears = [1991, 1994, 1997, 1998, 1999];
      else if (era === '00s') candidateYears = [2000, 2003, 2005, 2007, 2008];
      else if (era === 'hybrid') candidateYears = [2014, 2016, 2018, 2020, 2021];
      else if (era === 'modern') candidateYears = [2022, 2023, 2024];
      else candidateYears = [1995, 2002, 2008, 2016, 2021, 2024];

      const randomYear = candidateYears[Math.floor(Math.random() * candidateYears.length)];
      const apiRaces = await getSeasonWinners(randomYear);

      if (apiRaces && apiRaces.length > 0) {
        const randomRace = apiRaces[Math.floor(Math.random() * apiRaces.length)];
        const q = createGpWinnerQuestion(randomRace);
        if (!usedQuestionTitles.has(q.question)) {
          generated.push(q);
          usedQuestionTitles.add(q.question);
        }
      }
    } catch {
      // Graceful fallback to static database
    }
  }

  // -------------------------------------------------------------
  // STEP 3: Procedural Generator from Curated Datasets
  // -------------------------------------------------------------
  const pool: QuizQuestion[] = [];

  // F1 Questions
  if (canUseF1) {
    // 1. World Champions
    const validF1Champions = F1_CHAMPIONS.filter(c => isYearInEra(c.year, era));
    validF1Champions.forEach(champ => {
      pool.push(createWorldChampionQuestion(champ));
    });

    // 2. Constructors Champions
    const validConstructors = F1_CONSTRUCTORS_CHAMPIONS.filter(c => isYearInEra(c.year, era));
    validConstructors.forEach(record => {
      pool.push(createConstructorChampionQuestion(record));
    });

    // 3. Iconic Races & Poles & Podiums
    const validRaces = ICONIC_F1_RACES.filter(r => isYearInEra(r.year, era));
    validRaces.forEach((race: HistoricalRace) => {
      pool.push(createGpWinnerQuestion(race));

      const poleQ = createPolePositionQuestion(race);
      if (poleQ) pool.push(poleQ);

      const podiumQ = createPodiumTeamQuestion(race);
      if (podiumQ) pool.push(podiumQ);
    });
  }

  // F2 Questions
  if (canUseF2) {
    const validF2Champions = F2_CHAMPIONS.filter(c => isYearInEra(c.year, era));
    validF2Champions.forEach((champ: ChampionRecord) => {
      pool.push(createF2ChampionQuestion(champ));
    });

    const validF2Races = ICONIC_F2_RACES.filter(r => isYearInEra(r.year, era));
    validF2Races.forEach(race => {
      pool.push(createF2RaceQuestion(race));
    });
  }

  // F3 Questions
  if (canUseF3) {
    const validF3Champions = F3_CHAMPIONS.filter(c => isYearInEra(c.year, era));
    validF3Champions.forEach((champ: ChampionRecord) => {
      pool.push(createF3ChampionQuestion(champ));
    });

    const validMacau = MACAU_GP_RACES.filter(r => isYearInEra(r.year, era));
    validMacau.forEach(race => {
      pool.push(createMacauGpQuestion(race));
    });
  }

  // Shuffle pool
  const shuffledPool = shuffleArray(pool);

  // Fill up to count
  for (const q of shuffledPool) {
    if (generated.length >= count) break;
    if (!usedQuestionTitles.has(q.question)) {
      generated.push(q);
      usedQuestionTitles.add(q.question);
    }
  }

  // Return exactly count items (or as many as available)
  return generated.slice(0, count);
}
