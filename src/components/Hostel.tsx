import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Loader2
} from 'lucide-react';
import type { HostelEnquiry } from '../types/index.js';
import { api, formatHostelWhatsApp, createWhatsAppUrl } from '../services/api.js';

interface HostelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostelModal: React.FC<HostelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('14');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDuration, setPreferredDuration] = useState('1 Year (Full Season)');
  const [roomType, setRoomType] = useState<'AC' | 'Non-AC'>('AC');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEnquiry, setSuccessEnquiry] = useState<HostelEnquiry | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !phone.trim()) {
      setError('Please provide student name, parent name, and contact number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.submitHostelEnquiry({
        studentName: studentName.trim(),
        age: parseInt(age, 10) || 14,
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDuration,
        roomType,
        message: message.trim()
      });

      setSuccessEnquiry(res.enquiry);
    } catch (err: any) {
      setError(err.message || 'Failed to submit hostel enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#22c55e]/50 p-6 sm:p-8 shadow-2xl my-8 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#050e07] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successEnquiry ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-[#11311b] border border-emerald-300 dark:border-[#22c55e] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Enquiry ID: {successEnquiry.id}</span>
            <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
              Hostel Enquiry Submitted
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
              Our residential hostel warden and academy management will contact you with room availability and boarding procedures.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#173a21] text-left text-xs space-y-1 mb-6 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Student:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{successEnquiry.studentName} (Age: {successEnquiry.age})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Room Type:</span>
                <span className="font-semibold text-[#15803d] dark:text-[#4ade80]">{successEnquiry.roomType} Accommodation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{successEnquiry.preferredDuration}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={createWhatsAppUrl(formatHostelWhatsApp(successEnquiry))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send via WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Player Boarding Facility</span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1">
                Enquire About Hostel
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                KSM Academy Hostel, Nadargul Rural near Adibatla
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Praneeth Naidu"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="22"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Parent's Name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 93922 59363"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={preferredDuration}
                    onChange={(e) => setPreferredDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  >
                    <option>1 Year (Full Season)</option>
                    <option>6 Months (Semester)</option>
                    <option>3 Months (Quarterly)</option>
                    <option>Summer Camp Intensive (1-2 Months)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="AC">AC Facility Available</option>
                    <option value="Non-AC">Non-AC Facility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message or Specific Inquiries
                </label>
                <textarea
                  rows={2}
                  placeholder="Hometown, special dietary needs, or questions about boarding..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Submit Hostel Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Hostel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { title: 'Accommodation for Academy Students', desc: 'Secure, clean residential rooms dedicated exclusively to academy players.' },
    { title: 'AC Facility Available', desc: 'Air-conditioned rooms ensuring restful recovery between grueling training sessions.' },
    { title: 'Player-Friendly Environment', desc: 'Disciplined sporting culture, nutritious dining guidance, and study spaces.' },
    { title: 'Camp Training Integration', desc: 'Immediate ground access for early 6:00 AM fitness and late-evening floodlight drills.' },
    { title: 'Yearly Membership Benefits', desc: 'Yearly membership includes camp fee and two competitive matches weekly on prepared wicket.' }
  ];

  return (
    <section id="hostel" className="py-20 bg-white dark:bg-[#07140b] border-t border-slate-200 dark:border-[#15341d] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Gallery of Hostel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1e4528] shadow-2xl aspect-[4/3]">
              <img
                src="/src/assets/images/academy_hostel_room_1793601203458.jpg"
                alt="KSM Cricket Academy Hostel Room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase text-[#4ade80] dark:text-[#84cc16]">On-Campus Accommodation</span>
                <h4 className="text-lg font-bold font-['Barlow_Condensed'] uppercase tracking-wide">
                  Clean, Air-Conditioned Athlete Dormitories
                </h4>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#16351f] text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Located near Nadargul Rural, Adibatla</span>
              <span className="text-[#15803d] dark:text-[#4ade80] font-mono">24/7 Security & Warden</span>
            </div>
          </div>

          {/* Right Column: Info & Enquire Action */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
              <span>12</span>
              <span>·</span>
              <span>Residential Academy</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight leading-none mb-4">
              Academy Hostel <span className="text-[#16a34a] dark:text-[#4ade80]">near Nadargul</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
              Hostel facility is available for academy players coming from various districts of Telangana and other states.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feat, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] shadow-sm">
                  <span className="text-sm font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white block mb-0.5">
                    {feat.title}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="py-3.5 px-6 rounded-lg text-sm font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Building2 className="w-4 h-4" />
              <span>Enquire About Hostel</span>
            </button>
          </div>
        </div>
      </div>

      <HostelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
