import { QuizQuestion, LiveGpInfo, HistoricalRace, ChampionRecord, JuniorSeriesRace } from '../types';
import { generateIntelligentDistractors } from './distractorGenerator';
import { F1_CONSTRUCTORS_CHAMPIONS } from '../data/f1HistoricalData';

// 1. Template: Chi ha vinto il GP di [Circuito/Nazione] nel [Anno]?
export function createGpWinnerQuestion(race: HistoricalRace, dynamicDrivers?: string[]): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: race.winner,
    year: race.year,
    category: 'F1',
    entityType: 'driver',
    dynamicPool: dynamicDrivers
  });

  return {
    id: `f1_winner_${race.year}_${race.round}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F1',
    year: race.year,
    templateId: 'gp_winner',
    question: `Chi ha vinto il ${race.raceName} (${race.circuitName}) nel ${race.year}?`,
    options,
    correctIndex,
    context: race.contextFact || `Vittoria conquistata da ${race.winner} su ${race.winnerTeam} nel Campionato Mondiale ${race.year}.`,
    tag: 'Vittoria Gran Premio'
  };
}

// 2. Template: Chi ha fatto la pole position a [Circuito/GP] nel [Anno]?
export function createPolePositionQuestion(race: HistoricalRace, dynamicDrivers?: string[]): QuizQuestion | null {
  if (!race.pole || race.pole.trim() === '') return null;

  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: race.pole,
    year: race.year,
    category: 'F1',
    entityType: 'driver',
    dynamicPool: dynamicDrivers
  });

  return {
    id: `f1_pole_${race.year}_${race.round}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F1',
    year: race.year,
    templateId: 'pole_position',
    question: `Chi ha conquistato la pole position nel ${race.raceName} del ${race.year}?`,
    options,
    correctIndex,
    context: `Nel ${race.year}, ${race.pole} segnò il giro più veloce nelle qualifiche del ${race.raceName} al volante della ${race.poleTeam || race.winnerTeam}.`,
    tag: 'Pole Position'
  };
}

// 3. Template: Chi ha vinto il Campionato Mondiale Piloti nel [Anno]?
export function createWorldChampionQuestion(champion: ChampionRecord, dynamicDrivers?: string[]): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: champion.driver,
    year: champion.year,
    category: 'F1',
    entityType: 'driver',
    dynamicPool: dynamicDrivers
  });

  return {
    id: `f1_champion_${champion.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F1',
    year: champion.year,
    templateId: 'world_champion',
    question: `Chi ha vinto il Campionato Mondiale Piloti di Formula 1 nel ${champion.year}?`,
    options,
    correctIndex,
    context: champion.contextFact || `${champion.driver} si è laureato Campione del Mondo nel ${champion.year} alla guida della ${champion.team}${champion.runnerUp ? `, precedendo in classifica ${champion.runnerUp}` : ''}.`,
    tag: 'Titolo Mondiale Piloti'
  };
}

// 4. Template: Quale pilota della [Scuderia] è arrivato a podio nel GP di [Nazione] [Anno]?
export function createPodiumTeamQuestion(race: HistoricalRace, dynamicDrivers?: string[]): QuizQuestion | null {
  if (!race.podium || race.podium.length === 0) return null;

  const winner = race.winner;
  const team = race.winnerTeam;

  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: winner,
    year: race.year,
    category: 'F1',
    entityType: 'driver',
    dynamicPool: dynamicDrivers
  });

  return {
    id: `f1_podium_${race.year}_${race.round}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F1',
    year: race.year,
    templateId: 'podium_team',
    question: `Quale pilota della ${team} è salito sul podio nel ${race.raceName} ${race.year}?`,
    options,
    correctIndex,
    context: `Nel ${race.year} al ${race.raceName}, ${winner} portò la ${team} sul gradino più alto del podio!`,
    tag: 'Piazzamento a Podio'
  };
}

// 5. Template: Quale scuderia ha vinto il Campionato Costruttori nel [Anno]?
export function createConstructorChampionQuestion(record: { year: number; team: string }): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: record.team,
    year: record.year,
    category: 'F1',
    entityType: 'constructor'
  });

  return {
    id: `f1_constructor_${record.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F1',
    year: record.year,
    templateId: 'constructor_champion',
    question: `Quale scuderia ha vinto il Campionato Mondiale Costruttori di Formula 1 nel ${record.year}?`,
    options,
    correctIndex,
    context: `La scuderia ${record.team} trionfò nella classifica costruttori della stagione ${record.year}.`,
    tag: 'Mondiale Costruttori'
  };
}

// 6. Template: Formula 2 Feature Race / Sprint Race winner
export function createF2RaceQuestion(race: JuniorSeriesRace): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: race.winner,
    year: race.year,
    category: 'F2',
    entityType: 'driver'
  });

  return {
    id: `f2_race_${race.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F2',
    year: race.year,
    templateId: 'f2_race_winner',
    question: `Chi ha vinto la ${race.raceType} di Formula 2 a ${race.circuit} nel ${race.year}?`,
    options,
    correctIndex,
    context: race.contextFact || `${race.winner} vinse la ${race.raceType} nel campionato F2 ${race.year} con il team ${race.team}.`,
    tag: 'Formula 2'
  };
}

