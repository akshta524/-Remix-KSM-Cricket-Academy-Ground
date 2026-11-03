import React, { useState } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedSection(expandedSection === idx ? null : idx);
  };

  const terms = [
    {
      num: '01',
      title: 'Booking Confirmation',
      content:
        'Submission of an online enquiry does not guarantee a slot. A ground slot, practice net, or machine session is confirmed only after slot verification and receipt of the required advance fee as verified by KSM Cricket Academy & Ground management. Written confirmation via SMS/WhatsApp will be issued.'
    },
    {
      num: '02',
      title: 'Advance Payment',
      content:
        'To hold any weekend or weekday ground session, an advance payment or full fee must be transferred via authorized UPI (PhonePe) channels. Unpaid slots remain open for other teams.'
    },
    {
      num: '03',
      title: 'Cancellation & Refunds',
      content:
        'Cancellations must be communicated at least 48 hours prior to the scheduled match slot for a rescheduling credit. Cancellations made within 24 hours of the match are non-refundable. Rescheduling is subject to available dates.'
    },
    {
      num: '04',
      title: 'Reporting Time',
      content:
        'Teams and training squads must report at least 30 minutes prior to their scheduled session to allow for warm-up, toss, and kit preparation. Delay by teams does not entitle them to an extension of time beyond their designated slot.'
    },
    {
      num: '05',
      title: 'Slot Timings',
      content:
        'Matches and training must conclude strictly at the end of the allotted session (Session 1: 7:30 AM – 10:30 AM; Session 2: 10:30 AM – 2:00 PM; Session 3: 2:30 PM – 6:00 PM). Ground preparation for the next session begins immediately.'
    },
    {
      num: '06',
      title: 'Ground & Facility Usage',
      content:
        'Players must wear proper cricket spikes or non-marking sports footwear. Metal spikes are strictly prohibited on the turf clay wicket unless specifically approved. Respect the outfield, boundary ropes, sight screens, and pavilion chairs.'
    },
    {
      num: '07',
      title: 'Bowling Machine',
      content:
        'The bowling machine may only be operated by or under the direct supervision of KSM academy operators. Batters must wear full protective cricket gear including an approved cricket helmet with grille, pads, gloves, and abdominal guard.'
    },
    {
      num: '08',
      title: 'Cricket Balls & Equipment',
      content:
        'Teams may purchase approved tournament-grade white or red leather cricket balls from the pavilion. Players are responsible for their personal cricket gear and equipment bags.'
    },
    {
      num: '09',
      title: 'Safety',
      content:
        'Cricket involves hard leather balls traveling at high speeds. All participants engage at their own discretion. First aid kit is maintained at the ground desk. Players must adhere to all safety guidelines and wear mandatory protective gear.'
    },
    {
      num: '10',
      title: 'Weather & Unforeseen Circumstances',
      content:
        'In the event of unplayable weather (heavy rain, waterlogging, or power outages during floodlight hours), match slots may be rescheduled to another mutually agreed date based on slot availability. Management is not liable for travel expenses.'
    },
    {
      num: '11',
      title: 'Academy Admissions',
      content:
        'Admission is open to youth aged 10–19 years. Fees paid for Quarterly, 6 Months, or Yearly memberships are non-transferable and non-refundable. Consistent discipline, prompt attendance, and respect for coaches and fellow trainees are mandatory.'
    },
    {
      num: '12',
      title: 'Hostel Facility',
      content:
        'The hostel is exclusively for enrolled academy students. Strict curfews, cleanliness in dormitories, and decorum must be observed. Insubordination or violation of hostel rules will lead to immediate expulsion without fee refund.'
    },
    {
      num: '13',
      title: 'Prohibited Activities',
      content:
        'Smoking, alcohol consumption, chewing tobacco, illicit substances, littering, and foul language are strictly prohibited across the entire KSM Cricket Academy & Ground premises. Violators will be evicted immediately.'
    },
    {
      num: '14',
      title: 'Management Rights',
      content:
        'KSM Cricket Academy & Ground management reserves the right to deny admission, cancel bookings, reschedule fixtures for maintenance or official tournament duties, and modify regulations as deemed necessary for player safety and facility integrity.'
    },
    {
      num: '15',
      title: 'Acceptance of Terms',
      content:
        'By submitting an online booking, admission enquiry, or making a payment, the customer, team captain, player, or guardian explicitly acknowledges and agrees to be bound by all these Terms & Conditions.'
    }
  ];

  return (
    <section id="terms" className="py-20 bg-slate-50 dark:bg-[#050e07] border-t border-slate-200 dark:border-[#132c1a] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>17</span>
            <span>·</span>
            <span>Rules & Operational Guidelines</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Terms & <span className="text-[#16a34a] dark:text-[#4ade80]">Conditions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Please review the official regulations governing cricket ground bookings, practice nets, bowling machine usage, academy coaching, and hostel accommodation.
          </p>
        </div>

        <div className="space-y-3">
          {terms.map((item, idx) => {
            const isExpanded = expandedSection === idx;
            return (
              <div
                key={item.num}
                className="rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#0d2616] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#15803d] dark:text-[#84cc16]">
                      {item.num}
                    </span>
                    <h3 className="text-base font-bold font-['Barlow_Condensed'] uppercase tracking-wide text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#15341d] bg-slate-50/60 dark:bg-[#07150c]">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-emerald-50 dark:bg-[#0a1e12] border border-emerald-200 dark:border-[#1c4226] text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
            <span>KSM Cricket Academy & Ground Management, Adibatla</span>
          </div>
          <span className="text-[#15803d] dark:text-[#84cc16] font-mono">Updated Season 2026</span>
        </div>
      </div>
    </section>
  );
};
