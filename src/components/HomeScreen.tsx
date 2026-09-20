import React from 'react';
import { Flag, Gauge, Timer, Trophy, ShieldCheck, Sparkles, RefreshCw, Calendar, Radio, User } from 'lucide-react';
import { Category, Era, LiveGpInfo } from '../types';

interface HomeScreenProps {
  category: Category;
  era: Era;
  onSelectCategory: (cat: Category) => void;
  onSelectEra: (era: Era) => void;
  onStartGame: () => void;
  liveGp: LiveGpInfo | null;
  isLoadingLive: boolean;
  onRefreshLive: () => void;
  playerName: string;
  onChangePlayerName: (name: string) => void;
  onOpenLeaderboard: () => void;
  leaderboardCount: number;
}

const CATEGORIES: Array<{ id: Category; name: string; tag: string; description: string; badgeColor: string }> = [
  {
    id: 'F1',
    name: 'Formula 1',
    tag: 'PINNACOLO',
    description: 'GP storici, Campioni del Mondo, Pole position, Costruttori e gare leggendarie dal 1990 ad oggi.',
    badgeColor: 'border-[#e10600]/40 text-[#ff4d4d] bg-[#e10600]/10'
  },
  {
    id: 'F2',
    name: 'Formula 2',
    tag: 'GP2 & F2',
    description: 'Feature Races, Sprint Races e Campioni (da Hamilton e Rosberg a Leclerc, Piastri e Bortoleto).',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
  },
  {
    id: 'F3',
    name: 'Formula 3',
    tag: 'GP3 & F3',
    description: 'Titoli mondiali F3, prestigioso GP di Macao e le future stelle del motorsport internazionale.',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'ALL',
    name: 'Misto',
    tag: 'GRID COMPLETA',
    description: 'La sfida definitiva su tutta la piramide FIA: domande bilanciate tra F1, F2 e Formula 3.',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
  }
];

