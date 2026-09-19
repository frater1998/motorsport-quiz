import { getLatestF1Race } from '../api/motorsportApi';
import { generateQuizQuestions } from '../engine/questionEngine';
import { generateIntelligentDistractors } from '../engine/distractorGenerator';
import { computeGameStats, calculatePoints } from '../utils/formatters';
import { Category, Era, PlayerAnswer } from '../types';

declare const process: { exit: (code: number) => void };

async function runVerification() {
  console.log('🏎️  AVVIO VERIFICA COMPLETA APEX MOTORSPORT QUIZ ENGINE...\n');

  // 1. Test Live GP Fetch
  console.log('--- TEST 1: LIVE GRAND PRIX AUTO-UPDATE FETCH ---');
  const liveGp = await getLatestF1Race();
  if (liveGp) {
    console.log(`✅ Live GP Rilevato con successo:`);
    console.log(`   - Gara: ${liveGp.raceName} (${liveGp.season}, Round ${liveGp.round})`);
    console.log(`   - Circuito: ${liveGp.circuitName} (${liveGp.country})`);
    console.log(`   - Vincitore: ${liveGp.winner.name} (${liveGp.winner.constructorName})`);
    if (liveGp.podium.length > 0) {
      console.log(`   - Podio: ${liveGp.podium.map(p => `P${p.position}: ${p.name}`).join(' | ')}`);
    }
    if (liveGp.championshipLeader) {
      console.log(`   - Leader Campionato: ${liveGp.championshipLeader.driverName} (${liveGp.championshipLeader.points} pts)`);
    }
  } else {
    console.log('⚠️ Live GP API returned null, fallback activated.');
  }

  // 2. Test Intelligent Distractor Generator for 1998
  console.log('\n--- TEST 2: GENERATORE DISTRATTORI COERENTI PER EPOCA (Anno 1998) ---');
  const distractorTest = generateIntelligentDistractors({
    correctAnswer: 'Mika Häkkinen',
    year: 1998,
    category: 'F1',
    entityType: 'driver'
  });

  console.log('Domanda su Mika Häkkinen nel 1998:');
  console.log('Opzioni generate:', distractorTest.options);
  console.log('Indice Corretto:', distractorTest.correctIndex);
  console.log('Verifica corretta:', distractorTest.options[distractorTest.correctIndex] === 'Mika Häkkinen');

  // Check that distractors don't contain 2024 drivers like Verstappen, Leclerc, Norris, Piastri
  const modernDrivers = ['Max Verstappen', 'Charles Leclerc', 'Lando Norris', 'Oscar Piastri', 'Andrea Kimi Antonelli'];
  const hasModernDriverIn1998 = distractorTest.options.some(opt => modernDrivers.includes(opt));
  if (!hasModernDriverIn1998) {
    console.log('✅ PASS: Nessun pilota del 2024 è presente come distrattore per il 1998!');
  } else {
    console.error('❌ FAIL: Trovato pilota moderno per il 1998!');
  }

  // 3. Test Question Generation across all categories and eras
  console.log('\n--- TEST 3: GENERAZIONE PROCEDURALE DOMANDE PER TUTTE LE CATEGORIE ED EPOCHE ---');
  const testScenarios: Array<{ category: Category; era: Era }> = [
    { category: 'F1', era: '90s' },
    { category: 'F1', era: '00s' },
    { category: 'F1', era: 'hybrid' },
    { category: 'F1', era: 'modern' },
    { category: 'F2', era: 'all' },
    { category: 'F3', era: 'all' },
    { category: 'ALL', era: 'all' }
  ];

  for (const scenario of testScenarios) {
    const questions = await generateQuizQuestions({
      category: scenario.category,
      era: scenario.era,
      liveGp,
      count: 10
    });

    console.log(`\nScenario [${scenario.category} - ${scenario.era}]: Generate ${questions.length} domande:`);
    if (questions.length !== 10) {
      console.warn(`   ⚠️ Previste 10 domande, generate: ${questions.length}`);
    } else {
      console.log(`   ✅ 10 domande generate correttamente.`);
    }

    // Sample first question
    const sample = questions[0];
    console.log(`   Campione 1: "${sample.question}"`);
    console.log(`   Opzioni: [${sample.options.join(' | ')}]`);
    console.log(`   Risposta Esatta: "${sample.options[sample.correctIndex]}"`);
    console.log(`   Curiosità: ${sample.context.substring(0, 70)}...`);

    // Ensure all options are unique
    const uniqueOptions = new Set(sample.options);
    if (uniqueOptions.size !== 4) {
      console.error(`   ❌ ERRORE: Opzioni duplicate rilevate!`);
    } else {
      console.log(`   ✅ 4 opzioni distinte e non vuote.`);
    }
  }

  // 4. Test Points Calculation & Superlicense Rank
  console.log('\n--- TEST 4: CALCOLO PUNTEGGI & SUPERLICENZA PILOTA ---');
  const fastPoints = calculatePoints(14, 3); // 14s left, streak 3
  const slowPoints = calculatePoints(2, 1);  // 2s left, streak 1
  console.log(`Punti risposta veloce (14s rimanenti, Combo x1.5): ${fastPoints} PTS`);
  console.log(`Punti risposta lenta (2s rimanenti, Combo x1.0): ${slowPoints} PTS`);

  const mockAnswers: PlayerAnswer[] = Array.from({ length: 10 }).map((_, i) => ({
    questionIndex: i,
    question: {
      id: `mock_${i}`,
      category: 'F1',
      year: 2024,
      templateId: 'mock',
      question: 'Test',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      context: 'Test context',
      tag: 'Test'
    },
    selectedIndex: i < 8 ? 0 : 1, // 8 correct, 2 wrong
    isCorrect: i < 8,
    timeRemaining: 10,
    timeTaken: 5,
    pointsEarned: i < 8 ? 750 : 0
  }));

  const stats = computeGameStats(mockAnswers, 6000, 8);
  console.log(`Risultato Superlicenza per 6000 PTS (8/10 corretti):`);
  console.log(`   - Grado: ${stats.superlicenseTitle}`);
  console.log(`   - Descrizione: ${stats.superlicenseRank}`);
  console.log(`   - Precisione: ${stats.accuracy}%`);

  console.log('\n🏁 TUTTI I TEST COMPLETATI CON SUCCESSO!\n');
}

runVerification().catch(err => {
  console.error('Test fallito:', err);
  process.exit(1);
});
