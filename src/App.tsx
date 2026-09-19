import React, { useState, useEffect, useCallback } from 'react';
import { Category, Era, ScreenState, QuizQuestion, GameStats, PlayerAnswer, LiveGpInfo } from './types';
import { getLatestF1Race } from './api/motorsportApi';
import { generateQuizQuestions } from './engine/questionEngine';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { PodiumSummary } from './components/PodiumSummary';
import { sound } from './utils/sound';
import { Flag, Loader2 } from 'lucide-react';

export function App() {
  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [category, setCategory] = useState<Category>('ALL');
  const [era, setEra] = useState<Era>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [answersLog, setAnswersLog] = useState<PlayerAnswer[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Live Auto-Update Grand Prix Information
  const [liveGp, setLiveGp] = useState<LiveGpInfo | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);

  // Fetch Latest Live GP on Mount
  const fetchLiveFeed = useCallback(async () => {
    setIsLoadingLive(true);
    try {
      const data = await getLatestF1Race();
      if (data) {
        setLiveGp(data);
      }
    } catch (err) {
      console.warn('Errore nel recupero dati live GP:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveFeed();
  }, [fetchLiveFeed]);

  // Toggle Sound
  const handleToggleSound = () => {
    const nextVal = sound.toggle();
    setSoundEnabled(nextVal);
  };

  // Start Race
  const handleStartGame = async () => {
    sound.playLightsOut();
    setScreen('LOADING');

    try {
      const generated = await generateQuizQuestions({
        category,
        era,
        liveGp,
        count: 10
      });

      setQuestions(generated);
      setScreen('PLAYING');
    } catch (err) {
      console.error('Errore durante la generazione delle domande:', err);
      setScreen('HOME');
    }
  };

  // Game Finished
  const handleFinishGame = (finalStats: GameStats, logs: PlayerAnswer[]) => {
    setStats(finalStats);
    setAnswersLog(logs);
    setScreen('SUMMARY');
  };

  // Play Again (generate new set of questions)
  const handlePlayAgain = async () => {
    sound.playLightsOut();
    setScreen('LOADING');

    try {
      const generated = await generateQuizQuestions({
        category,
        era,
        liveGp,
        count: 10
      });

      setQuestions(generated);
      setScreen('PLAYING');
    } catch (err) {
      console.error('Errore durante la rigenerazione:', err);
      setScreen('HOME');
    }
  };

  // Return to Home
  const handleGoHome = () => {
    sound.playClick();
    setScreen('HOME');
  };

  return (
    <div className="min-h-screen bg-carbon text-slate-100 flex flex-col selection:bg-[#e10600] selection:text-white">
      {/* Motorsport Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        liveGp={liveGp}
        onGoHome={handleGoHome}
        isPlaying={screen === 'PLAYING'}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {screen === 'HOME' && (
          <HomeScreen
            category={category}
            era={era}
            onSelectCategory={setCategory}
            onSelectEra={setEra}
            onStartGame={handleStartGame}
            liveGp={liveGp}
            isLoadingLive={isLoadingLive}
            onRefreshLive={fetchLiveFeed}
          />
        )}

        {screen === 'LOADING' && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-[#232936] border-t-[#e10600] animate-spin" />
              <Flag className="w-8 h-8 text-[#e10600] absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2">
              <h2 className="font-digital font-black text-2xl text-white tracking-widest uppercase">
                PREPARAZIONE GRIGLIA DI PARTENZA
              </h2>
              <p className="text-slate-400 font-racing text-sm max-w-md mx-auto">
                Il motore procedurale sta assemblando 10 domande con distrattori storici coerenti e verificando i dati live dei GP...
              </p>
            </div>

            <div className="flex items-center gap-2 font-digital text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sincronizzazione Telemetria in corso</span>
            </div>
          </div>
        )}

        {screen === 'PLAYING' && questions.length > 0 && (
          <QuizScreen
            questions={questions}
            onFinishGame={handleFinishGame}
            onQuitGame={handleGoHome}
          />
        )}

        {screen === 'SUMMARY' && stats && (
          <PodiumSummary
            stats={stats}
            answersLog={answersLog}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Motorsport Footer */}
      <footer className="w-full py-4 px-4 border-t border-[#1c2230] text-center text-xs font-racing text-slate-500 bg-[#0a0d14]/90">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>APEX GP Motorsport Quiz Engine • F1, F2 & F3 (1990 - Oggi)</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span>Aggiornamento Automatico attivo ad ogni Gran Premio</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          </span>
        </div>
      </footer>
    </div>
  );
}
export default App;
