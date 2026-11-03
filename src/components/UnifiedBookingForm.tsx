import React, { useState } from 'react';
import {
  Calendar,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { api, createWhatsAppUrl } from '../services/api.js';

interface UnifiedBookingFormProps {
  onOpenTerms: () => void;
  onPaymentClick?: (bookingId: string, amount: number) => void;
}

export const UnifiedBookingForm: React.FC<UnifiedBookingFormProps> = ({
  onOpenTerms,
  onPaymentClick
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [service, setService] = useState('Ground Booking');
  const [session, setSession] = useState('Session 1 (7:30 AM – 10:30 AM)');
  const [playersCount, setPlayersCount] = useState('16');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    enquiryId: string;
    service: string;
    message: string;
    whatsAppText: string;
    amount?: number;
  } | null>(null);

  const servicesList = [
    'Ground Booking',
    'Practice Nets',
    'Bowling Machine',
    'Academy Admission',
    'Hostel Enquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your full name and contact number.');
      return;
    }

    if (!termsAccepted) {
      setError('Please review and accept the Terms & Conditions.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let enquiryId = '';
      let calculatedAmount = 0;
      let whatsAppText = '';

      if (service === 'Ground Booking') {
        const dateObj = new Date(bookingDate + 'T00:00:00');
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        calculatedAmount = isWeekend ? 6500 : 3000;
        const sessKey = session.includes('Session 1') ? 's1' : session.includes('Session 2') ? 's2' : 's3';

        const res = await api.bookGround({
          date: bookingDate,
          session: sessKey,
          sessionName: session,
          timing: session,
          isWeekend,
          price: calculatedAmount,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          playersCount: parseInt(playersCount, 10) || 16,
          message: message.trim()
        });

        enquiryId = res.booking.id;
        whatsAppText = `Hello KSM Cricket Academy & Ground,

I have submitted a booking enquiry:
* Enquiry ID: ${enquiryId}
* Service: Ground Booking
* Date: ${bookingDate} (${isWeekend ? 'Weekend: ₹6,500' : 'Weekday: ₹3,000'})
* Session: ${session}
* Name: ${fullName}
* Phone: ${phone}
* Players: ${playersCount}
${message ? `* Note: ${message}` : ''}

Please confirm slot availability. Thank you!`;
      } else if (service === 'Practice Nets') {
        const isNight = session.toLowerCase().includes('night') || session.includes('flood');
        calculatedAmount = isNight ? 800 : 500;
        const res = await api.bookNets({
          date: bookingDate,
          sessionType: isNight ? 'night' : 'morning',
          timing: session,
          durationHours: 1,
          pricePerHour: calculatedAmount,
          totalPrice: calculatedAmount,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          playersCount: parseInt(playersCount, 10) || 2,
          message: message.trim()
        });

        enquiryId = res.booking.id;
        whatsAppText = `Hello KSM Cricket Academy,

I have submitted a nets booking enquiry:
* Enquiry ID: ${enquiryId}
* Service: Practice Nets
* Date: ${bookingDate}
* Session: ${session}
* Name: ${fullName}
* Phone: ${phone}
${message ? `* Note: ${message}` : ''}

Please confirm availability. Thank you!`;
      } else if (service === 'Bowling Machine') {
        calculatedAmount = 1000;
        const res = await api.bookBowlingMachine({
          date: bookingDate,
          preferredTime: session,
          sessionCount: 1,
          totalBalls: 200,
          totalPrice: 1000,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim()
        });

        enquiryId = res.booking.id;
        whatsAppText = `Hello KSM Cricket Academy,

I have requested a Bowling Machine drill:
* Enquiry ID: ${enquiryId}
* Date: ${bookingDate}
* Session: 1 Hour (200 Balls)
* Name: ${fullName}
* Phone: ${phone}
${message ? `* Note: ${message}` : ''}

Please confirm machine slot. Thank you!`;
      } else if (service === 'Academy Admission') {
        calculatedAmount = 10000;
        const res = await api.submitAdmission({
          studentName: fullName.trim(),
          age: 14,
          parentName: fullName.trim() + ' (Guardian)',
          parentPhone: phone.trim(),
          email: email.trim(),
          trainingProgram: 'Batting & All-Round',
          membership: 'Quarterly',
          fee: 10000,
          message: `${session}. Note: ${message}`
        });

        enquiryId = res.admission.id;
        whatsAppText = `Hello KSM Cricket Academy,

I have submitted an Academy Admission enquiry:
* Application ID: ${enquiryId}
* Student/Parent Name: ${fullName}
* Phone: ${phone}
* Note: ${message}`;
      } else {
        // Hostel Enquiry
        const res = await api.submitHostelEnquiry({
          studentName: fullName.trim(),
          age: 15,
          parentName: fullName.trim() + ' (Parent)',
          phone: phone.trim(),
          email: email.trim(),
          preferredDuration: session,
          roomType: 'AC',
          message: message.trim()
        });

        enquiryId = res.enquiry.id;
        whatsAppText = `Hello KSM Cricket Academy,

I have submitted an Academy Hostel enquiry:
* Enquiry ID: ${enquiryId}
* Name: ${fullName}
* Contact: ${phone}
* Duration Preference: ${session}
* Note: ${message}`;
      }

      setSuccessData({
        enquiryId,
        service,
        message: 'Your booking request has been submitted. Our team will contact you to confirm availability.',
        whatsAppText,
        amount: calculatedAmount
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="request-session" className="py-20 bg-slate-50 dark:bg-[#06110a] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>15</span>
            <span>·</span>
            <span>Fast Reservation & Enquiry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Request <span className="text-[#16a34a] dark:text-[#4ade80]">a Session</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Fill in your preferred sports service, date, and contact details. Our team in Adibatla will verify slot availability and get back to you promptly.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successData ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-[#11311b] border border-emerald-300 dark:border-[#22c55e] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">
                Enquiry Generated: {successData.enquiryId}
              </span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
                Booking Enquiry Submitted
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
                {successData.message}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] text-left text-xs space-y-1.5 mb-6 text-slate-700 dark:text-slate-300 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Enquiry ID:</span>
                  <span className="font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{successData.enquiryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Service:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{successData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Contact:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
                <a
                  href={createWhatsAppUrl(successData.whatsAppText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Booking Enquiry on WhatsApp</span>
                </a>

                <button
                  onClick={() => setSuccessData(null)}
                  className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm cursor-pointer"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 93922 59363"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              {/* Row 2: Email & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selected Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  >
                    {servicesList.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Booking Date & Selected Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Booking Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selected Session / Timing <span className="text-red-500">*</span>
                  </label>
                  {service === 'Ground Booking' ? (
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    >
                      <option>Session 1 (7:30 AM – 10:30 AM)</option>
                      <option>Session 2 (10:30 AM – 2:00 PM)</option>
                      <option>Session 3 (2:30 PM – 6:00 PM)</option>
                    </select>
                  ) : service === 'Practice Nets' ? (
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    >
                      <option>Morning Session (6:00 AM – 9:00 AM) · ₹500/hr</option>
                      <option>Night Floodlight Session (6:30 PM – 10:00 PM) · ₹800/hr</option>
                    </select>
                  ) : service === 'Bowling Machine' ? (
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    >
                      <option>1 Hour (200 Balls) – Morning Slot</option>
                      <option>1 Hour (200 Balls) – Evening Slot</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Quarterly or Yearly Membership"
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    />
                  )}
                </div>
              </div>

              {/* Row 4: Number of players & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Players
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={playersCount}
                    onChange={(e) => setPlayersCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Additional Message or Special Requirements
                  </label>
                  <input
                    type="text"
                    placeholder="Specific requests, team name, umpire or ball requirement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="unified-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 accent-[#22c55e]"
                />
                <label htmlFor="unified-terms" className="text-xs text-slate-600 dark:text-slate-400">
                  I have read and accept the{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-[#15803d] dark:text-[#4ade80] underline hover:text-[#16a34a] dark:hover:text-[#84cc16] cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                  . I acknowledge that submitting this enquiry does not confirm the booking until confirmed by KSM management.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Session Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
