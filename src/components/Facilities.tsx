import React from 'react';
import {
  Compass,
  Grid,
  Clock,
  SunMedium,
  Target,
  CircleDot,
  Trophy,
  GraduationCap,
  Activity,
  Building2,
  Swords,
  Tent,
  CheckCircle2
} from 'lucide-react';

export const Facilities: React.FC = () => {
  const facilities = [
    {
      num: '01',
      title: 'Cricket Ground',
      desc: 'Full-sized 65m+ boundary match ground with well-prepared turf clay pitch and outfield.',
      icon: Compass
    },
    {
      num: '02',
      title: 'Practice Nets',
      desc: 'Enclosed multi-bay training turf and matting pitches for batting and bowling drills.',
      icon: Grid
    },
    {
      num: '03',
      title: '24/7 Nets Booking',
      desc: 'Round-the-clock booking convenience subject to operational and weather schedules.',
      icon: Clock
    },
    {
      num: '04',
      title: 'Flood Lights',
      desc: 'High-power stadium LED floodlight towers enabling evening matches and night practice.',
      icon: SunMedium
    },
    {
      num: '05',
      title: 'Bowling Machine',
      desc: 'Electronic bowling machine delivering up to 145 km/h with swing, seam, and cutter variations.',
      icon: Target
    },
    {
      num: '06',
      title: 'White Cricket Balls',
      desc: 'Tournament-approved four-piece white leather balls for limited-overs white-ball cricket.',
      icon: CircleDot
    },
    {
      num: '07',
      title: 'Red Cricket Balls',
      desc: 'Premium club red leather balls for multi-day format training and red-ball mastery.',
      icon: CircleDot
    },
    {
      num: '08',
      title: 'Cricket Academy',
      desc: 'Professional youth cricket development program for boys and girls aged 10–19 years.',
      icon: Trophy
    },
    {
      num: '09',
      title: 'Special Coaching',
      desc: '1-on-1 personalized technical feedback, biomechanics video analysis, and wicket keeping clinics.',
      icon: GraduationCap
    },
    {
      num: '10',
      title: 'Fitness Trainer',
      desc: 'Dedicated strength, conditioning, sprint acceleration, and injury-prevention protocols.',
      icon: Activity
    },
    {
      num: '11',
      title: 'Academy Hostel',
      desc: 'On-premise air-conditioned boarding for outstation cricket students in Adibatla.',
      icon: Building2
    },
    {
      num: '12',
      title: 'Weekly Matches',
      desc: 'Real match simulation with 2 competitive matches weekly on prepared tournament wicket.',
      icon: Swords
    },
    {
      num: '13',
      title: 'Camp Training',
      desc: 'High-intensity summer and seasonal cricket bootcamps focusing on match temperament.',
      icon: Tent
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-slate-50 dark:bg-[#06120b] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>11</span>
            <span>·</span>
            <span>Complete Sports Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Cricket Training <span className="text-[#16a34a] dark:text-[#4ade80]">Facilities</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Everything required to train, compete, and excel under one roof in Nadargul Rural, Adibatla.
          </p>
        </div>

        {/* 13 Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {facilities.map((fac) => {
            const Icon = fac.icon;
            return (
              <div
                key={fac.num}
                className="p-5 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/50 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#15803d] dark:text-[#84cc16]">
                      {fac.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#050e07] border border-emerald-200 dark:border-[#15341d] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                    {fac.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fac.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#132c1a] flex items-center gap-1.5 text-[11px] text-[#15803d] dark:text-[#4ade80]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>KSM Verified Facility</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
