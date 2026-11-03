import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { GroundBookingSection } from './components/GroundBooking.js';
import { LiveStreaming } from './components/LiveStreaming.js';
import { Tournaments } from './components/Tournaments.js';
import { PracticeNets } from './components/PracticeNets.js';
import { BowlingMachine } from './components/BowlingMachine.js';
import { Academy } from './components/Academy.js';
import { Pricing } from './components/Pricing.js';
import { Facilities } from './components/Facilities.js';
import { Hostel } from './components/Hostel.js';
import { Gallery } from './components/Gallery.js';
import { AboutUs } from './components/AboutUs.js';
import { UnifiedBookingForm } from './components/UnifiedBookingForm.js';
import { PhonePePayment } from './components/PhonePePayment.js';
import { TermsAndConditions } from './components/TermsAndConditions.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';
import { AdmissionModal } from './components/AdmissionModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { api } from './services/api.js';
import type { WebsiteSettings } from './types/index.js';
import { Bell, Info } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  // Quick payment prefill state
  const [activePaymentPrefill, setActivePaymentPrefill] = useState<{
    bookingId: string;
    amount: number;
  } | null>(null);

  // Load public settings
  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch((err) => console.log('Notice: using default settings', err));
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPayment = (bookingId: string, amount: number) => {
    setActivePaymentPrefill({ bookingId, amount });
    scrollToSection('payment');
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#050b07] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-[#22c55e] selection:text-black transition-colors">
      {/* Optional Top Announcement Notice */}
      {settings?.noticeBanner && (
        <div className="bg-emerald-50 dark:bg-[#0b2413] border-b border-emerald-200 dark:border-[#1b3d23] px-4 py-2 text-center text-xs text-emerald-900 dark:text-slate-200 flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5 text-[#15803d] dark:text-[#84cc16] shrink-0" />
          <span className="font-medium">{settings.noticeBanner}</span>
        </div>
      )}

      {/* Sticky Header Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAdmissionModal={() => setIsAdmissionModalOpen(true)}
        isStreamingActive={settings?.liveStreamActive ?? false}
      />

      {/* Main Content Stream */}
      <main className="flex-1">
        {/* 03 Hero Section */}
        <Hero
          onBookGroundClick={() => scrollToSection('ground-booking')}
          onExploreAcademyClick={() => scrollToSection('academy')}
        />

        {/* 04 Cricket Ground Booking System */}
        <GroundBookingSection
          onPaymentClick={handleOpenPayment}
        />

        {/* 05 360° Live Streaming Section */}
        <LiveStreaming
          isStreamingActive={settings?.liveStreamActive ?? true}
          streamTitle={settings?.liveStreamTitle || 'Adibatla Premier League 2026 - Match 9: Nadargul Super Kings vs Telangana Warriors'}
          onToggleStreamActive={(active) => {
            setSettings(prev => prev ? { ...prev, liveStreamActive: active } : null);
            api.updateSettings({ liveStreamActive: active }).catch(console.error);
          }}
        />

        {/* 05.1 Official Tournaments & Leagues Section */}
        <Tournaments
          onWatchLiveClick={() => scrollToSection('live-streaming')}
          onBookGroundClick={() => scrollToSection('ground-booking')}
        />

        {/* 06 Practice Nets Booking */}
        <PracticeNets
          onPaymentClick={handleOpenPayment}
        />

        {/* 07 Bowling Machine Booking */}
        <BowlingMachine
          onPaymentClick={handleOpenPayment}
        />

        {/* 08 KSM Cricket Academy */}
        <Academy />

        {/* 09 Complete Pricing Section */}
        <Pricing
          onGroundClick={() => scrollToSection('ground-booking')}
          onNetsClick={() => scrollToSection('practice-nets')}
          onBowlingClick={() => scrollToSection('bowling-machine')}
          onAcademyClick={() => setIsAdmissionModalOpen(true)}
          onPaymentClick={() => scrollToSection('payment')}
        />

        {/* 11 Training Facilities Section (13 facilities) */}
        <Facilities />

        {/* 12 Hostel Facility near Nadargul */}
        <Hostel />

        {/* 13 Ground Gallery (10 categories with lightbox) */}
        <Gallery />

        {/* 14 About Us Section (Google reviews 3.9/5 from 18 reviews) */}
        <AboutUs />

        {/* 15 Unified Request a Session Booking Enquiry Form */}
        <UnifiedBookingForm
          onOpenTerms={() => scrollToSection('terms')}
          onPaymentClick={handleOpenPayment}
        />

        {/* 16 PhonePe Payment Section */}
        <PhonePePayment
          initialBookingId={activePaymentPrefill?.bookingId}
          initialAmount={activePaymentPrefill?.amount}
        />

        {/* 17 Terms & Conditions Section (all 15 clauses) */}
        <TermsAndConditions />

        {/* 18 Contact Section with Google Maps Embed */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAdmission={() => setIsAdmissionModalOpen(true)}
        onOpenTerms={() => scrollToSection('terms')}
      />

      {/* Standalone Admission Modal */}
      <AdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

      {/* 19 Admin Dashboard Control Room */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          // Refresh settings in case live stream or banner was changed
          api.getSettings().then(setSettings).catch(console.error);
        }}
      />
    </div>
  );
}
