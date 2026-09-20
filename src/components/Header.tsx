import React from 'react';
import { Volume2, VolumeX, Flag, Zap, Radio, Trophy } from 'lucide-react';
import { LiveGpInfo } from '../types';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  liveGp: LiveGpInfo | null;
  onGoHome?: () => void;
  isPlaying?: boolean;
  onOpenLeaderboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  liveGp,
  onGoHome,
  isPlaying = false,
  onOpenLeaderboard
}) => {
  return (
    <header className="w-full bg-[#0d111a]/95 backdrop-blur border-b border-[#232936] sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group transition cursor-pointer"
          title="Torna alla griglia di partenza"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e10600] to-[#990000] flex items-center justify-center shadow-lg shadow-[#e10600]/20 border border-[#ff3b30]/40 group-hover:scale-105 transition-transform">
            <Flag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-digital font-black text-xl tracking-wider text-white">
                APEX<span className="text-[#e10600]">GP</span>
              </span>
              <span className="text-[10px] font-digital px-1.5 py-0.5 rounded bg-[#e10600]/20 text-[#ff4d4d] border border-[#e10600]/40 uppercase tracking-widest font-bold">
                1990-2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-racing tracking-wide hidden sm:block">
              Formula 1 • Formula 2 • Formula 3 Live Quiz Engine
            </p>
          </div>
        </button>

        {/* Center: Live GP Detection Status (Desktop) */}
        {liveGp && !isPlaying && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151a24] border border-[#232936] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-medium">Live Feed:</span>
            <span className="text-emerald-400 font-bold truncate max-w-[200px]">
              {liveGp.raceName}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-racing">
              P1: <strong className="text-white">{liveGp.winner.name}</strong>
            </span>
          </div>
        )}

        {/* Right Actions: Sound Toggle + API indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-racing text-slate-400 bg-[#151922] px-2.5 py-1 rounded-md border border-[#232936]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">API</span>
            <span className="text-emerald-400 font-bold uppercase">LIVE</span>
          </div>

          {onOpenLeaderboard && !isPlaying && (
            <button
              onClick={onOpenLeaderboard}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#151922] hover:bg-[#1f2634] text-amber-400 hover:text-amber-300 border border-[#232936] transition cursor-pointer flex items-center gap-1.5 text-xs font-racing"
              title="Classifica Piloti Apex GP"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">CLASSIFICA</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Disattiva Audio' : 'Attiva Audio'}
            className="p-2 rounded-lg bg-[#151922] hover:bg-[#1f2634] text-slate-300 hover:text-white border border-[#232936] transition cursor-pointer flex items-center gap-1.5 text-xs font-racing"
            title={soundEnabled ? 'Audio Attivo (Effetti Sonori F1)' : 'Audio Silenziato'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-slate-400">AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline text-slate-500">MUTO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