const ERAS: Array<{ id: Era; name: string; years: string; description: string }> = [
  {
    id: '90s',
    name: "Anni '90",
    years: '1990 - 1999',
    description: 'Senna, Mansell, Prost, l\'ascesa di Michael Schumacher, duelli Williams e Benetton.'
  },
  {
    id: '00s',
    name: 'Anni 2000',
    years: '2000 - 2009',
    description: 'Dominio Ferrari di Schumi, era Alonso-Renault, Räikkönen 2007 e la favola Brawn GP.'
  },
  {
    id: 'hybrid',
    name: 'Era Turbo-Ibrida',
    years: '2014 - 2021',
    description: 'Ibrido V6 Mercedes, record di Hamilton, Rosberg 2016 e il thriller mondiale 2021.'
  },
  {
    id: 'modern',
    name: 'Nuova Era & Recenti',
    years: '2022 - Oggi',
    description: 'Monoposto a effetto suolo, Verstappen, Leclerc, Norris, Piastri e risultati live.'
  },
  {
    id: 'all',
    name: 'Tutta la Storia',
    years: '1990 - Oggi',
    description: 'Oltre 35 anni di motori senza filtri: l\'archivio completo del motorsport moderno.'
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  category,
  era,
  onSelectCategory,
  onSelectEra,
  onStartGame,
  liveGp,
  isLoadingLive,
  onRefreshLive,
  playerName,
  onChangePlayerName,
  onOpenLeaderboard,
  leaderboardCount
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161d2b] border border-[#26354d] text-xs font-digital text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#e10600] animate-ping" />
          <span>MOTORE DI GENERAZIONE PROCEDURALE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-racing tracking-tight text-white uppercase">
          APEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e10600] to-orange-500">GRAND PRIX</span> QUIZ
        </h1>

        <p className="text-slate-400 font-body text-base sm:text-lg max-w-2xl mx-auto">
          Metti alla prova la tua conoscenza sui piloti, circuiti e Gran Premi di <strong className="text-white">Formula 1, F2 e F3</strong>. 
          Il quiz si auto-aggiorna in tempo reale ad ogni nuovo GP disputato!
        </p>
      </div>

      {/* Live Auto-Updated Grand Prix Box */}
      <div className="w-full bg-gradient-to-r from-[#121622] via-[#161d2d] to-[#121622] border border-[#2b374e] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#e10600]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-digital font-bold text-sm tracking-wider text-white">
                  FEED AUTOMATICO • ULTIMO GP RILEVATO
                </h3>
                <span className="text-[10px] font-digital px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body">
                Nessun database statico: i dati si aggiornano da soli il giorno dopo ogni gara.
              </p>
            </div>
          </div>

          <button
            onClick={onRefreshLive}
            disabled={isLoadingLive}
            className="flex items-center gap-1.5 text-xs font-racing text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-[#1a2233] border border-[#2a364d] hover:border-slate-500 transition cursor-pointer self-end sm:self-auto"
            title="Aggiorna feed dall'API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isLoadingLive ? 'Sincronizzazione...' : 'Aggiorna Feed'}</span>
          </button>
        </div>

        {liveGp ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-[#222c40]">
            <div className="bg-[#0f131c] p-3 rounded-xl border border-[#20293b]">
              <span className="text-[11px] font-racing text-slate-400 block mb-0.5">ULTIMO VINCITORE GP</span>
              <span className="font-racing font-bold text-base text-white block truncate">
                {liveGp.winner.name}
              </span>
              <span className="text-xs text-[#ff4d4d] font-digital">
                {liveGp.winner.constructorName} • {liveGp.raceName}
              </span>
            </div>

            <div className="bg-[#0f131c] p-3 rounded-xl border border-[#20293b]">
              <span className="text-[11px] font-racing text-slate-400 block mb-0.5">PODIO RECENTE</span>
              <div className="text-xs text-slate-300 font-racing space-y-0.5 truncate">
                {liveGp.podium.map(p => (
                  <div key={p.position} className="truncate">
                    <span className="text-amber-400 font-bold font-digital mr-1">P{p.position}</span>
                    <strong className="text-white">{p.name}</strong> ({p.constructorName})
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f131c] p-3 rounded-xl border border-[#20293b]">
              <span className="text-[11px] font-racing text-slate-400 block mb-0.5">LEADER MONDIALE</span>
              {liveGp.championshipLeader ? (
                <>
                  <span className="font-racing font-bold text-base text-white block truncate">
                    {liveGp.championshipLeader.driverName}
                  </span>
                  <span className="text-xs text-emerald-400 font-digital">
                    {liveGp.championshipLeader.points} PTS • {liveGp.championshipLeader.wins} Vittorie
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400">Classifica in aggiornamento</span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-slate-400 font-body">
            Connessione all'API in corso... Cache storica pronta all'uso.
          </div>
        )}
      </div>

      {/* Step 1: Select Category */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#e10600] text-white font-digital font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="font-racing font-bold text-xl sm:text-2xl text-white uppercase tracking-wide">
            Scegli la Categoria
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1b2233] to-[#121622] border-[#e10600] ring-2 ring-[#e10600]/40 shadow-lg shadow-[#e10600]/20'
                    : 'bg-[#121620] border-[#232936] hover:bg-[#161c28] hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-racing font-bold text-lg text-white">
                      {cat.name}
                    </span>
                    <span className={`text-[10px] font-digital px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      {cat.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-body leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-3 text-[11px] font-digital font-bold text-[#e10600] flex items-center gap-1">
                    <span>SELEZIONATO</span>
                    <span>✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Era */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#e10600] text-white font-digital font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="font-racing font-bold text-xl sm:text-2xl text-white uppercase tracking-wide">
            Scegli l'Epoca Storica
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ERAS.map(e => {
            const isSelected = era === e.id;
            return (
              <button
                key={e.id}
                onClick={() => onSelectEra(e.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1b2233] to-[#121622] border-[#e10600] ring-2 ring-[#e10600]/40 shadow-lg shadow-[#e10600]/20'
                    : 'bg-[#121620] border-[#232936] hover:bg-[#161c28] hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-racing font-bold text-base text-white">
                      {e.name}
                    </span>
                    <span className="text-[11px] font-digital text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {e.years}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-body leading-relaxed">
                    {e.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-3 text-[11px] font-digital font-bold text-[#e10600] flex items-center gap-1">
                    <span>SELEZIONATO</span>
                    <span>✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Nome del Pilota */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#e10600] text-white font-digital font-bold text-xs flex items-center justify-center">
            3
          </span>
          <h2 className="font-racing font-bold text-xl sm:text-2xl text-white uppercase tracking-wide">
            Nome Pilota per la Classifica
          </h2>
        </div>

        <div className="bg-[#121620] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-lg">
            <label className="text-xs font-racing text-slate-300 block mb-2">
              Inserisci il tuo nome o nickname per comparire nella Classifica Mondiale:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => onChangePlayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onStartGame();
                }}
                placeholder="Es. Charles, Max, Francesco..."
                maxLength={25}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e121a] border border-[#263246] focus:border-[#e10600] focus:ring-2 focus:ring-[#e10600]/30 text-white font-racing text-base outline-none transition placeholder:text-slate-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-body mt-1.5">
              Il punteggio e la precisione verranno registrati nella leaderboard mondiale a fine gara.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto">
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-[#171f2c] hover:bg-[#202b3d] text-slate-200 hover:text-white border border-[#2b3a50] text-xs font-racing flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>CLASSIFICA {leaderboardCount > 0 ? `(${leaderboardCount})` : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules & Gameplay Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#10141e] border border-[#1f2636]">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-racing font-bold text-sm text-white">15 Secondi a Giro</h4>
            <p className="text-xs text-slate-400 font-body">Tachimetro RPM con bonus velocità di reazione.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#10141e] border border-[#1f2636]">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-racing font-bold text-sm text-white">Distrattori Coerenti</h4>
            <p className="text-xs text-slate-400 font-body">Risposte errate basate solo su piloti della stessa epoca.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#10141e] border border-[#1f2636]">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-racing font-bold text-sm text-white">Superlicenza Finale</h4>
            <p className="text-xs text-slate-400 font-body">10 giri per scalare la classifica e vincere il titolo.</p>
          </div>
        </div>
      </div>

      {/* Start Button & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-6">
        <button
          onClick={onStartGame}
          className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#e10600] via-[#ff2200] to-[#b30000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white font-digital font-black text-lg sm:text-xl tracking-wider shadow-2xl shadow-[#e10600]/40 hover:shadow-[#e10600]/70 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <Flag className="w-6 h-6 text-white" />
          <span>ACCENDI I MOTORI • SCENDI IN PISTA</span>
        </button>

        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="w-full sm:w-auto px-6 py-5 rounded-2xl bg-[#141924] hover:bg-[#1d2535] text-slate-300 hover:text-white border border-[#253144] font-digital font-bold text-base tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>CLASSIFICA MONDIALE</span>
        </button>
      </div>
    </div>
  );
};
