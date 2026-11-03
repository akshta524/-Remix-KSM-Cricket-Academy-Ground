import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  Mail,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { createWhatsAppUrl } from '../services/api.js';

export const Contact: React.FC = () => {
  const address = 'Nadargul Rural, Adibatla, Telangana 501510';
  const plusCode = '7G5X+P9 Adibatla, Telangana';
  const phone = '+91 93922 59363';
  const cleanPhone = '919392259363';

  // Google Maps pin URL for Adibatla ground
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('KSM Cricket Academy and Ground Nadargul Rural Adibatla Telangana 501510')}`;

  const defaultWhatsMessage = `Hello KSM Cricket Academy & Ground, I would like to enquire about cricket ground slot booking and academy details.`;

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-[#061009] border-t border-slate-200 dark:border-[#142e1b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>18</span>
            <span>·</span>
            <span>Reach Ground Management</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            Contact <span className="text-[#16a34a] dark:text-[#4ade80]">KSM Cricket Academy & Ground</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Get in touch for match slot confirmations, tournament scheduling, academy assessments, and hostel reservations in Adibatla.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Direct Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-xl">
              <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16] block mb-2">Ground Address</span>
              <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-4">
                KSM Cricket Academy & Ground
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Address:</span>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Nadargul Rural, Adibatla,<br />
                      Telangana 501510
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-[#15803d] dark:text-[#84cc16] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Google Plus Code:</span>
                    <p className="font-mono text-[#15803d] dark:text-[#4ade80]">
                      7G5X+P9 Adibatla, Telangana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Official Phone:</span>
                    <a
                      href="tel:+919392259363"
                      className="font-mono text-base font-bold text-slate-900 dark:text-white hover:text-[#16a34a] dark:hover:text-[#4ade80] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Operational Hours:</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      Nets & Machine: 24/7 (Subject to schedule)<br />
                      Ground Match Slots: 7:30 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Prominent Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={`tel:+${cleanPhone}`}
                  className="py-3 px-3 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <a
                  href={createWhatsAppUrl(defaultWhatsMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Us</span>
                </a>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2717] dark:hover:bg-[#143921] border border-slate-300 dark:border-[#22c55e]/50 text-slate-800 dark:text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#15803d] dark:text-[#84cc16]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#173a21] text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] shrink-0" />
              <span>
                Nearby landmarks: Near TCS Synergy Park Adibatla & Wonderla Outer Ring Road corridor, accessible from LB Nagar & Shamshabad.
              </span>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1e4528] shadow-2xl bg-white dark:bg-[#091a0f] aspect-[4/3] sm:aspect-[16/10] relative">
              <iframe
                title="KSM Cricket Academy & Ground Adibatla Location Map"
                src="https://maps.google.com/maps?q=17.2718,78.5412&hl=en&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#07140b]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#22c55e]/40 text-slate-900 dark:text-white text-xs flex items-center gap-2 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                <span className="font-semibold font-['Barlow_Condensed'] uppercase">
                  Adibatla · Nadargul Rural Ground
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
