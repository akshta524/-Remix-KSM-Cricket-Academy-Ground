import React, { useState } from 'react';
import {
  X,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Loader2,
  Calendar,
  Phone,
  Mail,
  Home,
  Award
} from 'lucide-react';
import type { AcademyAdmission } from '../types/index.js';
import { api, formatAdmissionWhatsApp, createWhatsAppUrl } from '../services/api.js';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgram?: string;
  initialMembership?: 'Quarterly' | '6 Months' | 'Yearly';
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  initialProgram = 'Batting',
  initialMembership = 'Quarterly'
}) => {
  if (!isOpen) return null;

  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('14');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');
  const [trainingProgram, setTrainingProgram] = useState(initialProgram);
  const [membership, setMembership] = useState<'Quarterly' | '6 Months' | 'Yearly'>(initialMembership);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successAdmission, setSuccessAdmission] = useState<AcademyAdmission | null>(null);

  const feeMap = {
    Quarterly: 10000,
    '6 Months': 20000,
    Yearly: 40000
  };

  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const diff = Date.now() - birth.getTime();
      const calculatedAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (calculatedAge >= 8 && calculatedAge <= 25) {
        setAge(calculatedAge.toString());
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !parentName.trim() || !parentPhone.trim()) {
      setError('Please fill in student name, parent/guardian name, and contact number.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (ageNum < 10 || ageNum > 19) {
      setError('Admission age for KSM Cricket Academy is 10–19 years.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.submitAdmission({
        studentName: studentName.trim(),
        dob,
        age: ageNum,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        email: email.trim(),
        address: address.trim(),
        previousExperience: previousExperience.trim(),
        trainingProgram,
        membership,
        fee: feeMap[membership],
        message: message.trim()
      });

      setSuccessAdmission(res.admission);
    } catch (err: any) {
      setError(err.message || 'Failed to submit admission enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#22c55e]/50 p-6 sm:p-8 shadow-2xl my-8 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#050e07] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successAdmission ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-[#11311b] border border-emerald-300 dark:border-[#22c55e] flex items-center justify-center text-[#15803d] dark:text-[#4ade80] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Application ID: {successAdmission.id}</span>
            <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
              Admission Enquiry Submitted!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
              Thank you for applying to KSM Cricket Academy. Our head coach and academy coordinators will review your details and contact you for the trial session.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#173a21] text-left text-xs space-y-1.5 mb-6 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Student:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{successAdmission.studentName} (Age: {successAdmission.age})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Program:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{successAdmission.trainingProgram}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Membership:</span>
                <span className="font-semibold text-[#15803d] dark:text-[#4ade80]">{successAdmission.membership} (₹{successAdmission.fee.toLocaleString('en-IN')})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Parent Contact:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{successAdmission.parentPhone}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={createWhatsAppUrl(formatAdmissionWhatsApp(successAdmission))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Application on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Official Enrollment Form</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-0.5">
                Academy Admission Enquiry
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                KSM Cricket Academy, Nadargul Rural, Adibatla · Admission Age: 10–19 Years
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Student details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Varma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age (10–19 Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="19"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Srinivas Varma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 93922 59363"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    placeholder="Area, Colony, Adibatla / Hyderabad"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              {/* Training Program & Membership */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Training Programme <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={trainingProgram}
                    onChange={(e) => setTrainingProgram(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  >
                    <option>Batting</option>
                    <option>Bowling</option>
                    <option>Wicket Keeping</option>
                    <option>Fielding</option>
                    <option>Fitness</option>
                    <option>All-Round Cricket Coaching</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selected Membership Tier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={membership}
                    onChange={(e) => setMembership(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Quarterly">Quarterly – ₹10,000</option>
                    <option value="6 Months">6 Months – ₹20,000</option>
                    <option value="Yearly">Yearly – ₹40,000 (Includes camp & 2 matches weekly)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Previous Cricket Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. School team, gully cricket, club matches, beginner"
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Message or Special Coaching Request
                </label>
                <textarea
                  rows={2}
                  placeholder="Any health notes, timing preference, or questions..."
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
                      <span>Submitting Admission Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Enquire About Admission</span>
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
