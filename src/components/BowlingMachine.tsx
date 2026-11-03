import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Loader2,
  Calendar,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import type { BowlingMachineBooking } from '../types/index.js';
import { api, formatBowlingMachineWhatsApp, createWhatsAppUrl } from '../services/api.js';

interface BowlingMachineProps {
  onPaymentClick?: (bookingId: string, amount: number) => void;
}

export const BowlingMachine: React.FC<BowlingMachineProps> = ({ onPaymentClick }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [preferredTime, setPreferredTime] = useState('07:00 AM');
  const [sessionCount, setSessionCount] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<BowlingMachineBooking | null>(null);

  const totalBalls = sessionCount * 200;
  const totalPrice = sessionCount * 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.bookBowlingMachine({
        date,
        preferredTime,
        sessionCount,
        totalBalls,
        totalPrice,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim()
      });

      setSuccessBooking(res.booking);
    } catch (err: any) {
      setError(err.message || 'Failed to submit bowling machine reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="bowling-machine" className="py-20 bg-white dark:bg-[#07150c] border-t border-slate-200 dark:border-[#15341d] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>07</span>
            <span>·</span>
            <span>High-Speed Training Technology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Bowling <span className="text-[#16a34a] dark:text-[#4ade80]">Machine</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Train against inswing, outswing and cutters with a focused one-hour machine session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Feature Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0a1e12] border border-slate-200 dark:border-[#1e4528] shadow-lg">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Session Pricing</span>
              <div className="flex items-baseline gap-2 mt-1 mb-3">
                <span className="text-4xl font-extrabold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                  ₹1,000
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">/ 1 Hour · 200 Balls</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Automated programmable feed with variable speed control from 80 km/h up to 145 km/h. Great for honing pull shots, cover drives, and backfoot defense.
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[#173a22] text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-[#15803d] dark:text-[#84cc16] shrink-0" />
                  <span>Precision Inswing & Outswing release angles</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#15803d] dark:text-[#84cc16] shrink-0" />
                  <span>Off-cutters & Leg-cutters spin simulation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#15803d] dark:text-[#84cc16] shrink-0" />
                  <span>Operator assistance included for optimal drills</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-100 dark:bg-[#050e07] border border-slate-200 dark:border-[#163820] text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Equipment Recommendation:</span>
              Please bring your full batting kit (helmet, leg pads, gloves, chest guard, and abdominal guard) for safety. Machine balls are provided by the academy.
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-xl">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block mb-1">Enquiry & Slot Booking</span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-6">
                Reserve Bowling Machine Drill
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {successBooking ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-[#11311b] border border-emerald-300 dark:border-[#22c55e] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-2">
                    Enquiry Received
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
                    Booking ID: <span className="font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{successBooking.id}</span>. We will confirm operator & machine availability for your session.
                  </p>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#050e07] border border-slate-200 dark:border-[#173a21] text-left text-xs space-y-1 mb-6 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{successBooking.date} at {successBooking.preferredTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Sessions / Balls:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{successBooking.sessionCount} Hour(s) ({successBooking.totalBalls} Balls)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Total Rate:</span>
                      <span className="font-semibold text-[#15803d] dark:text-[#4ade80]">₹{successBooking.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={createWhatsAppUrl(formatBowlingMachineWhatsApp(successBooking))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSuccessBooking(null)}
                      className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      >
                        <option>06:00 AM</option>
                        <option>07:00 AM</option>
                        <option>08:30 AM</option>
                        <option>10:00 AM</option>
                        <option>04:00 PM</option>
                        <option>05:30 PM</option>
                        <option>07:00 PM</option>
                        <option>08:30 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Sessions selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Number of Sessions
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSessionCount(s)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            sessionCount === s
                              ? 'bg-emerald-50 dark:bg-[#12381e] border-[#16a34a] dark:border-[#22c55e] text-[#15803d] dark:text-white shadow-sm'
                              : 'bg-white dark:bg-[#050e07] border-slate-200 dark:border-[#183921] text-slate-700 dark:text-slate-300 hover:border-[#22c55e]/40'
                          }`}
                        >
                          <span className="block text-sm font-bold font-['Barlow_Condensed'] uppercase">
                            {s} Hour{s > 1 ? 's' : ''}
                          </span>
                          <span className="text-[10px] text-[#15803d] dark:text-[#84cc16] font-mono">
                            {s * 200} Balls
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated total strip */}
                  <div className="p-3 rounded-lg bg-white dark:bg-[#050e07] border border-slate-200 dark:border-[#183a21] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Machine Fee:</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {sessionCount} Hour ({totalBalls} Balls)
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanjay Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 93922 59363"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="player@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Delivery Drills Focus
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inswingers, bouncers, 130 km/h"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        <span>Book Bowling Machine · ₹{totalPrice.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
