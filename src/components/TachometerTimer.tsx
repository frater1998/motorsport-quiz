import React from 'react';
import { Gauge } from 'lucide-react';

interface TachometerTimerProps {
  timeRemaining: number;
  totalTime?: number;
}

export const TachometerTimer: React.FC<TachometerTimerProps> = ({
  timeRemaining,
  totalTime = 15
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  // Determine stage and color
  let colorClass = 'text-emerald-400 stroke-emerald-400';
  let barGradient = 'from-emerald-500 to-teal-400';
  let statusText = 'VELOCITÀ DI PUNTA';
  let isDanger = false;

  if (timeRemaining <= 5) {
    colorClass = 'text-red-500 stroke-red-500';
    barGradient = 'from-red-600 to-orange-500 animate-pulse';
    statusText = 'REV LIMITER!';
    isDanger = true;
  } else if (timeRemaining <= 9) {
    colorClass = 'text-amber-400 stroke-amber-400';
    barGradient = 'from-amber-500 to-yellow-400';
    statusText = 'BANDIERA GIALLA';
  }

  // SVG circle calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-[#121620] border border-[#232936] rounded-xl px-4 py-2.5 shadow-md">
      {/* Circular Gauge */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 90 90">
          {/* Background circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#1c2230"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Animated timer circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`transition-all duration-300 ease-linear ${colorClass}`}
          />
        </svg>

        {/* Digital Time Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-digital font-bold text-xl leading-none ${isDanger ? 'text-red-500 animate-ping-once' : 'text-white'}`}>
            {timeRemaining.toFixed(0)}
          </span>
          <span className="text-[9px] font-digital text-slate-400 uppercase tracking-tighter">SEC</span>
        </div>
      </div>

      {/* Tachometer RPM Bars / Status */}
      <div className="flex-1 min-w-[130px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1 font-racing text-slate-400 text-[11px]">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            RPM TACHO
          </span>
          <span className={`font-digital text-[10px] font-bold tracking-wider ${isDanger ? 'text-red-400' : 'text-slate-300'}`}>
            {statusText}
          </span>
        </div>

        {/* Segmented Tachometer Bar */}
        <div className="h-3 w-full bg-[#181e2b] rounded-full overflow-hidden p-0.5 border border-[#283244] flex gap-0.5">
          {Array.from({ length: 15 }).map((_, i) => {
            const isFilled = i < Math.ceil(timeRemaining);
            let segColor = 'bg-emerald-500';
            if (i < 5) segColor = 'bg-red-500';
            else if (i < 9) segColor = 'bg-amber-400';

            return (
              <div
                key={i}
                className={`h-full flex-1 rounded-[1px] transition-colors duration-200 ${
                  isFilled ? segColor : 'bg-[#1e2637]'
                } ${isDanger && isFilled ? 'opacity-90' : ''}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[9px] font-racing text-slate-500 mt-1">
          <span>0s PIT</span>
          <span>7.5s</span>
          <span>15s APEX</span>
        </div>
      </div>
    </div>
  );
};
