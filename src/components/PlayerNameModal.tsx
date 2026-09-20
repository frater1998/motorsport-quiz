import React, { useState, useEffect, useRef } from 'react';
import { User, Flag, X } from 'lucide-react';

interface PlayerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  initialName?: string;
}

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialName = ''
}) => {
  const [name, setName] = useState<string>(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onConfirm(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e121a] border border-[#26354d] rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#182130] hover:bg-[#222e44] text-slate-400 hover:text-white transition cursor-pointer"
          title="Annulla"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e10600]/20 border border-[#e10600]/40 flex items-center justify-center text-[#ff4d4d] shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-racing font-bold text-xl text-white uppercase tracking-wide">
              REGISTRAZIONE PILOTA
            </h3>
            <p className="text-xs text-slate-400 font-body">
              Inserisci il tuo nome per la Classifica Mondiale
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-racing text-slate-300 block">
              Nome o Nickname Pilota:
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Es. Charles, Max, Francesco..."
                maxLength={25}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#151a24] border border-[#2c394e] focus:border-[#e10600] focus:ring-2 focus:ring-[#e10600]/30 text-white font-racing placeholder:text-slate-500 text-base outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              Il tuo punteggio verrà salvato nella leaderboard di fine gara con questo nome.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1a212e] hover:bg-[#232c3d] text-slate-400 hover:text-slate-200 text-xs font-racing transition cursor-pointer border border-[#29364b]"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e10600] to-[#b30000] hover:from-[#ff2200] hover:to-[#cc0000] text-white font-digital font-bold text-sm tracking-wider transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#e10600]/30 flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
              <span>SCENDI IN PISTA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
