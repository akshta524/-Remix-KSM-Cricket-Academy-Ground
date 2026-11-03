import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api.js';

interface PhonePePaymentProps {
  initialBookingId?: string;
  initialAmount?: number;
}

export const PhonePePayment: React.FC<PhonePePaymentProps> = ({
  initialBookingId = '',
  initialAmount = 0
}) => {
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [amount, setAmount] = useState(initialAmount > 0 ? initialAmount.toString() : '');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPayment, setSubmittedPayment] = useState<any | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const phonePeUpiId = '9392259363@ybl';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(phonePeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId.trim() || !amount.trim() || !utrNumber.trim()) {
      setError('Please provide your Booking ID, Amount paid, and the 12-digit UTR/Transaction number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.submitPayment({
        bookingType: bookingId.startsWith('KSM-GB') ? 'ground' : bookingId.startsWith('KSM-NET') ? 'nets' : bookingId.startsWith('KSM-BM') ? 'bowling' : 'ground',
        bookingId: bookingId.trim(),
        amount: parseFloat(amount),
        payerName: payerName.trim() || 'Cricket Player',
        payerPhone: payerPhone.trim(),
        utrNumber: utrNumber.trim(),
        notes: notes.trim()
      });

      setSubmittedPayment(res.payment);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment details.');
    } finally {
      setSubmitting(false);
    }
  };

  const paymentSteps = [
    { num: '01', title: 'Open PhonePe', desc: 'Launch the PhonePe app on your mobile device.' },
    { num: '02', title: 'Scan the QR Code', desc: 'Scan the official KSM Cricket Academy QR code or enter UPI ID.' },
    { num: '03', title: 'Complete the Payment', desc: 'Verify recipient name as KSM Cricket Academy and approve amount.' },
    { num: '04', title: 'Keep Payment Confirmation', desc: 'Note down the 12-digit UTR/Transaction ID and take a screenshot.' },
    { num: '05', title: 'Submit UTR or Share Screenshot', desc: 'Submit the UTR below or share via WhatsApp to confirm the slot.' }
  ];

  return (
    <section id="payment" className="py-20 bg-slate-100 dark:bg-[#06120b] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>16</span>
            <span>·</span>
            <span>Direct Payment Gateway</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Make <span className="text-[#16a34a] dark:text-[#4ade80]">a Payment</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Scan the QR code below using PhonePe to make your payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: PhonePe QR Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1a1333] via-[#0e2417] to-[#07150c] text-white border border-[#5f259f]/50 shadow-2xl relative overflow-hidden">
              {/* PhonePe Header Branding */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5f259f] flex items-center justify-center font-bold text-white text-xl shadow-md">
                    पे
                  </div>
                  <div>
                    <span className="font-['Barlow_Condensed'] text-xl font-bold tracking-wider text-white block uppercase">
                      Phone<span className="text-[#9d4edd]">Pe</span>
                    </span>
                    <span className="text-[10px] text-slate-300 uppercase tracking-widest font-mono">
                      Verified Merchant QR
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded bg-[#5f259f]/30 border border-[#9d4edd]/50 text-[10px] font-mono text-purple-200">
                  BHIM UPI
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl shadow-xl max-w-[240px] mx-auto text-center mb-6">
                <div className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-2 bg-slate-50">
                  {/* Clean SVG QR Code Representation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Corners */}
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#0f172a" />
                    <rect x="10" y="10" width="15" height="15" rx="1.5" fill="#ffffff" />
                    <rect x="13.5" y="13.5" width="8" height="8" rx="1" fill="#5f259f" />

                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#0f172a" />
                    <rect x="75" y="10" width="15" height="15" rx="1.5" fill="#ffffff" />
                    <rect x="78.5" y="13.5" width="8" height="8" rx="1" fill="#5f259f" />

                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#0f172a" />
                    <rect x="10" y="75" width="15" height="15" rx="1.5" fill="#ffffff" />
                    <rect x="13.5" y="78.5" width="8" height="8" rx="1" fill="#5f259f" />

                    {/* QR Matrix Grid Dots */}
                    <rect x="36" y="8" width="5" height="5" fill="#1e293b" />
                    <rect x="46" y="8" width="5" height="5" fill="#1e293b" />
                    <rect x="56" y="8" width="5" height="5" fill="#1e293b" />

                    <rect x="36" y="18" width="5" height="5" fill="#1e293b" />
                    <rect x="50" y="18" width="5" height="5" fill="#5f259f" />

                    <rect x="8" y="36" width="5" height="5" fill="#1e293b" />
                    <rect x="18" y="44" width="5" height="5" fill="#1e293b" />
                    <rect x="8" y="52" width="5" height="5" fill="#1e293b" />

                    <rect x="36" y="36" width="28" height="28" rx="4" fill="#0b1710" />
                    <circle cx="50" cy="50" r="10" fill="#22c55e" />
                    <circle cx="50" cy="50" r="5" fill="#ffffff" />

                    <rect x="70" y="36" width="5" height="5" fill="#1e293b" />
                    <rect x="85" y="44" width="5" height="5" fill="#1e293b" />
                    <rect x="75" y="55" width="5" height="5" fill="#1e293b" />

                    <rect x="36" y="72" width="5" height="5" fill="#1e293b" />
                    <rect x="48" y="80" width="5" height="5" fill="#1e293b" />
                    <rect x="60" y="72" width="5" height="5" fill="#1e293b" />
                    <rect x="72" y="85" width="5" height="5" fill="#1e293b" />
                    <rect x="84" y="76" width="5" height="5" fill="#1e293b" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase block mt-1">
                  KSM CRICKET ACADEMY
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Adibatla · 9392259363
                </span>
              </div>

              {/* UPI ID Copy Bar */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] text-slate-300 block uppercase font-mono">Official UPI ID</span>
                  <span className="text-xs font-mono font-bold text-[#4ade80]">{phonePeUpiId}</span>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 rounded bg-[#0e2717] hover:bg-[#143921] border border-[#22c55e]/40 text-xs text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Pay via PhonePe Button */}
              <a
                href={`upi://pay?pa=${phonePeUpiId}&pn=KSM%20Cricket%20Academy&cu=INR`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5f259f] hover:bg-[#722ebc] text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-2 mb-4 transition-colors shadow-lg shadow-[#5f259f]/20 cursor-pointer"
              >
                <span>Pay via PhonePe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* MANDATORY DISCLAIMER AS REQUESTED */}
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-[11px] text-amber-200 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-1">Important Notice:</span>
                Payment does not confirm a booking until it is verified and confirmed by KSM Cricket Academy & Ground management.
              </div>
            </div>
          </div>

          {/* Right Column: Instructions & Submit UTR Reference */}
          <div className="lg:col-span-7 space-y-6">
            {/* 5 Step Payment Instructions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] shadow-sm">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block mb-3">
                Scan & Pay Instructions
              </span>

              <div className="space-y-3">
                {paymentSteps.map((step) => (
                  <div key={step.num} className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-[#15803d] dark:text-[#84cc16] bg-emerald-50 dark:bg-[#050e07] border border-emerald-200 dark:border-[#183a21] px-2 py-0.5 rounded shrink-0 mt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {step.title}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit UTR / Verification Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-xl">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block mb-1">
                Verify Your Payment
              </span>
              <h3 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-4">
                Submit 12-Digit UTR / Transaction Reference
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {submittedPayment ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-[#11311b] border border-emerald-300 dark:border-[#22c55e] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-1">
                    Payment Details Submitted!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    UTR <span className="font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{submittedPayment.utrNumber}</span> recorded against {submittedPayment.bookingId}. Our management will verify the statement and confirm your reservation.
                  </p>
                  <button
                    onClick={() => setSubmittedPayment(null)}
                    className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white text-xs font-bold font-['Barlow_Condensed'] uppercase cursor-pointer"
                  >
                    Submit Another Reference
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitUtr} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Booking / Enquiry ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KSM-GB-102"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Amount Paid (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 3000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Payer Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name on PhonePe account"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        12-Digit UTR / Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 482910481920"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Notes or Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Optional notes or contact phone..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting UTR...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Payment for Verification</span>
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
