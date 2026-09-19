import React from 'react';
import { ArrowRight, Info, Check, AlertCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface TelemetryInsightProps {
  question: QuizQuestion;
  isCorrect: boolean;
  pointsEarned: number;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const TelemetryInsight: React.FC<TelemetryInsightProps> = ({
  question,
  isCorrect,
  pointsEarned,
  onNext,
  isLastQuestion
}) => {
  const correctAnswerText = question.options[question.correctIndex];

  return (
    <div className="w-full mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className={`p-4 sm:p-5 rounded-xl border ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/40'
          : 'bg-red-950/40 border-red-500/40'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Feedback Info & Context */}
          <div className="flex items-start gap-3.5 flex-1">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {isCorrect ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-digital font-bold text-sm tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? `RISPOSTA ESATTA! (+${pointsEarned.toLocaleString('it-IT')} PTS)` : 'RISPOSTA ERRATA'}
                </span>
                {!isCorrect && (
                  <span className="text-xs text-slate-300 font-racing">
                    Era: <strong className="text-emerald-400">{correctAnswerText}</strong>
                  </span>
                )}
              </div>

              {/* Historical Context / Telemetry Fact */}
              <div className="flex items-start gap-1.5 text-slate-300 text-sm font-body leading-relaxed mt-1">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{question.context}</span>
              </div>
            </div>
          </div>

          {/* Right: Next Lap Action Button */}
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#e10600] to-[#b30000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white font-digital font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#e10600]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span>{isLastQuestion ? 'BANDIERA A SCACCHI' : 'PROSSIMO GIRO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
