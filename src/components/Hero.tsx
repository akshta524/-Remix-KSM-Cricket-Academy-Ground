import React from 'react';
import { MapPin, ArrowRight, Trophy, Sparkles } from 'lucide-react';

interface HeroProps {
  onBookGroundClick: () => void;
  onExploreAcademyClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookGroundClick,
  onExploreAcademyClick
}) => {
  const highlights = [
    { num: '01', title: 'Cricket Ground', desc: 'Full-size match outfield & prepared pitch' },
    { num: '02', title: 'Practice Nets', desc: 'Turf & matting nets available 24/7' },
    { num: '03', title: 'Flood Lights', desc: 'Day-night matches & evening training' },
    { num: '04', title: 'Bowling Machine', desc: '200 balls/hr with swing & cutters' },
    { num: '05', title: 'Cricket Academy', desc: 'Age 10–19 player coaching' },
    { num: '06', title: 'Fitness Training', desc: 'Dedicated athletic conditioning' },
    { num: '07', title: 'Hostel Facility', desc: 'AC boarding for academy players' },
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#040906]">
      {/* Background panoramic cricket ground image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cricket_ground_1793601200734.jpg"
          alt="KSM Cricket Academy & Ground Adibatla panoramic view"
          className="w-full h-full object-cover object-center filter brightness-90"
          referrerPolicy="no-referrer"
        />
        {/* Deep dark forest-green & pitch-black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#051108]/85 to-[#040906]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040906] via-[#07170b]/75 to-transparent" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Location & Tagline bar */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0a1f11]/80 border border-[#22c55e]/30 text-xs text-slate-300 mb-6 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="font-medium text-slate-200">Nadargul Rural · Adibatla · Telangana</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#84cc16] font-semibold tracking-wider uppercase font-['Barlow_Condensed'] text-sm">
              Train. Play. Compete.
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-['Barlow_Condensed'] uppercase tracking-tight text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[0.95] mb-4 sm:mb-5 text-balance">
            KSM Cricket Academy & Ground{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#84cc16]">
              in Adibatla
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed mb-6 sm:mb-8">
            Your Destination for Cricket, Training and Competition.
          </p>

          {/* CTA Buttons - Full width on mobile, inline on tablet+ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onBookGroundClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] rounded-xl transition-all shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>Book a Ground Slot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreAcademyClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-white bg-[#0e2416]/90 hover:bg-[#153521] border border-[#22c55e]/50 rounded-xl transition-colors flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer active:scale-95"
            >
              <Trophy className="w-4 h-4 text-[#84cc16]" />
              <span>Explore Academy</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#1a3824]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider">Ground Dimensions</span>
              <span className="text-sm sm:text-base font-bold text-white font-['Barlow_Condensed'] tracking-wide">65M+ BOUNDARIES</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider">Pitch Type</span>
              <span className="text-sm sm:text-base font-bold text-white font-['Barlow_Condensed'] tracking-wide">PREPARED TURF CLAY</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider">Nets Availability</span>
              <span className="text-sm sm:text-base font-bold text-[#4ade80] font-['Barlow_Condensed'] tracking-wide">24/7 WITH FLOODLIGHTS</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider">Google Rating</span>
              <span className="text-sm sm:text-base font-bold text-yellow-400 font-['Barlow_Condensed'] tracking-wide">3.9 ★ (18 REVIEWS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Highlights Strip */}
      <div className="relative z-10 w-full border-t border-slate-200 dark:border-[#193a24] bg-white/95 dark:bg-[#07160c]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {highlights.map((item) => (
              <div
                key={item.num}
                className="p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-[#0a1f11]/60 border border-slate-200 dark:border-[#1b3a24]/50 hover:border-[#22c55e]/50 transition-colors shadow-xs last:col-span-2 sm:last:col-span-1"
              >
                <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#16a34a] dark:text-[#84cc16] font-bold">{item.num}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-['Barlow_Condensed'] tracking-wide uppercase truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1 leading-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
