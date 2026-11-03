import React, { useState } from 'react';
import { Logo } from './Logo.js';
import {
  Menu,
  X,
  Phone,
  ShieldCheck,
  CalendarCheck,
  UserPlus,
  Radio,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenAdmissionModal: () => void;
  isStreamingActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenAdmissionModal,
  isStreamingActive = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Ground Booking', href: '#ground-booking' },
    { label: 'Facilities', href: '#facilities' },
    { label: '360° Live Streaming', href: '#live-streaming', hasStreamBadge: isStreamingActive },
    { label: 'Tournaments', href: '#tournaments' },
    { label: 'Academy', href: '#academy' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Hostel', href: '#hostel' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-[#1b3a24]/60 bg-white/95 dark:bg-[#061009]/95 backdrop-blur-md transition-colors duration-200">
      {/* Top micro bar for direct contact & location */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 border-b border-slate-200 dark:border-[#132719] bg-slate-100/70 dark:bg-transparent text-[11px] text-slate-600 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-slate-700 dark:text-slate-300">Nadargul Rural, Adibatla, Telangana 501510</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span>Plus Code: 7G5X+P9 Adibatla</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="tel:+919392259363"
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-[#4ade80] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#16a34a] dark:text-[#22c55e]" />
            <span>+91 93922 59363</span>
          </a>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main 3-zone Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 py-2.5 sm:py-3">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="shrink-0 group flex items-center"
        >
          <Logo size="sm" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-[13px] font-medium text-slate-700 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="relative whitespace-nowrap hover:text-emerald-700 dark:hover:text-white transition-colors py-1 flex items-center gap-1.5"
            >
              <span>{link.label}</span>
              {link.hasStreamBadge && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800/80 px-1.5 py-0.2 rounded">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-red-600 dark:text-red-500" /> LIVE
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Zone 3: Two Prominent Action Buttons + Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#0e2315] hover:bg-slate-200 dark:hover:bg-[#153420] border border-slate-300 dark:border-[#22c55e]/40 text-slate-700 dark:text-[#84cc16] transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('#ground-booking')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book a Ground Slot</span>
          </button>

          <button
            onClick={onOpenAdmissionModal}
            className="hidden xs:inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-slate-800 dark:text-white bg-emerald-50 dark:bg-[#0e2315] hover:bg-emerald-100 dark:hover:bg-[#153420] border border-emerald-300 dark:border-[#22c55e]/50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#84cc16]" />
            <span className="hidden sm:inline">Join Academy</span>
            <span className="sm:hidden">Join</span>
          </button>

          {/* Mobile menu toggle with full 44px touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white bg-slate-100 dark:bg-[#0d2113] border border-slate-300 dark:border-[#1b3a24] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-[#193522] bg-white dark:bg-[#07130b] px-4 pt-3 pb-8 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-slate-200 dark:border-[#152a1b]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('#ground-booking');
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold uppercase tracking-wider text-black bg-[#22c55e] hover:bg-[#16a34a] rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Slot</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmissionModal();
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-emerald-50 dark:bg-[#112918] border border-emerald-300 dark:border-[#22c55e]/40 rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4 text-[#16a34a] dark:text-[#84cc16]" />
              <span>Join Academy</span>
            </button>
          </div>

          <div className="flex flex-col space-y-0.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-[#4ade80] hover:bg-slate-100 dark:hover:bg-[#0c1f12] active:bg-emerald-50 dark:active:bg-[#122e1a] rounded-lg transition-colors"
              >
                <span>{link.label}</span>
                {link.hasStreamBadge && (
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-300 dark:border-red-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-[#152a1b] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-2">
            <a href="tel:+919392259363" className="flex items-center gap-1.5 text-[#16a34a] dark:text-[#22c55e] font-semibold py-1">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 93922 59363</span>
            </a>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white py-1"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white py-1"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
