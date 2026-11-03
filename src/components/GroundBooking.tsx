import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  X,
  Send,
  Users,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import type { GroundBooking } from '../types/index.js';
import { api, formatGroundBookingWhatsApp, createWhatsAppUrl } from '../services/api.js';

interface GroundBookingProps {
  onPaymentClick?: (bookingId: string, amount: number) => void;
}

export const GroundBookingSection: React.FC<GroundBookingProps> = ({ onPaymentClick }) => {
  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [existingBookings, setExistingBookings] = useState<GroundBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Modal state
  const [activeSession, setActiveSession] = useState<'s1' | 's2' | 's3' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    booking: GroundBooking;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    teamName: '',
    playersCount: '16',
    message: '',
    termsAccepted: false
  });

  // Calculate day of week and weekend status
  // Note: Selected date formatted YYYY-MM-DD
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const sessionPrice = isWeekend ? 6500 : 3000;

  const sessions = [
    {
      id: 's1' as const,
      num: 'Session 1',
      timing: '7:30 AM – 10:30 AM',
      description: 'Cool morning match slot, fresh dew, ideal pace & bounce.'
    },
    {
      id: 's2' as const,
      num: 'Session 2',
      timing: '10:30 AM – 2:00 PM',
      description: 'Midday tournament match slot with full sunlight.'
    },
    {
      id: 's3' as const,
      num: 'Session 3',
      timing: '2:30 PM – 6:00 PM',
      description: 'Late afternoon session into golden dusk hours.'
    }
  ];

  // Load bookings for current selected date
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await api.getGroundBookings(selectedDate);
      setExistingBookings(data);
    } catch (err) {
      console.error('Error fetching ground bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  // Determine slot status
  const getSlotStatus = (sessionId: 's1' | 's2' | 's3') => {
    const found = existingBookings.find(
      b => b.session === sessionId && (b.status === 'Confirmed' || b.status === 'Pending')
    );
    if (!found) return { status: 'Available', color: 'text-[#4ade80]', bg: 'bg-[#0f2818]', border: 'border-[#22c55e]/30' };
    if (found.status === 'Confirmed') {
      return { status: 'Confirmed (Booked)', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-900/60' };
    }
    return { status: 'Enquiry Pending', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900/60' };
  };

  const handleOpenBookingModal = (sessionId: 's1' | 's2' | 's3') => {
    const slot = getSlotStatus(sessionId);
    if (slot.status === 'Confirmed (Booked)') {
      alert('This slot is already booked for a confirmed match. Please pick an alternative session or date.');
      return;
    }
    setActiveSession(sessionId);
    setErrorMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage('Please enter your full name and contact number.');
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMessage('Please accept the booking terms and conditions.');
      return;
    }

    const sessionObj = sessions.find(s => s.id === activeSession);

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const response = await api.bookGround({
        date: selectedDate,
        session: activeSession,
        sessionName: sessionObj ? `${sessionObj.num} (${sessionObj.timing})` : `Session ${activeSession}`,
        timing: sessionObj?.timing || '',
        isWeekend,
        price: sessionPrice,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        teamName: formData.teamName.trim(),
        playersCount: parseInt(formData.playersCount, 10) || 16,
        message: formData.message.trim()
      });

      setSubmissionSuccess(response);
      setActiveSession(null);
      // Refresh list
      fetchBookings();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit booking enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="ground-booking" className="py-20 bg-slate-50/70 dark:bg-[#07130b] border-t border-slate-200 dark:border-[#142e1b] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#16a34a] dark:text-[#84cc16] mb-2 uppercase tracking-wider font-bold">
            <span>04</span>
            <span>·</span>
            <span>Ground Reservation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Cricket Ground Booking <span className="text-[#16a34a] dark:text-[#4ade80]">in Adibatla</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Choose a weekday or weekend session at KSM Cricket Ground near Nadargul and submit an enquiry. Availability is confirmed separately.
          </p>
        </div>

        {/* Date Selector & Pricing Tier Indicator */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0a1c10] border border-slate-200 dark:border-[#1b3d24] mb-10 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#16331e]">
            {/* Date Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label htmlFor="ground-booking-date" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
                <span>Select Match Date:</span>
              </label>
              <input
                id="ground-booking-date"
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#22c55e]/40 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#4ade80] transition-colors"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Dynamic Pricing Pill */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-[#0e2717] border border-emerald-200 dark:border-[#22c55e]/30 flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] block uppercase font-mono text-slate-600 dark:text-slate-400">
                    {isWeekend ? 'Weekend Rate (Sat–Sun)' : 'Weekday Rate (Mon–Fri)'}
                  </span>
                  <span className="text-xl font-bold font-['Barlow_Condensed'] text-[#16a34a] dark:text-[#4ade80] tracking-wide">
                    ₹{sessionPrice.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-300">/ session</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Explainer */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
            <div className={`p-3 rounded-lg border ${!isWeekend ? 'bg-emerald-50/80 dark:bg-[#0f2e1a] border-emerald-300 dark:border-[#22c55e]/50' : 'bg-slate-50 dark:bg-[#07140b] border-slate-200 dark:border-[#152e1b]'}`}>
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Weekday Pricing – Monday to Friday</span>
              <p className="text-slate-600 dark:text-slate-400">₹3,000 per session. Ideal for practice matches, corporate friendlies, and club workouts.</p>
            </div>
            <div className={`p-3 rounded-lg border ${isWeekend ? 'bg-emerald-50/80 dark:bg-[#0f2e1a] border-emerald-300 dark:border-[#22c55e]/50' : 'bg-slate-50 dark:bg-[#07140b] border-slate-200 dark:border-[#152e1b]'}`}>
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Weekend Pricing – Saturday and Sunday</span>
              <p className="text-slate-600 dark:text-slate-400">₹6,500 per session. High demand tournament slots with full ground preparation.</p>
            </div>
          </div>
        </div>

        {/* 3 Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((sess) => {
            const slot = getSlotStatus(sess.id);
            const isBooked = slot.status === 'Confirmed (Booked)';

            return (
              <div
                key={sess.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#09190e] border border-slate-200 dark:border-[#1b3a23] hover:border-[#16a34a] dark:hover:border-[#22c55e]/40 transition-all flex flex-col justify-between shadow-xs dark:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase text-[#16a34a] dark:text-[#84cc16] font-bold">
                      {sess.num}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${slot.border} ${slot.bg} ${slot.color}`}>
                      {slot.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-['Barlow_Condensed'] text-2xl font-bold mb-2">
                    <Clock className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e]" />
                    <span>{sess.timing}</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-4">
                    {sess.description}
                  </p>

                  <div className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#142e1b] mb-6 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Price for {isWeekend ? 'Weekend' : 'Weekday'}</span>
                    <span className="text-lg font-bold font-['Barlow_Condensed'] text-[#16a34a] dark:text-[#4ade80]">
                      ₹{sessionPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isBooked}
                  onClick={() => handleOpenBookingModal(sess.id)}
                  className={`w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isBooked
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-[#22c55e] hover:bg-[#16a34a] text-black shadow-md cursor-pointer'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isBooked ? 'Slot Booked' : 'Book This Slot'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#22c55e]/40 p-6 sm:p-8 shadow-2xl my-8 transition-colors">
            <button
              onClick={() => setActiveSession(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#050e07]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono uppercase text-[#16a34a] dark:text-[#84cc16] font-bold">Ground Slot Enquiry</span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1">
                Book Ground: {sessions.find(s => s.id === activeSession)?.num}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {selectedDate} ({isWeekend ? 'Weekend' : 'Weekday'}) · {sessions.find(s => s.id === activeSession)?.timing} · ₹{sessionPrice.toLocaleString('en-IN')}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 93922 59363"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adibatla XI"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Players
                  </label>
                  <input
                    type="number"
                    min="11"
                    max="30"
                    value={formData.playersCount}
                    onChange={(e) => setFormData({ ...formData, playersCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Message or Match Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Need balls, umpire requirement, or pitch preference..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#16a34a] dark:focus:border-[#22c55e]"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="ground-terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1 accent-[#16a34a] dark:accent-[#22c55e]"
                />
                <label htmlFor="ground-terms" className="text-xs text-slate-600 dark:text-slate-400">
                  I accept that submitting this request does not confirm the slot automatically. KSM Cricket Academy management will contact me to confirm availability.
                </label>
              </div>

              <div className="pt-3">
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
                      <Send className="w-4 h-4" />
                      <span>Submit Ground Booking Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal with WhatsApp Action */}
      {submissionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#091a0f] border border-emerald-300 dark:border-[#22c55e]/60 p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-[#11311b] border border-[#22c55e] flex items-center justify-center text-[#16a34a] dark:text-[#4ade80] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase text-[#16a34a] dark:text-[#84cc16] font-bold">Enquiry ID: {submissionSuccess.booking.id}</span>
            <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
              Booking Request Submitted
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              Your booking request has been submitted. Our team will contact you to confirm availability.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#1b3a23] text-left text-xs space-y-1.5 mb-6 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submissionSuccess.booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Session:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submissionSuccess.booking.sessionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Rate:</span>
                <span className="font-semibold text-[#16a34a] dark:text-[#4ade80]">₹{submissionSuccess.booking.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submissionSuccess.booking.fullName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={createWhatsAppUrl(formatGroundBookingWhatsApp(submissionSuccess.booking))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send on WhatsApp</span>
              </a>

              {onPaymentClick && (
                <button
                  onClick={() => {
                    onPaymentClick(submissionSuccess.booking.id, submissionSuccess.booking.price);
                    setSubmissionSuccess(null);
                  }}
                  className="py-3 px-4 rounded-lg bg-[#0e2717] hover:bg-[#143921] border border-[#22c55e]/50 text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm"
                >
                  Pay via PhonePe
                </button>
              )}
            </div>

            <button
              onClick={() => setSubmissionSuccess(null)}
              className="mt-4 text-xs text-slate-400 hover:text-white"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
