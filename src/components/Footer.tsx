import React from 'react';
import { Logo } from './Logo.js';
import {
  Phone,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  UserPlus
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAdmission: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenAdmission,
  onOpenTerms
}) => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#040a06] border-t border-slate-200 dark:border-[#122817] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Premier cricket infrastructure in Adibatla, Telangana. Offering a tournament match ground, 24/7 practice nets, electronic bowling machine, elite youth academy coaching, and air-conditioned athlete hostel accommodation.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
              <span>Nadargul Rural, Adibatla, Telangana 501510</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <span className="font-['Barlow_Condensed'] uppercase tracking-wider text-slate-900 dark:text-white font-bold text-sm block mb-3">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScroll('#ground-booking')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Ground Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#practice-nets')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Practice Nets (24/7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#bowling-machine')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Bowling Machine
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#live-streaming')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  360° Live Streaming
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#tournaments')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Tournaments & Leagues
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#pricing')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Pricing & Rates
                </button>
              </li>
            </ul>
          </div>

          {/* Academy & Campus */}
          <div>
            <span className="font-['Barlow_Condensed'] uppercase tracking-wider text-slate-900 dark:text-white font-bold text-sm block mb-3">
              Academy & Campus
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScroll('#academy')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Cricket Academy (10–19 yrs)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmission}
                  className="text-[#15803d] dark:text-[#4ade80] hover:text-[#16a34a] dark:hover:text-[#84cc16] font-semibold transition-colors"
                >
                  Admission Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#hostel')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Academy Hostel (AC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#facilities')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  13 Training Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#gallery')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div>
            <span className="font-['Barlow_Condensed'] uppercase tracking-wider text-slate-900 dark:text-white font-bold text-sm block mb-3">
              Help & Admin
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+919392259363"
                  className="text-slate-900 dark:text-white hover:text-[#16a34a] dark:hover:text-[#4ade80] transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                  <span>+91 93922 59363</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#payment')}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  PhonePe UPI Payment
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#0e2416] border border-emerald-600/30 dark:border-[#22c55e]/40 text-emerald-700 dark:text-[#4ade80] hover:bg-emerald-100 dark:hover:bg-[#163621] transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Staff / Admin Login</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-200 dark:border-[#102314] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {currentYear} KSM Cricket Academy & Ground. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-700 dark:text-slate-400">Train. Play. Compete.</span>
            <span>·</span>
            <span>Adibatla, Telangana 501510</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
