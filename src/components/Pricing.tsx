import React from 'react';
import {
  Calendar,
  Clock,
  Target,
  CircleDot,
  Trophy,
  Check,
  ArrowRight
} from 'lucide-react';

interface PricingProps {
  onGroundClick: () => void;
  onNetsClick: () => void;
  onBowlingClick: () => void;
  onAcademyClick: () => void;
  onPaymentClick?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  onGroundClick,
  onNetsClick,
  onBowlingClick,
  onAcademyClick,
  onPaymentClick
}) => {
  return (
    <section id="pricing" className="py-20 bg-slate-100 dark:bg-[#050d08] border-t border-slate-200 dark:border-[#132c1a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>09</span>
            <span>·</span>
            <span>Transparent Rates</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Cricket Academy & <span className="text-[#16a34a] dark:text-[#4ade80]">Ground Pricing</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Standardized rates for ground match slots, floodlight practice nets, bowling machine sessions, equipment, and academy coaching.
          </p>
        </div>

        {/* Top 3 Core Facility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ground Booking Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/50 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Match Ground</span>
                <Calendar className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e]" />
              </div>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                Cricket Ground
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Full-size natural turf ground with 65m+ boundaries and prepared center pitch in Adibatla.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Weekdays / Session</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Monday to Friday</span>
                  </div>
                  <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹3,000
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Weekends / Session</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Saturday & Sunday</span>
                  </div>
                  <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹6,500
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>3 Daily Sessions (Morning / Midday / Dusk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Prepared clay wicket with boundary ropes</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGroundClick}
              className="w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Book Ground Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Practice Nets Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/50 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Training Bays</span>
                <Clock className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e]" />
              </div>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                Practice Nets
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Turf and high-density matting nets available 24/7 with professional floodlighting.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Morning / Hour</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Daylight Training</span>
                  </div>
                  <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹500
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Night Flood Lights / Hour</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Evening illumination</span>
                  </div>
                  <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹800
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Enclosed high-durability safety netting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Leather & tennis ball practice friendly</span>
                </div>
              </div>
            </div>

            <button
              onClick={onNetsClick}
              className="w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Book Practice Nets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bowling Machine Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/50 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Drill Tech</span>
                <Target className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e]" />
              </div>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                Bowling Machine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                High-speed programmable machine for focused batting practice against swing and spin.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">1 Hour Session</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">200 Machine Balls</span>
                  </div>
                  <span className="text-3xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹1,000
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-[#07170c] border border-emerald-200 dark:border-[#183a21] text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="text-[#15803d] dark:text-[#84cc16] font-bold">Includes Operator:</span> Operator assists with speed settings (80–145 km/h) & line adjustment.
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Inswing, outswing, cutters & spin variation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>200 balls per 1-hour booking</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBowlingClick}
              className="w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Book Bowling Machine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cricket Balls & Academy Fees Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cricket Balls Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Equipment Supply</span>
                <CircleDot className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                Cricket Balls
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Tournament-grade leather balls available on-site for match days and net practice.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#15341d] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white border border-slate-300 shadow-sm" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">White Leather Ball</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">4-piece match grade</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹380
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#15341d] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-600 border border-red-800 shadow-sm" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Red Leather Ball</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">4-piece club test grade</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                    ₹380
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#132c1a]">
              Available directly at the ground pavilion desk before match start.
            </div>
          </div>

          {/* Academy Membership Fees */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950 to-[#07150c] text-white border border-[#22c55e]/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#84cc16]">Coaching Memberships</span>
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Barlow_Condensed'] uppercase text-white mb-2">
                Academy Fees & Packages
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Age 10–19 years youth player development program with BCCI qualified coaches, fitness drills, and competitive match schedules.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Quarterly */}
                <div className="p-4 rounded-xl bg-emerald-900/40 dark:bg-[#050e07]/80 border border-emerald-700/50 dark:border-[#1a3d24]">
                  <span className="text-xs font-bold font-['Barlow_Condensed'] uppercase text-slate-300 block mb-1">
                    Quarterly
                  </span>
                  <div className="text-2xl font-bold font-['Barlow_Condensed'] text-[#4ade80] mb-2">
                    ₹10,000
                  </div>
                  <p className="text-[11px] text-slate-300 dark:text-slate-400 leading-tight">
                    3 months foundational coaching, weekend net sessions, skill analysis.
                  </p>
                </div>

                {/* 6 Months */}
                <div className="p-4 rounded-xl bg-emerald-900/40 dark:bg-[#050e07]/80 border border-emerald-700/50 dark:border-[#1a3d24]">
                  <span className="text-xs font-bold font-['Barlow_Condensed'] uppercase text-slate-300 block mb-1">
                    6 Months
                  </span>
                  <div className="text-2xl font-bold font-['Barlow_Condensed'] text-[#4ade80] mb-2">
                    ₹20,000
                  </div>
                  <p className="text-[11px] text-slate-300 dark:text-slate-400 leading-tight">
                    Half-season training, match fitness, regular practice matches, video reviews.
                  </p>
                </div>

                {/* Yearly */}
                <div className="p-4 rounded-xl bg-emerald-800 dark:bg-[#0e2c17] border border-[#22c55e] relative shadow-lg">
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-[#84cc16] text-black text-[9px] font-bold font-mono uppercase">
                    Best Value
                  </div>
                  <span className="text-xs font-bold font-['Barlow_Condensed'] uppercase text-white block mb-1">
                    Yearly
                  </span>
                  <div className="text-2xl font-bold font-['Barlow_Condensed'] text-[#4ade80] mb-2">
                    ₹40,000
                  </div>
                  <p className="text-[11px] text-slate-100 dark:text-slate-200 leading-tight">
                    Includes camp fee and two matches weekly on prepared tournament wicket.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-800/80 dark:border-[#173a22]">
              <span className="text-xs text-slate-300">
                Hostel accommodation available separately for outstation academy players.
              </span>
              <button
                onClick={onAcademyClick}
                className="py-2.5 px-6 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors whitespace-nowrap cursor-pointer shadow-md"
              >
                Apply for Admission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
