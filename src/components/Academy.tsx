import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Award,
  Zap,
  Target,
  Shield,
  Activity,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AdmissionModal } from './AdmissionModal.js';

export const Academy: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('Batting');

  const trainingProgrammes = [
    {
      num: '01',
      title: 'Batting',
      desc: 'Stance, head position, back-lift, cover drive, pull shot, sweep, power-hitting & match temperament.',
      icon: Target
    },
    {
      num: '02',
      title: 'Bowling',
      desc: 'Pace & swing biomechanics, seam position, cutters, spin drift, flight, yorker drills & line control.',
      icon: Flame
    },
    {
      num: '03',
      title: 'Wicket Keeping',
      desc: 'Crouch posture, glove work, lateral footwork, standing up to spin, stumping speed & reflex catches.',
      icon: Shield
    },
    {
      num: '04',
      title: 'Fielding',
      desc: 'Direct hits, sliding pick-ups, boundary relays, high-pressure slip catching & reflex close-in catching.',
      icon: Zap
    },
    {
      num: '05',
      title: 'Fitness',
      desc: 'Cricket-specific agility, sprint mechanics, core stability, shoulder injury prevention & endurance.',
      icon: Activity
    }
  ];

  const features = [
    'Professional BCCI/NIS qualified cricket coaches',
    'Special 1-on-1 video analysis & coaching clinics',
    'Certified strength & conditioning fitness trainer',
    'Two competitive matches weekly on prepared match pitch',
    'Intensive summer & seasonal camp training',
    'Long-term player development curriculum',
    'Direct exposure to state & district competitive selections'
  ];

  const showcaseMoments = [
    {
      title: 'Coaching Clinic with Senior Coaches',
      category: 'Coaches & Training',
      img: '/src/assets/images/academy_coaching_session_1793601202753.jpg',
      caption: 'Focused batting stance instruction by senior academy coaches.'
    },
    {
      title: 'High-Pace Net Practice Drills',
      category: 'Cricket Practice',
      img: '/src/assets/images/academy_cricket_nets_1793601202321.jpg',
      caption: 'Bowling machine drills facing 130 km/h inswing deliveries.'
    },
    {
      title: 'Adibatla Match-Day Atmosphere',
      category: 'Weekly Matches',
      img: '/src/assets/images/hero_cricket_ground_1793601200734.jpg',
      caption: 'Competitive weekend games on full-size turf wickets.'
    },
    {
      title: 'Floodlight Match Simulation',
      category: 'Evening Play',
      img: '/src/assets/images/evening_floodlights_match_1793601203797.jpg',
      caption: 'Day-night cricket practice under high-lumen floodlight towers.'
    }
  ];

  return (
    <section id="academy" className="py-20 bg-slate-50 dark:bg-[#06110a] border-t border-slate-200 dark:border-[#132c1a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>08</span>
            <span>·</span>
            <span>Elite Youth Coaching</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            KSM Cricket Academy <span className="text-[#16a34a] dark:text-[#4ade80]">in Adibatla</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
            Cricket coaching near Nadargul focused on player development, professional coaching, fitness and competitive opportunities.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#0e2717] border border-emerald-300 dark:border-[#22c55e]/40 text-xs text-slate-800 dark:text-white">
            <Users className="w-3.5 h-3.5 text-[#15803d] dark:text-[#84cc16]" />
            <span className="font-semibold text-[#15803d] dark:text-[#84cc16]">Admission Age: 10–19 Years</span>
            <span className="text-slate-400 dark:text-slate-500">·</span>
            <span className="text-slate-600 dark:text-slate-300">Quarterly, 6 Months & Yearly Memberships</span>
          </div>
        </div>

        {/* 5 Training Programmes */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">
              Core Training Programmes
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Structured syllabus for youth athletes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trainingProgrammes.map((prog) => {
              const Icon = prog.icon;
              return (
                <div
                  key={prog.num}
                  className="p-5 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/60 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{prog.num}</span>
                      <Icon className="w-4 h-4 text-[#16a34a] dark:text-[#4ade80] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {prog.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProgram(prog.title);
                      setIsModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#15803d] dark:text-[#4ade80] hover:text-[#16a34a] dark:hover:text-[#84cc16] flex items-center gap-1 transition-colors pt-2 border-t border-slate-100 dark:border-[#142e1b] cursor-pointer"
                  >
                    <span>Enquire for {prog.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academy Highlights & Feature Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          {/* Left: Key Features */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block">
              Development Ecosystem
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white">
              Professional Coaching & Competitive Match Play
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pb-2">
              Our academy mentors young cricketers with a complete pathway from fundamental technique to competitive district tournaments.
            </p>

            <div className="space-y-2.5 pt-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3.5 px-6 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Join KSM Cricket Academy</span>
              </button>
            </div>
          </div>

          {/* Right: Academy Moments Showcase */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {showcaseMoments.map((mom, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-[#1b3a23] shadow-md group aspect-[4/3]"
              >
                <img
                  src={mom.img}
                  alt={mom.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono text-[#4ade80] dark:text-[#84cc16] uppercase block">
                    {mom.category}
                  </span>
                  <h4 className="text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wide leading-tight mt-0.5">
                    {mom.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {mom.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#091f11] to-[#07150c] text-white border border-[#22c55e]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-mono text-[#84cc16] uppercase">Admissions Open 2026 Season</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Barlow_Condensed'] uppercase text-white mt-1">
              Start Your Cricket Journey with KSM
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Trial sessions and talent assessments conducted every Saturday & Sunday morning at our Adibatla facility.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors whitespace-nowrap cursor-pointer shadow-md"
          >
            Join KSM Cricket Academy
          </button>
        </div>
      </div>

      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProgram={selectedProgram}
      />
    </section>
  );
};
