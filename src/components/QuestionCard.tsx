import React from 'react';
import { CheckCircle2, XCircle, Sparkles, Radio } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  onSelectOption: (index: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  isAnswerChecked,
  onSelectOption
}) => {
  return (
    <div className="w-full bg-[#121620] border border-[#232936] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Motorsport Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e10600] via-amber-500 to-[#e10600]" />

      {/* Meta Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
        <div className="flex items-center gap-2">
          {/* Category Tag */}
          <span className={`px-2.5 py-1 rounded-md font-digital text-xs font-bold uppercase tracking-wider ${
            question.category === 'F1'
              ? 'bg-[#e10600]/20 text-[#ff4d4d] border border-[#e10600]/40'
              : question.category === 'F2'
              ? 'bg-blue-900/30 text-blue-400 border border-blue-500/40'
              : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/40'
          }`}>
            {question.category === 'F1' ? 'Formula 1' : question.category === 'F2' ? 'Formula 2' : 'Formula 3'}
          </span>

          {/* Year Badge */}
          <span className="px-2.5 py-1 rounded-md bg-[#1a2130] text-slate-300 border border-[#2c374c] font-digital text-xs">
            {question.year}
          </span>

          {/* Question Tag */}
          <span className="px-2.5 py-1 rounded-md bg-[#161c27] text-slate-400 text-xs font-racing hidden sm:inline-block">
            {question.tag}
          </span>
        </div>

        {/* Live Auto-Updated Badge if applicable */}
        {question.isLiveAutoUpdated && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-digital font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE GP AUTO-SYNC</span>
          </div>
        )}
      </div>

      {/* Question Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-racing text-white tracking-wide leading-snug mb-8 min-h-[64px] flex items-center">
        {question.question}
      </h2>

      {/* 4 Interactive Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;

          let btnStyle = 'bg-[#161b26] border-[#252f42] text-slate-200 hover:bg-[#1f2737] hover:border-slate-500';
          let letterStyle = 'bg-[#222a3b] text-slate-300 border-[#2f3a52]';
          let icon = null;

          if (isAnswerChecked) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-500/30';
              letterStyle = 'bg-emerald-500 text-white border-emerald-400';
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-auto" />;
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-500/30';
              letterStyle = 'bg-red-600 text-white border-red-500';
              icon = <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-auto" />;
            } else {
              btnStyle = 'bg-[#121620] border-[#1d2331] text-slate-500 opacity-60';
              letterStyle = 'bg-[#181e2b] text-slate-600 border-[#232b3b]';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswerChecked && onSelectOption(idx)}
              disabled={isAnswerChecked}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${btnStyle} ${
                !isAnswerChecked ? 'active:scale-[0.99]' : ''
              }`}
            >
              {/* Option Letter Tag (A, B, C, D) */}
              <span className={`w-8 h-8 rounded-lg border font-digital font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${letterStyle}`}>
                {OPTION_LETTERS[idx]}
              </span>

              {/* Option Content Text */}
              <span className="font-racing font-semibold text-base sm:text-lg tracking-wide flex-1 break-words">
                {optionText}
              </span>

              {/* Status Icon */}
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};
