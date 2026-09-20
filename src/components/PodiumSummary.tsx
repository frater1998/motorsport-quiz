import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle, Zap, Flame, Clock, Award, Shield, User } from 'lucide-react';
import { GameStats, PlayerAnswer, Category, Era, LeaderboardEntry } from '../types';
import { sound } from '../utils/sound';
import { getLeaderboard, saveScoreToLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import { LeaderboardTable } from './LeaderboardTable';

interface PodiumSummaryProps {
  stats: GameStats;
  answersLog: PlayerAnswer[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  playerName: string;
  category: Category;
  era: Era;
  onChangePlayerName?: () => void;
}

export const PodiumSummary: React.FC<PodiumSummaryProps> = ({
  stats,
  answersLog,
  onPlayAgain,
  onGoHome,
  playerName,
  category,
  era,
  onChangePlayerName
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [highlightEntryId, setHighlightEntryId] = useState<string | null>(null);
  const hasSavedRef = useRef<boolean>(false);

  useEffect(() => {
    // Play chequered flag sound
    sound.playChequeredFlag();

    // Trigger victory confetti if good score
    if (stats.accuracy >= 60 || stats.totalScore >= 5000) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e10600', '#ffffff', '#ffd700', '#00e676']
        });
      } catch {
        // Ignore if blocked
      }
    }

    // Save score to leaderboard once
    if (!hasSavedRef.current) {
      hasSavedRef.current = true;
      const saved = saveScoreToLeaderboard({
        playerName: playerName.trim() || 'Pilota Anonimo',
        totalScore: stats.totalScore,
        correctCount: stats.correctCount,
        totalQuestions: stats.totalQuestions,
        accuracy: stats.accuracy,
        category,
        era,
        superlicenseTitle: stats.superlicenseTitle,
        superlicenseColor: stats.superlicenseColor
      });
      setHighlightEntryId(saved.id);
    }

    setLeaderboard(getLeaderboard());
  }, [stats, playerName, category, era]);

  const handleClearLeaderboard = () => {
    if (window.confirm('Sei sicuro di voler azzerare l\'intera classifica salvata?')) {
      clearLeaderboard();
      setLeaderboard([]);
      setHighlightEntryId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in zoom-in-95 duration-400">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161d2b] border border-[#26354d] text-xs font-digital text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>BANDIERA A SCACCHI • GARA COMPLETATA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-racing text-white tracking-tight uppercase">
          PODIO & TELEMETRIA FINALE
        </h1>
      </div>

      {/* FIA Superlicense Digital Card */}
      <div className="w-full bg-gradient-to-br from-[#151a26] via-[#10141e] to-[#0c0f17] border-2 border-[#2b374e] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Racing Kerb Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#e10600] via-amber-400 to-[#e10600]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Superlicense Avatar & Title */}
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center shadow-inner relative">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
              <div className="absolute -bottom-2 px-2 py-0.5 rounded bg-[#e10600] text-[10px] font-digital font-bold text-white uppercase tracking-wider">
                FIA PASS
              </div>
            </div>

            <div>
              <div className="text-xs font-digital text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>PILOTA: <strong className="text-white font-racing text-sm">{playerName || 'Pilota Anonimo'}</strong></span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black font-racing tracking-wide uppercase bg-gradient-to-r ${stats.superlicenseColor} bg-clip-text text-transparent`}>
                {stats.superlicenseTitle}
              </h2>
              <p className="text-sm font-racing text-slate-300 mt-0.5">
                {stats.superlicenseRank}
              </p>
            </div>
          </div>

          {/* Final Score Big Readout */}
          <div className="text-center md:text-right bg-[#090c12] px-6 py-4 rounded-xl border border-[#1f2738]">
            <span className="text-[11px] font-digital text-slate-400 block mb-0.5">PUNTEGGIO TOTALE</span>
            <div className="font-digital font-black text-4xl sm:text-5xl text-white tracking-wider">
              {stats.totalScore.toLocaleString('it-IT')}
            </div>
            <span className="text-xs font-digital text-amber-400 uppercase font-bold">PUNTI MONDIALE</span>
          </div>
        </div>

        {/* 4 Telemetry Stats Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-[#1f2738]">
          <div className="bg-[#0b0e14]/80 p-3.5 rounded-xl border border-[#1e2637] text-center">
            <div className="text-slate-400 text-xs font-racing flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Giri Corretti</span>
            </div>
            <div className="font-digital font-bold text-xl text-white">
              {stats.correctCount} <span className="text-slate-500 text-sm">/ {stats.totalQuestions}</span>
            </div>
          </div>

          <div className="bg-[#0b0e14]/80 p-3.5 rounded-xl border border-[#1e2637] text-center">
            <div className="text-slate-400 text-xs font-racing flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Precisione</span>
            </div>
            <div className="font-digital font-bold text-xl text-white">
              {stats.accuracy}%
            </div>
          </div>

          <div className="bg-[#0b0e14]/80 p-3.5 rounded-xl border border-[#1e2637] text-center">
            <div className="text-slate-400 text-xs font-racing flex items-center justify-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Miglior Streak</span>
            </div>
            <div className="font-digital font-bold text-xl text-amber-400">
              {stats.maxStreak} <span className="text-xs font-digital text-slate-400">di fila</span>
            </div>
          </div>

          <div className="bg-[#0b0e14]/80 p-3.5 rounded-xl border border-[#1e2637] text-center">
            <div className="text-slate-400 text-xs font-racing flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Tempo Medio</span>
            </div>
            <div className="font-digital font-bold text-xl text-white">
              {stats.averageTime}s
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#e10600] to-[#b30000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white font-digital font-bold text-base tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#e10600]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>RIGIOCA ({playerName || 'Stesso Pilota'})</span>
        </button>

        {onChangePlayerName && (
          <button
            onClick={onChangePlayerName}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141a26] hover:bg-[#1f283a] text-slate-200 hover:text-white border border-[#2b3952] font-digital font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>CAMBIA PILOTA</span>
          </button>
        )}

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#151922] hover:bg-[#1f2634] text-slate-300 hover:text-white border border-[#232936] font-digital font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Home className="w-5 h-5 text-slate-400" />
          <span>MENU PRINCIPALE</span>
        </button>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4 pt-2">
        <LeaderboardTable
          entries={leaderboard}
          highlightEntryId={highlightEntryId}
          onClear={handleClearLeaderboard}
          showClearButton={true}
        />
      </div>

      {/* Complete Laps Telemetry Breakdown */}
      <div className="space-y-4 pt-4">
        <h3 className="font-racing font-bold text-xl text-white uppercase tracking-wider flex items-center gap-2">
          <span>Telemetria Completa Giro per Giro</span>
          <span className="text-xs font-digital text-slate-400 bg-[#161c28] px-2.5 py-0.5 rounded border border-[#242d3e]">
            10 GIRI
          </span>
        </h3>

        <div className="space-y-3">
          {answersLog.map((log, index) => {
            const isCorrect = log.isCorrect;
            const q = log.question;
            const selectedText = log.selectedIndex >= 0 ? q.options[log.selectedIndex] : 'Tempo scaduto';
            const correctText = q.options[q.correctIndex];

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrect
                    ? 'bg-[#101720]/80 border-emerald-500/30'
                    : 'bg-[#171115]/80 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-md font-digital font-bold text-xs flex items-center justify-center shrink-0 ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-xs font-digital text-slate-400 bg-[#1a2130] px-2 py-0.5 rounded">
                      {q.category} • {q.year}
                    </span>
                    <span className="text-xs font-racing text-slate-400 hidden sm:inline">
                      {q.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-digital text-xs">
                    <span className="text-slate-400">{log.timeTaken.toFixed(1)}s</span>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-slate-500'}`}>
                      +{log.pointsEarned} PTS
                    </span>
                  </div>
                </div>

                <p className="font-racing font-bold text-base text-white mb-2">
                  {q.question}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-body mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Tua risposta:</span>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedText}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Risposta esatta:</span>
                      <span className="font-bold text-emerald-400">
                        {correctText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Telemetry Fact */}
                <div className="text-xs text-slate-400 font-body bg-[#0d1017] p-2.5 rounded-lg border border-[#1b2230]">
                  <strong className="text-slate-300">Telemetria:</strong> {q.context}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
