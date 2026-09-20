import React, { useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { LeaderboardTable } from './LeaderboardTable';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClear: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClear
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c0f16] border border-[#232936] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202838] flex items-center justify-between bg-[#11151f]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-racing font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                CLASSIFICA PILOTI APEX GP
              </h2>
              <p className="text-xs text-slate-400 font-body">
                I migliori tempi e punteggi registrati nella storia del quiz
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a2130] hover:bg-[#253046] text-slate-400 hover:text-white border border-[#2b3952] transition cursor-pointer"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <LeaderboardTable
            entries={entries}
            onClear={onClear}
            showClearButton={entries.length > 0}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#202838] bg-[#0e121a] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#1c2436] hover:bg-[#27334d] text-white font-racing text-sm transition cursor-pointer border border-[#2c3a54]"
          >
            CHIUDI
          </button>
        </div>
      </div>
    </div>
  );
};
