import React from 'react';
import { Star, MapPin, Quote, ShieldCheck } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const reviews = [
    {
      author: 'Match Captain, Corporate Club',
      quote: 'Amenities like cool water availability. Ground size and lengths are good.'
    },
    {
      author: 'Local League Cricketer',
      quote: 'Ground is very good to play, with a good atmosphere and nice wicket.'
    },
    {
      author: 'Weekend Tournament Player',
      quote: 'Bounce pitch. Great outfield. Pavilion is just shade and a few chairs.'
    }
  ];

  return (
    <section id="about-us" className="py-20 bg-slate-100 dark:bg-[#07130b] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Facility Proposition */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
              <span>14</span>
              <span>·</span>
              <span>Our Mission & Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight leading-none mb-6">
              Built Around <span className="text-[#16a34a] dark:text-[#4ade80]">the Game.</span>
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              <p>
                KSM Cricket Academy & Ground brings together a cricket ground, practice infrastructure, academy training, fitness support and player development in Nadargul Rural, Adibatla.
              </p>
              <p>
                Players can train across batting, bowling, wicket keeping, fielding and fitness, with special coaching, camp training and competitive match opportunities available.
              </p>
            </div>

            {/* Location & Trust markers */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#173a21] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0" />
                <span>Nadargul Rural · Adibatla · Telangana 501510</span>
              </div>
              <span className="text-[#15803d] dark:text-[#84cc16] font-mono font-semibold">
                Plus Code: 7G5X+P9
              </span>
            </div>
          </div>

          {/* Right Column: Google Reviews Card (Exact Data Only) */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-xl">
              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#15341d]">
                <div>
                  <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Google Verified Rating</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-4xl font-extrabold font-['Barlow_Condensed'] text-slate-900 dark:text-white">
                      3.9
                    </span>
                    <div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">18 Google reviews</span>
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Real Google Reviews</span>
                </div>
              </div>

              {/* Exact 3 Customer Review Excerpts */}
              <div className="pt-6 space-y-4">
                {reviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#15341d] relative"
                  >
                    <Quote className="w-4 h-4 text-[#16a34a]/40 dark:text-[#84cc16]/50 mb-2" />
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed mb-2">
                      "{rev.quote}"
                    </p>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      — {rev.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
