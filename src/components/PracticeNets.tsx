import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import type { NetsBooking } from '../types/index.js';
import { api, formatNetsBookingWhatsApp, createWhatsAppUrl } from '../services/api.js';

interface PracticeNetsProps {
  onPaymentClick?: (bookingId: string, amount: number) => void;
}

export const PracticeNets: React.FC<PracticeNetsProps> = ({ onPaymentClick }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [sessionType, setSessionType] = useState<'morning' | 'night'>('morning');
  const [startTime, setStartTime] = useState('06:30 AM');
  const [duration, setDuration] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [playersCount, setPlayersCount] = useState('2');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<NetsBooking | null>(null);

  const pricePerHour = sessionType === 'night' ? 800 : 500;
  const totalPrice = pricePerHour * duration;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.bookNets({
        date,
        sessionType,
        timing: `${startTime} (${duration} hr${duration > 1 ? 's' : ''})`,
        durationHours: duration,
        pricePerHour,
        totalPrice,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        playersCount: parseInt(playersCount, 10) || 2,
        message: message.trim()
      });

      setSuccessBooking(res.booking);
    } catch (err: any) {
      setError(err.message || 'Failed to submit nets reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="practice-nets" className="py-20 bg-slate-50 dark:bg-[#061009] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual & Facilities Info */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
              <span>06</span>
              <span>·</span>
              <span>Training Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight leading-none mb-4">
              Cricket Training & <span className="text-[#16a34a] dark:text-[#4ade80]">Practice Nets</span>
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#0e2717] border border-emerald-300 dark:border-[#22c55e]/40 text-xs font-semibold text-emerald-800 dark:text-[#4ade80] mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Available 24/7, subject to operational availability</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
              Train on high-grade natural turf pitches and heavy-duty matting nets. Equipped with tournament floodlights for late-evening and early-morning training sessions.
            </p>

            {/* High-res Image of Practice Nets */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1b3d24] mb-6 shadow-xl aspect-[4/3]">
              <img
                src="/src/assets/images/academy_cricket_nets_1793601202321.jpg"
                alt="KSM Cricket Academy practice nets with bowling machine"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-white flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider font-['Barlow_Condensed'] text-sm">
                  Turf & Matting Bays with Leather Balls
                </span>
                <span className="text-[#4ade80] font-mono">Enclosed Safety Nets</span>
              </div>
            </div>

            {/* Rates Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#173820] shadow-sm">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                  <Sun className="w-4 h-4" />
                  <span>Morning Session</span>
                </div>
                <span className="text-2xl font-bold font-['Barlow_Condensed'] text-slate-900 dark:text-white">
                  ₹500 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ hour</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Natural daylight training</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#173820] shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                  <Moon className="w-4 h-4" />
                  <span>Night – Flood Lights</span>
                </div>
                <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                  ₹800 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ hour</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">High-lumen LED illumination</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0a1e11] border border-slate-200 dark:border-[#1e4528] shadow-xl">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block mb-1">Interactive Reservation</span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-6">
                Book Practice Nets
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
                    Nets Enquiry Submitted
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
                    Reference ID: <span className="font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{successBooking.id}</span>. We will confirm net bay availability shortly.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#15341d] text-left text-xs space-y-1 mb-6 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Date & Slot:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{successBooking.date} · {successBooking.timing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Rate:</span>
                      <span className="font-semibold text-[#15803d] dark:text-[#4ade80]">₹{successBooking.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={createWhatsAppUrl(formatNetsBookingWhatsApp(successBooking))}
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
                      Book Another Slot
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Date & Session Type Selector */}
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Session Timing
                      </label>
                      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-[#050e07] rounded-lg border border-slate-300 dark:border-[#1a3c22]">
                        <button
                          type="button"
                          onClick={() => setSessionType('morning')}
                          className={`py-1 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wide rounded ${
                            sessionType === 'morning' ? 'bg-[#16a34a] dark:bg-[#22c55e] text-white dark:text-black shadow' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Morning
                        </button>
                        <button
                          type="button"
                          onClick={() => setSessionType('night')}
                          className={`py-1 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wide rounded ${
                            sessionType === 'night' ? 'bg-[#16a34a] dark:bg-[#22c55e] text-white dark:text-black shadow' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Night (Lights)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Start time & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Start Time
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      >
                        {sessionType === 'morning' ? (
                          <>
                            <option>06:00 AM</option>
                            <option>06:30 AM</option>
                            <option>07:00 AM</option>
                            <option>08:00 AM</option>
                            <option>09:30 AM</option>
                            <option>11:00 AM</option>
                          </>
                        ) : (
                          <>
                            <option>06:30 PM</option>
                            <option>07:00 PM</option>
                            <option>08:00 PM</option>
                            <option>09:00 PM</option>
                            <option>10:00 PM</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Duration (Hours)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setDuration(h)}
                            className={`flex-1 py-1.5 text-xs font-bold font-['Barlow_Condensed'] uppercase rounded border ${
                              duration === h
                                ? 'bg-[#16a34a] dark:bg-[#22c55e] text-white dark:text-black border-[#16a34a] dark:border-[#22c55e]'
                                : 'bg-slate-100 dark:bg-[#050e07] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#1a3c22] hover:border-[#22c55e]/40'
                            }`}
                          >
                            {h} Hr{h > 1 ? 's' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Calculation Strip */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#183a21] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Calculated Rate:</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {duration} hr × ₹{pricePerHour}/hr
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karthik Varma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Number of Players
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={playersCount}
                        onChange={(e) => setPlayersCount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Require white balls, bowling machine, or pads..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3c22] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    />
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
                        <Clock className="w-4 h-4" />
                        <span>Book Nets Slot · ₹{totalPrice.toLocaleString('en-IN')}</span>
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
