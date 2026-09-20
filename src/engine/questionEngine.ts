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
  if (era === '00s') return year >= 2000 && year <= 2013;
  if (era === 'hybrid') return year >= 2014 && year <= 2021;
  if (era === 'modern') return year >= 2022;
  return true;
}

interface GenerateQuizOptions {
  category: Category;
  era: Era;
  liveGp: LiveGpInfo | null;
  count?: number;
  excludeQuestions?: string[];
}

export async function generateQuizQuestions({
  category,
  era,
  liveGp,
  count = 10,
  excludeQuestions = []
}: GenerateQuizOptions): Promise<QuizQuestion[]> {
  const generated: QuizQuestion[] = [];
  const usedQuestionTitles = new Set<string>();
  const excludedSet = new Set(excludeQuestions);

  const canUseF1 = category === 'F1' || category === 'ALL';
  const canUseF2 = category === 'F2' || category === 'ALL';
  const canUseF3 = category === 'F3' || category === 'ALL';

  // -------------------------------------------------------------
  // STEP 1: Live Grand Prix Auto-Update Injection
  // Collect all available live questions and pick 1 (or at most 2 in modern era),
  // prioritizing live questions that haven't been seen recently in this session.
  // -------------------------------------------------------------
  if (canUseF1 && liveGp && (era === 'modern' || era === 'all')) {
    const liveQuestionsPool: QuizQuestion[] = [];

    const liveWinnerQ = createLiveRaceWinnerQuestion(liveGp);
    liveQuestionsPool.push(liveWinnerQ);

    const liveLeaderQ = createLiveChampionshipLeaderQuestion(liveGp);
    if (liveLeaderQ) {
      liveQuestionsPool.push(liveLeaderQ);
    }

    const livePodiumQ = createLivePodiumQuestion(liveGp);
    if (livePodiumQ) {
      liveQuestionsPool.push(livePodiumQ);
    }

    const liveConstructorQ = createLiveConstructorLeaderQuestion(liveGp);
    if (liveConstructorQ) {
      liveQuestionsPool.push(liveConstructorQ);
    }

    // Separate unseen live questions vs recently seen live questions
    const unseenLive = liveQuestionsPool.filter(q => !excludedSet.has(q.question));
    const poolToPickLive = unseenLive.length > 0 ? unseenLive : liveQuestionsPool;
    const shuffledLive = shuffleArray(poolToPickLive);

    // Limit live questions to 1 (or 2 with 40% probability in modern era)
    // to prevent every game from repeating the exact same 4 live questions.
    const maxLive = era === 'modern' ? (Math.random() < 0.4 ? 2 : 1) : 1;
    for (const q of shuffledLive) {
      if (generated.length >= maxLive) break;
      if (!usedQuestionTitles.has(q.question)) {
        generated.push(q);
        usedQuestionTitles.add(q.question);
      }
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
      else if (era === '00s') candidateYears = [2000, 2003, 2005, 2007, 2008, 2010, 2012];
      else if (era === 'hybrid') candidateYears = [2014, 2016, 2018, 2020, 2021];
      else if (era === 'modern') candidateYears = [2022, 2023, 2024];
      else candidateYears = [1995, 2002, 2008, 2012, 2016, 2021, 2024];

      const shuffledYears = shuffleArray(candidateYears);
      const randomYear = shuffledYears[0];
      const apiRaces = await getSeasonWinners(randomYear);

      if (apiRaces && apiRaces.length > 0) {
        const shuffledApiRaces = shuffleArray(apiRaces);
        for (const race of shuffledApiRaces) {
          const q = createGpWinnerQuestion(race);
          if (!usedQuestionTitles.has(q.question) && !excludedSet.has(q.question)) {
            generated.push(q);
            usedQuestionTitles.add(q.question);
            break;
          }
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

  // Separate pool into unseen questions (not recently played) and seen questions
  const unseenPool = pool.filter(q => !excludedSet.has(q.question));
  const seenPool = pool.filter(q => excludedSet.has(q.question));

  const shuffledUnseen = shuffleArray(unseenPool);
  const shuffledSeen = shuffleArray(seenPool);

  // First pass: fill up to count with fresh questions never seen in recent games
  for (const q of shuffledUnseen) {
    if (generated.length >= count) break;
    if (!usedQuestionTitles.has(q.question)) {
      generated.push(q);
      usedQuestionTitles.add(q.question);
    }
  }

  // Second pass: fallback to seen questions if pool was smaller than count
  if (generated.length < count) {
    for (const q of shuffledSeen) {
      if (generated.length >= count) break;
      if (!usedQuestionTitles.has(q.question)) {
        generated.push(q);
        usedQuestionTitles.add(q.question);
      }
    }
  }

  // -------------------------------------------------------------
  // STEP 4: Complete Randomization of Final Question Order
  // Randomizes the entire questions array so live/API questions
  // are never always in the first slots, giving a fresh order every race.
  // -------------------------------------------------------------
  return shuffleArray(generated).slice(0, count);
}
