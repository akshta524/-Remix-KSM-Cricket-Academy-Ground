import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sport Crest SVG Logo with Bat, Ball, Wickets & KSM Emblem */}
      <div className={`relative ${iconSize} shrink-0 rounded-xl bg-gradient-to-br from-[#122e1d] to-[#07130b] border border-[#22c55e]/30 flex items-center justify-center p-1.5 shadow-md shadow-black/40`}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield Boundary */}
          <path d="M50 8 L88 22 V52 C88 74 50 92 50 92 C50 92 12 74 12 52 V22 L50 8 Z" stroke="#22c55e" strokeWidth="3.5" fill="#0b1f13" />

          {/* Three Stumps / Wickets in the background */}
          <rect x="42" y="32" width="3.5" height="36" rx="1.5" fill="#e2e8f0" />
          <rect x="48.5" y="30" width="3.5" height="38" rx="1.5" fill="#e2e8f0" />
          <rect x="55" y="32" width="3.5" height="36" rx="1.5" fill="#e2e8f0" />
          {/* Bails */}
          <rect x="40.5" y="28" width="19" height="2.5" rx="1" fill="#84cc16" />

          {/* Angled Cricket Bat */}
          <g transform="rotate(-32 50 50)">
            {/* Bat handle */}
            <rect x="48" y="14" width="4" height="20" rx="1.5" fill="#f8fafc" stroke="#334155" strokeWidth="0.8" />
            <rect x="47.5" y="16" width="5" height="3" fill="#84cc16" />
            <rect x="47.5" y="22" width="5" height="3" fill="#84cc16" />
            {/* Bat blade */}
            <path d="M46 34 C46 32 54 32 54 34 L55.5 68 C55.5 70 53 71.5 50 71.5 C47 71.5 44.5 70 44.5 68 Z" fill="#ca8a04" stroke="#eab308" strokeWidth="1" />
            {/* Bat spine shadow */}
            <line x1="50" y1="36" x2="50" y2="68" stroke="#a16207" strokeWidth="1.2" />
          </g>

          {/* Cricket Ball with seam */}
          <circle cx="70" cy="62" r="11" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          <path d="M62 62 C65 55 75 55 78 62" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="1.8 1.4" />
          <path d="M62 62 C65 69 75 69 78 62" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="1.8 1.4" />

          {/* Star accent */}
          <polygon points="50,15 52,19 57,20 53,23 54,28 50,25 46,28 47,23 43,20 48,19" fill="#84cc16" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-['Barlow_Condensed'] font-extrabold tracking-wider text-slate-900 dark:text-white uppercase ${titleSize}`}>
            KSM <span className="text-[#15803d] dark:text-[#4ade80]">CRICKET</span>
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-widest uppercase text-slate-600 dark:text-slate-400 leading-tight">
          Academy & Ground · Adibatla
        </span>
        {showTagline && (
          <span className="text-[9px] font-semibold tracking-wider text-[#65a30d] dark:text-[#84cc16] uppercase mt-0.5">
            Train. Play. Compete.
          </span>
        )}
      </div>
    </div>
  );
};
