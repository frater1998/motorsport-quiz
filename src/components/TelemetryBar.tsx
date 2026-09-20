import React from 'react';
import { Trophy, Flame, Zap, User } from 'lucide-react';
import { PlayerAnswer } from '../types';

interface TelemetryBarProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  answersLog: PlayerAnswer[];
  playerName?: string;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  currentIndex,
  totalQuestions,
  score,
  streak,
  answersLog,
  playerName
}) => {
  return (
    <div className="w-full bg-[#121620] border border-[#232936] rounded-xl p-3.5 mb-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Lap Counter & Driver Name */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded bg-[#e10600] text-white font-digital font-black text-xs tracking-wider shadow-sm shadow-[#e10600]/40 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>LAP</span>
            <span className="text-white text-sm">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-red-200 text-xs">/ {String(totalQuestions).padStart(2, '0')}</span>
          </div>
          {playerName ? (
            <span className="text-xs font-racing text-slate-300 bg-[#171e2c] px-2.5 py-1 rounded border border-[#27354b] hidden sm:inline-flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>{playerName}</span>
            </span>
          ) : (
            <span className="text-xs font-racing text-slate-400 hidden sm:inline">
              Gran Premio Telemetria
            </span>
          )}
        </div>

        {/* Sectors Display (Mini-Flags for each lap) */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const pastAnswer = answersLog[idx];
            let badgeClass = 'bg-[#1a202c] border-[#2d3748] text-slate-500';
            let dotTitle = `Giro ${idx + 1}: In attesa`;

            if (pastAnswer) {
              if (pastAnswer.isCorrect) {
                // If answered in less than 5 seconds -> Purple sector (Fastest!)
                if (pastAnswer.timeTaken <= 5) {
                  badgeClass = 'bg-purple-900/60 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/30';
                  dotTitle = `Giro ${idx + 1}: Settore Viola (Fastest Lap!)`;
                } else {
                  badgeClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-300';
                  dotTitle = `Giro ${idx + 1}: Settore Verde (Corretto)`;
                }
              } else {
                badgeClass = 'bg-red-950/70 border-red-500 text-red-400';
                dotTitle = `Giro ${idx + 1}: Settore Giallo/Rosso (Errore)`;
              }
            } else if (idx === currentIndex) {
              badgeClass = 'bg-[#e10600]/20 border-[#e10600] text-white ring-2 ring-[#e10600]/40 animate-pulse';
              dotTitle = `Giro ${idx + 1}: In corso`;
            }

            return (
              <div
                key={idx}
                title={dotTitle}
                className={`w-6 h-6 rounded-md border flex items-center justify-center font-digital text-[10px] font-bold transition-all ${badgeClass}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-3">
          {/* Combo Multiplier */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-400 font-digital text-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>x{(1 + (streak - 1) * 0.25).toFixed(2)}</span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-1.5 bg-[#0d111a] px-3 py-1 rounded-lg border border-[#232936]">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-digital font-bold text-sm text-white tracking-wider">
              {score.toLocaleString('it-IT')}
            </span>
            <span className="text-[10px] font-digital text-slate-400">PTS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
