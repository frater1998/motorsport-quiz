import { Era } from '../types';
import { F1_DRIVERS_POOL, F1_CONSTRUCTORS_POOL } from '../data/f1HistoricalData';
import { F2_DRIVERS_ROSTER } from '../data/f2HistoricalData';
import { F3_DRIVERS_ROSTER } from '../data/f3HistoricalData';

// Map any year to its motorsport era
export function getEraForYear(year: number): Era {
  if (year >= 1990 && year <= 1999) return '90s';
  if (year >= 2000 && year <= 2009) return '00s';
  if (year >= 2014 && year <= 2021) return 'hybrid';
  if (year >= 2022) return 'modern';
  // 2010 - 2013 fits nicely in 00s/hybrid transition
  if (year >= 2010 && year <= 2013) return '00s';
  return 'all';
}

// Fisher-Yates Shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface DistractorOptions {
  correctAnswer: string;
  year: number;
  category: 'F1' | 'F2' | 'F3';
  entityType: 'driver' | 'constructor' | 'circuit';
  dynamicPool?: string[]; // Live API-fetched drivers for that exact year
}

/**
 * Intelligent Distractor Generator
 * Guarantees that distractors are temporally coherent with the question year and category.
 * A 1998 question will NEVER have 2024 drivers!
 */
export function generateIntelligentDistractors({
  correctAnswer,
  year,
  category,
  entityType,
  dynamicPool
}: DistractorOptions): { options: string[]; correctIndex: number } {
  const chosenEra = getEraForYear(year);
  let candidatePool: string[] = [];

  // ==========================================
  // 1. CONSTRUCTORS
  // ==========================================
  if (entityType === 'constructor') {
    // Find constructors active in that year or era
    const eraConstructors = F1_CONSTRUCTORS_POOL.filter(c => {
      const activeInYear = year >= c.years[0] && year <= c.years[1];
      const activeInEra = c.era.includes(chosenEra);
      return activeInYear || activeInEra;
    }).map(c => c.name);

    candidatePool = eraConstructors;
  }

  // ==========================================
  // 2. F2 DRIVERS
  // ==========================================
  else if (category === 'F2') {
    let eraKey = '2021-2026';
    if (year <= 2010) eraKey = '2005-2010';
    else if (year <= 2016) eraKey = '2011-2016';
    else if (year <= 2020) eraKey = '2017-2020';

    candidatePool = F2_DRIVERS_ROSTER[eraKey] || F2_DRIVERS_ROSTER['2021-2026'];
  }

  // ==========================================
  // 3. F3 DRIVERS
  // ==========================================
  else if (category === 'F3') {
    const eraKey = year <= 2018 ? 'historical' : 'modern';
    candidatePool = F3_DRIVERS_ROSTER[eraKey] || F3_DRIVERS_ROSTER['modern'];
  }

  // ==========================================
  // 4. F1 DRIVERS (Primary Logic)
  // ==========================================
  else {
    // A. If dynamic live pool from API is available for this exact year, use it!
    if (dynamicPool && dynamicPool.length >= 4) {
      candidatePool = dynamicPool;
    } else {
      // B. Exact year matching: drivers active in that exact year
      const exactYearDrivers = F1_DRIVERS_POOL.filter(d => d.years.includes(year)).map(d => d.name);

      if (exactYearDrivers.length >= 4) {
        candidatePool = exactYearDrivers;
      } else {
        // C. Era matching: drivers active in the same era
        const eraDrivers = F1_DRIVERS_POOL.filter(d => d.era.includes(chosenEra)).map(d => d.name);
        candidatePool = eraDrivers;
      }
    }
  }

  // Filter out the correct answer and remove duplicates
  const filteredCandidates = Array.from(new Set(candidatePool))
    .filter(c => c.trim().toLowerCase() !== correctAnswer.trim().toLowerCase());

  // Shuffle candidates
  const shuffledCandidates = shuffleArray(filteredCandidates);

  // Take top 3 distractors
  let distractors = shuffledCandidates.slice(0, 3);

  // Safety fallback if not enough candidates (e.g. obscure year)
  if (distractors.length < 3) {
    const backupPool = F1_DRIVERS_POOL
      .filter(d => d.name.toLowerCase() !== correctAnswer.toLowerCase())
      .map(d => d.name);
    for (const d of shuffleArray(backupPool)) {
      if (!distractors.includes(d) && d.toLowerCase() !== correctAnswer.toLowerCase()) {
        distractors.push(d);
        if (distractors.length === 3) break;
      }
    }
  }

  // Assemble final 4 options
  const finalOptions = shuffleArray([correctAnswer, ...distractors]);
  const correctIndex = finalOptions.indexOf(correctAnswer);

  return {
    options: finalOptions,
    correctIndex
  };
}