// 7. Template: Formula 2 Champion
export function createF2ChampionQuestion(record: ChampionRecord): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: record.driver,
    year: record.year,
    category: 'F2',
    entityType: 'driver'
  });

  return {
    id: `f2_champion_${record.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F2',
    year: record.year,
    templateId: 'f2_champion',
    question: `Chi ha vinto il campionato di Formula 2 (o GP2 Series) nel ${record.year}?`,
    options,
    correctIndex,
    context: record.contextFact || `${record.driver} conquistò il titolo iridato in Formula 2 nel ${record.year} correndo per ${record.team}.`,
    tag: 'Campione Formula 2'
  };
}

// 8. Template: Formula 3 Champion
export function createF3ChampionQuestion(record: ChampionRecord): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: record.driver,
    year: record.year,
    category: 'F3',
    entityType: 'driver'
  });

  return {
    id: `f3_champion_${record.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F3',
    year: record.year,
    templateId: 'f3_champion',
    question: `Chi si è laureato Campione del Mondo di Formula 3 (o GP3 Series) nel ${record.year}?`,
    options,
    correctIndex,
    context: record.contextFact || `${record.driver} vinse il campionato di Formula 3 nel ${record.year} con il team ${record.team}.`,
    tag: 'Campione Formula 3'
  };
}

// 9. Template: Macau GP Formula 3
export function createMacauGpQuestion(race: JuniorSeriesRace): QuizQuestion {
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: race.winner,
    year: race.year,
    category: 'F3',
    entityType: 'driver'
  });

  return {
    id: `f3_macau_${race.year}_${Math.random().toString(36).substring(2, 6)}`,
    category: 'F3',
    year: race.year,
    templateId: 'macau_gp',
    question: `Quale pilota ha trionfato nel prestigioso Gran Premio di Macao di Formula 3 nel ${race.year}?`,
    options,
    correctIndex,
    context: race.contextFact || `${race.winner} trionfò sulle celebri e insidiose curve del circuito cittadino di Guia a Macao.`,
    tag: 'Formula 3 Macau GP'
  };
}

// 10. LIVE AUTO-UPDATED TEMPLATES (Directly connected to Live GP API)
export function createLiveRaceWinnerQuestion(liveGp: LiveGpInfo): QuizQuestion {
  const currentYear = parseInt(liveGp.season, 10);
  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: liveGp.winner.name,
    year: currentYear,
    category: 'F1',
    entityType: 'driver'
  });

  return {
    id: `live_winner_${liveGp.season}_${liveGp.round}`,
    category: 'F1',
    year: currentYear,
    templateId: 'live_last_race_winner',
    question: `Chi ha vinto l'ultimo Gran Premio disputato (${liveGp.raceName} ${liveGp.season})?`,
    options,
    correctIndex,
    context: `Dati Live API: ${liveGp.winner.name} (${liveGp.winner.constructorName}) ha trionfato nel ${liveGp.raceName} a ${liveGp.circuitName} in data ${liveGp.date}.`,
    tag: 'LIVE GP • Stagione in corso',
    isLiveAutoUpdated: true
  };
}

export function createLiveChampionshipLeaderQuestion(liveGp: LiveGpInfo): QuizQuestion | null {
  if (!liveGp.championshipLeader) return null;
  const currentYear = parseInt(liveGp.season, 10);

  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: liveGp.championshipLeader.driverName,
    year: currentYear,
    category: 'F1',
    entityType: 'driver'
  });

  return {
    id: `live_leader_${liveGp.season}`,
    category: 'F1',
    year: currentYear,
    templateId: 'live_champ_leader',
    question: `Chi è attualmente in testa alla classifica del Mondiale Piloti di Formula 1 (${liveGp.season})?`,
    options,
    correctIndex,
    context: `Dati Live API: ${liveGp.championshipLeader.driverName} guida la classifica con ${liveGp.championshipLeader.points} punti e ${liveGp.championshipLeader.wins} vittorie!`,
    tag: 'LIVE • Classifica Piloti',
    isLiveAutoUpdated: true
  };
}

export function createLivePodiumQuestion(liveGp: LiveGpInfo): QuizQuestion | null {
  if (!liveGp.podium || liveGp.podium.length < 2) return null;
  const p2 = liveGp.podium[1];
  const currentYear = parseInt(liveGp.season, 10);

  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: p2.name,
    year: currentYear,
    category: 'F1',
    entityType: 'driver'
  });

  return {
    id: `live_podium_p2_${liveGp.season}_${liveGp.round}`,
    category: 'F1',
    year: currentYear,
    templateId: 'live_p2_finisher',
    question: `Chi si è classificato 2° alle spalle del vincitore nel recente ${liveGp.raceName} (${liveGp.season})?`,
    options,
    correctIndex,
    context: `Nel ${liveGp.raceName}, ${p2.name} (${p2.constructorName}) ha conquistato il secondo gradino del podio dietro a ${liveGp.winner.name}.`,
    tag: 'LIVE GP • Podio',
    isLiveAutoUpdated: true
  };
}

export function createLiveConstructorLeaderQuestion(liveGp: LiveGpInfo): QuizQuestion | null {
  if (!liveGp.constructorLeader) return null;
  const currentYear = parseInt(liveGp.season, 10);

  const { options, correctIndex } = generateIntelligentDistractors({
    correctAnswer: liveGp.constructorLeader.constructorName,
    year: currentYear,
    category: 'F1',
    entityType: 'constructor'
  });

  return {
    id: `live_constructor_leader_${liveGp.season}`,
    category: 'F1',
    year: currentYear,
    templateId: 'live_constructor_leader',
    question: `Quale scuderia è attualmente al comando del Campionato Mondiale Costruttori di F1?`,
    options,
    correctIndex,
    context: `Dati Live API: ${liveGp.constructorLeader.constructorName} domina la classifica costruttori con ${liveGp.constructorLeader.points} punti.`,
    tag: 'LIVE • Classifica Costruttori',
    isLiveAutoUpdated: true
  };
}
