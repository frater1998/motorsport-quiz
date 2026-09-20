import React from 'react';
import { Trophy, Medal, Flame, Calendar, Trash2, User, Gauge } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { formatLeaderboardDate, getCategoryBadgeLabel, getEraBadgeLabel } from '../utils/leaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  highlightEntryId?: string | null;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  highlightEntryId = null,
  onClear,
  showClearButton = false
}) => {
  if (entries.length === 0) {
    return (
      <div className="w-full bg-[#121620] border border-[#232936] rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#1a2233] border border-[#29354d] text-slate-500 flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-racing font-bold text-lg text-white uppercase">
            GRIGLIA DI PARTENZA VUOTA
          </h3>
          <p className="text-sm text-slate-400 font-body max-w-md mx-auto">
            Nessun pilota ha ancora registrato un tempo. Completa un quiz per essere il primo a conquistare la pole position nella classifica mondiale!
          </p>
        </div>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);

  return (
    <div className="w-full space-y-6">
      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {top3.map((entry, idx) => {
          const isP1 = idx === 0;
          const isP2 = idx === 1;
          const isP3 = idx === 2;
          const isCurrent = entry.id === highlightEntryId;

          const medalColor = isP1
            ? 'from-amber-500/20 to-amber-600/5 border-amber-500/50 text-amber-400'
            : isP2
            ? 'from-slate-400/20 to-slate-500/5 border-slate-400/50 text-slate-300'
            : 'from-amber-800/20 to-orange-950/10 border-amber-700/50 text-amber-600';

          const badgeBg = isP1 ? 'bg-amber-400 text-slate-950' : isP2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white';

          return (
            <div
              key={entry.id}
              className={`p-4 rounded-xl border bg-gradient-to-b relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${medalColor} ${
                isCurrent ? 'ring-2 ring-[#e10600] scale-[1.02] shadow-xl shadow-[#e10600]/20' : ''
              }`}
            >
              {isCurrent && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#e10600] text-white text-[10px] font-digital font-bold tracking-wider animate-pulse">
                  IL TUO RISULTATO
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${badgeBg} font-digital font-black text-sm flex items-center justify-center shrink-0 shadow-md`}>
                  P{idx + 1}
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-racing text-slate-400 block uppercase tracking-wider">
                    {idx === 0 ? 'Vincitore / Campione' : idx === 1 ? 'Secondo Posto' : 'Terzo Posto'}
                  </span>
                  <h4 className="font-racing font-bold text-lg text-white truncate">
                    {entry.playerName}
                  </h4>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-body">Punteggio:</span>
                  <span className="font-digital font-black text-xl text-white">
                    {entry.totalScore.toLocaleString()} <span className="text-xs text-amber-400 font-racing">PTS</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-racing">
                  <span>Precisione:</span>
                  <span className="font-digital text-emerald-400 font-bold">{entry.accuracy}% ({entry.correctCount}/{entry.totalQuestions})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-body pt-1">
                  <span>{getCategoryBadgeLabel(entry.category)}</span>
                  <span>{formatLeaderboardDate(entry.date)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="w-full bg-[#121620] border border-[#232936] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#232936] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e121a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e10600]/20 border border-[#e10600]/40 flex items-center justify-center text-[#ff4d4d]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-racing font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                CLASSIFICA COMPLETA • GP LEADERBOARD
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Tutti i punteggi registrati ({entries.length} {entries.length === 1 ? 'pilota' : 'piloti'})
              </p>
            </div>
          </div>

          {showClearButton && onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-red-500/10 border border-[#26354d] hover:border-red-500/30 transition cursor-pointer self-start sm:self-auto"
              title="Azzera tutta la classifica salvata"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Azzera Classifica</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#202838] bg-[#0c0f16] text-[11px] font-racing text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Pos.</th>
                <th className="py-3 px-4">Pilota</th>
                <th className="py-3 px-4 text-right">Punti</th>
                <th className="py-3 px-4 text-center">Esatte</th>
                <th className="py-3 px-4 hidden md:table-cell">Categoria & Epoca</th>
                <th className="py-3 px-4 hidden sm:table-cell text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2332] text-xs">
              {entries.map((entry, index) => {
                const isCurrent = entry.id === highlightEntryId;
                const position = index + 1;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-[#e10600]/15 hover:bg-[#e10600]/25 font-bold'
                        : 'hover:bg-[#161d2b]'
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center font-digital font-black">
                      {position === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs">
                          1
                        </span>
                      ) : position === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 text-xs">
                          2
                        </span>
                      ) : position === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400">{position}</span>
                      )}
                    </td>

                    {/* Driver Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#1f2838] border border-[#2d3a52] flex items-center justify-center text-slate-400 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-racing font-bold text-sm text-white truncate max-w-[160px] sm:max-w-[220px]">
                          {entry.playerName}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded bg-[#e10600] text-white text-[9px] font-digital uppercase tracking-wider shrink-0 animate-pulse">
                            TU
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-digital font-black text-base sm:text-lg text-white">
                        {entry.totalScore.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-amber-400 font-racing ml-1">PTS</span>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-digital text-emerald-400 font-bold">
                        {entry.correctCount}/{entry.totalQuestions}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-racing">
                        {entry.accuracy}%
                      </span>
                    </td>

                    {/* Category & Era */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#1c2434] text-slate-300 border border-[#2b3850] text-[10px] font-digital">
                          {getCategoryBadgeLabel(entry.category)}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px] font-racing">
                          {getEraBadgeLabel(entry.era)}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-right text-slate-400 font-body text-[11px]">
                      {formatLeaderboardDate(entry.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
