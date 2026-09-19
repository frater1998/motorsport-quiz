import { GameStats, PlayerAnswer } from '../types';

export function calculatePoints(timeRemaining: number, combo: number): number {
  const basePoints = 500;
  // Speed bonus: up to 500 extra points for fast answer
  const speedBonus = Math.round((timeRemaining / 15) * 500);
  // Combo multiplier: starts at 1.0, increases by 0.2 per streak up to 2.5x
  const multiplier = Math.min(2.5, 1.0 + (combo - 1) * 0.25);
  return Math.round((basePoints + speedBonus) * multiplier);
}

export function computeGameStats(answers: PlayerAnswer[], totalScore: number, maxStreak: number): GameStats {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length || 10;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const totalTimeTaken = answers.reduce((acc, a) => acc + a.timeTaken, 0);
  const averageTime = answers.length > 0 ? parseFloat((totalTimeTaken / answers.length).toFixed(1)) : 0;

  let superlicenseTitle = '';
  let superlicenseRank = '';
  let superlicenseColor = '';

  if (totalScore >= 9500) {
    superlicenseTitle = 'LEGGENDA FORMULA 1';
    superlicenseRank = 'Campione del Mondo • Superlicenza Diamante';
    superlicenseColor = 'from-amber-400 to-yellow-600 text-amber-300';
  } else if (totalScore >= 7500) {
    superlicenseTitle = 'PILOTA TOP TEAM F1';
    superlicenseRank = 'Vincitore di Gran Premio • Superlicenza Oro';
    superlicenseColor = 'from-emerald-400 to-teal-600 text-emerald-300';
  } else if (totalScore >= 5500) {
    superlicenseTitle = 'PILOTA TITOLARE F1';
    superlicenseRank = 'Zona Punti • Superlicenza FIA';
    superlicenseColor = 'from-blue-400 to-cyan-600 text-blue-300';
  } else if (totalScore >= 3500) {
    superlicenseTitle = 'CAMPIONE FORMULA 2';
    superlicenseRank = 'Rookie Promettente • FIA Academy';
    superlicenseColor = 'from-purple-400 to-indigo-600 text-purple-300';
  } else {
    superlicenseTitle = 'TEST DRIVER AL SIMULATORE';
    superlicenseRank = 'Ritiro al 1° Giro • Necessita Allenamento';
    superlicenseColor = 'from-rose-500 to-red-700 text-rose-400';
  }

  return {
    totalScore,
    correctCount,
    totalQuestions,
    accuracy,
    averageTime,
    maxStreak,
    superlicenseTitle,
    superlicenseRank,
    superlicenseColor
  };
}
