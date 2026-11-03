import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  Calendar,
  Clock,
  Target,
  Trophy,
  Building2,
  CreditCard,
  Settings,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  FileSpreadsheet,
  Shield,
  Check
} from 'lucide-react';
import type {
  GroundBooking,
  NetsBooking,
  BowlingMachineBooking,
  AcademyAdmission,
  HostelEnquiry,
  PaymentSubmission,
  WebsiteSettings,
  Tournament,
  TournamentRegistration
} from '../types/index.js';
import {
  api,
  createWhatsAppUrl,
  formatTournamentRegistrationWhatsApp
} from '../services/api.js';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => sessionStorage.getItem('ksm_admin_token'));
  const [loginEmail, setLoginEmail] = useState('admin@ksmcricket.com');
  const [loginPassword, setLoginPassword] = useState('ksm@adibatla2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ground' | 'nets_bowling' | 'academy' | 'hostel' | 'tournaments' | 'payments' | 'settings' | 'reports'
  >('overview');

  // Data States
  const [loading, setLoading] = useState(false);
  const [groundBookings, setGroundBookings] = useState<GroundBooking[]>([]);
  const [netsBookings, setNetsBookings] = useState<NetsBooking[]>([]);
  const [bowlingBookings, setBowlingBookings] = useState<BowlingMachineBooking[]>([]);
  const [admissions, setAdmissions] = useState<AcademyAdmission[]>([]);
  const [hostelEnquiries, setHostelEnquiries] = useState<HostelEnquiry[]>([]);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentRegistrations, setTournamentRegistrations] = useState<TournamentRegistration[]>([]);
  const [, setWebsiteSettings] = useState<WebsiteSettings | null>(null);

  // Filters
  const [groundFilterDate, setGroundFilterDate] = useState('');
  const [groundFilterSession, setGroundFilterSession] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Settings Form State
  const [streamActive, setStreamActive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [noticeBanner, setNoticeBanner] = useState('');
  const [phonePeUpi, setPhonePeUpi] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [g, n, b, a, h, p, s, trn, trnReg] = await Promise.all([
        api.getGroundBookings(),
        api.getNetsBookings(),
        api.getBowlingBookings(),
        api.getAdmissions(),
        api.getHostelEnquiries(),
        api.getPayments(),
        api.getSettings(),
        api.getTournaments(),
        api.getTournamentRegistrations()
      ]);

      setGroundBookings(g);
      setNetsBookings(n);
      setBowlingBookings(b);
      setAdmissions(a);
      setHostelEnquiries(h);
      setPayments(p);
      setWebsiteSettings(s);
      setTournaments(trn);
      setTournamentRegistrations(trnReg);

      setStreamActive(s.liveStreamActive);
      setStreamTitle(s.liveStreamTitle);
      setNoticeBanner(s.noticeBanner);
      setPhonePeUpi(s.phonePeUpi);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadAllData();
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      setLoginError(null);
      const res = await api.adminLogin(loginEmail, loginPassword);
      if (res.success) {
        setAuthToken(res.token);
        sessionStorage.setItem('ksm_admin_token', res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    sessionStorage.removeItem('ksm_admin_token');
  };

  // Actions
  const handleGroundStatusChange = async (id: string, status: any) => {
    try {
      const updated = await api.updateGroundBooking(id, { status });
      setGroundBookings(prev => prev.map(item => item.id === id ? updated : item));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleGroundPaymentChange = async (id: string, paymentStatus: any) => {
    try {
      const updated = await api.updateGroundBooking(id, { paymentStatus });
      setGroundBookings(prev => prev.map(item => item.id === id ? updated : item));
    } catch {
      alert('Failed to update payment');
    }
  };

  const handleAdmissionStatusChange = async (id: string, status: any) => {
    try {
      const updated = await api.updateAdmission(id, { status });
      setAdmissions(prev => prev.map(item => item.id === id ? updated : item));
    } catch {
      alert('Failed to update admission status');
    }
  };

  const handleHostelStatusChange = async (id: string, status: any) => {
    try {
      const updated = await api.updateHostelEnquiry(id, { status });
      setHostelEnquiries(prev => prev.map(item => item.id === id ? updated : item));
    } catch {
      alert('Failed to update hostel status');
    }
  };

  const handleTournamentRegStatus = async (id: string, status: string) => {
    try {
      const updated = await api.updateTournamentRegistration(id, status);
      setTournamentRegistrations(prev => prev.map(item => item.id === id ? updated : item));
    } catch {
      alert('Failed to update tournament registration');
    }
  };

  const handleVerifyPayment = async (id: string, status: 'Verified' | 'Failed') => {
    try {
      const updated = await api.updatePayment(id, status);
      setPayments(prev => prev.map(item => item.id === id ? updated : item));
      loadAllData();
    } catch {
      alert('Failed to update payment status');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await api.updateSettings({
        liveStreamActive: streamActive,
        liveStreamTitle: streamTitle,
        noticeBanner,
        phonePeUpi
      });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch {
      alert('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Overview metrics
  const totalEnquiries =
    groundBookings.length + netsBookings.length + bowlingBookings.length + admissions.length + hostelEnquiries.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = groundBookings.filter(b => b.date === todayStr).length;
  const pendingGround = groundBookings.filter(b => b.status === 'Pending').length;
  const confirmedGround = groundBookings.filter(b => b.status === 'Confirmed').length;
  const cancelledGround = groundBookings.filter(b => b.status === 'Cancelled' || b.status === 'Rejected').length;
  const totalAdmissions = admissions.length;

  const totalRevenue = payments
    .filter(p => p.status === 'Verified')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Filtered Ground Bookings
  const filteredGroundBookings = groundBookings.filter(b => {
    if (groundFilterDate && b.date !== groundFilterDate) return false;
    if (groundFilterSession !== 'all' && b.session !== groundFilterSession) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const match =
        b.id.toLowerCase().includes(s) ||
        b.fullName.toLowerCase().includes(s) ||
        b.phone.includes(s) ||
        (b.teamName && b.teamName.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 dark:bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-7xl h-[95vh] rounded-2xl bg-white dark:bg-[#07130b] border border-slate-200 dark:border-[#1b3a24] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#050e07] border-b border-slate-200 dark:border-[#142e1b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#0e2717] border border-emerald-500/40 dark:border-[#22c55e]/40 flex items-center justify-center text-emerald-700 dark:text-[#4ade80]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-slate-900 dark:text-white">
                KSM Management Portal & Control Room
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Adibatla, Telangana · Ground Bookings & Academy Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0e2416] hover:bg-red-50 dark:hover:bg-red-950/60 border border-slate-200 dark:border-[#22c55e]/30 hover:border-red-300 dark:hover:border-red-700 text-xs text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-200 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#0b1c11] border border-slate-200 dark:border-[#193a23]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Not Authenticated: Render Secure Admin Login Card */}
        {!authToken ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 dark:bg-[#040906]">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1e4528] shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 dark:bg-[#0f2c18] border border-emerald-600 dark:border-[#22c55e] flex items-center justify-center text-emerald-700 dark:text-[#4ade80] mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                  Admin Authentication
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Access reserved for KSM Cricket Academy ground managers and administrative staff.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="text-[#15803d] dark:text-[#84cc16] font-bold block mb-0.5">Admin Credentials:</span>
                  Email: <span className="text-slate-900 dark:text-white font-mono">admin@ksmcricket.com</span><br />
                  Password: <span className="text-slate-900 dark:text-white font-mono">ksm@adibatla2026</span>
                </div>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-3 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-white dark:text-black bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Session...</span>
                    </>
                  ) : (
                    <span>Log In to Dashboard</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Interface */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-[#050e07] border-r border-slate-200 dark:border-[#142e1b] p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap text-left ${
                  activeTab === 'overview'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>A. Overview & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('ground')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap text-left ${
                  activeTab === 'ground'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>B. Ground Bookings</span>
                </div>
                {pendingGround > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40 rounded text-[10px] font-mono">
                    {pendingGround}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('nets_bowling')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap text-left ${
                  activeTab === 'nets_bowling'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>C. Nets & Bowling Machine</span>
              </button>

              <button
                onClick={() => setActiveTab('academy')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap text-left ${
                  activeTab === 'academy'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4" />
                  <span>D. Academy Admissions</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{admissions.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('hostel')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap text-left ${
                  activeTab === 'hostel'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>E. Hostel Management</span>
              </button>

              <button
                onClick={() => setActiveTab('tournaments')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap text-left ${
                  activeTab === 'tournaments'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4" />
                  <span>F. Tournaments & Cups</span>
                </div>
                {tournamentRegistrations.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 rounded text-[10px] font-mono">
                    {tournamentRegistrations.filter(r => r.status === 'Pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap text-left ${
                  activeTab === 'payments'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>G. Payment Verification</span>
                </div>
                {payments.filter(p => p.status === 'Submitted').length > 0 && (
                  <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 rounded text-[10px] font-mono">
                    {payments.filter(p => p.status === 'Submitted').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap text-left ${
                  activeTab === 'settings'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>G. Content & Streaming</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full p-2.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap text-left ${
                  activeTab === 'reports'
                    ? 'bg-emerald-100 dark:bg-[#153b22] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/40 dark:border-[#22c55e]/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c1f13]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>H. Reports & CSV Export</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-slate-200 dark:border-[#132c1a] text-[11px] text-slate-500 px-2">
                <span className="block text-[#15803d] dark:text-[#84cc16] font-semibold">KSM Admin Engine</span>
                <span>Adibatla Server v2.4</span>
              </div>
            </div>

            {/* Main Content Viewport */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-[#07130b] transition-colors">
              {loading ? (
                <div className="h-64 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#16a34a] dark:text-[#22c55e]" />
                  <span>Loading management database...</span>
                </div>
              ) : (
                <>
                  {/* TAB A: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <div>
                          <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                            Operations Overview
                          </h3>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Key performance indicators for ground slots, training nets, and academy admissions
                          </span>
                        </div>
                        <button
                          onClick={loadAllData}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0c1f13] hover:bg-slate-200 dark:hover:bg-[#143520] border border-slate-200 dark:border-[#1b3a24] text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#4ade80]" />
                          <span>Refresh</span>
                        </button>
                      </div>

                      {/* KPI Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                            Total Enquiries
                          </span>
                          <span className="text-3xl font-extrabold font-['Barlow_Condensed'] text-slate-900 dark:text-white">
                            {totalEnquiries}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Across all 5 services</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                            Today's Bookings
                          </span>
                          <span className="text-3xl font-extrabold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                            {todayBookings}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">{todayStr}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-[11px] font-mono uppercase text-amber-700 dark:text-amber-400 block mb-1">
                            Pending Approval
                          </span>
                          <span className="text-3xl font-extrabold font-['Barlow_Condensed'] text-amber-600 dark:text-amber-400">
                            {pendingGround}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Ground match slots</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                            Verified Revenue
                          </span>
                          <span className="text-3xl font-extrabold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">PhonePe payments verified</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-mono uppercase">Confirmed Bookings</span>
                          <span className="text-2xl font-bold font-['Barlow_Condensed'] text-emerald-600 dark:text-emerald-400">{confirmedGround}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-mono uppercase">Cancelled / Rejected</span>
                          <span className="text-2xl font-bold font-['Barlow_Condensed'] text-red-600 dark:text-red-400">{cancelledGround}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-mono uppercase">Academy Admissions</span>
                          <span className="text-2xl font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#84cc16]">{totalAdmissions}</span>
                        </div>
                      </div>

                      {/* Recent Ground Requests preview */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                            Recent Match Booking Requests
                          </h4>
                          <button
                            onClick={() => setActiveTab('ground')}
                            className="text-xs text-[#15803d] dark:text-[#4ade80] hover:underline font-semibold"
                          >
                            View All Ground Bookings →
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-100 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-2.5">ID</th>
                                <th className="p-2.5">Date & Session</th>
                                <th className="p-2.5">Customer</th>
                                <th className="p-2.5">Team</th>
                                <th className="p-2.5">Amount</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5">Payment</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {groundBookings.slice(0, 5).map(b => (
                                <tr key={b.id} className="hover:bg-slate-100 dark:hover:bg-[#0e2717]/40">
                                  <td className="p-2.5 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{b.id}</td>
                                  <td className="p-2.5">
                                    <span className="text-slate-900 dark:text-white font-medium block">{b.date}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.sessionName}</span>
                                  </td>
                                  <td className="p-2.5">
                                    <span className="text-slate-900 dark:text-white block">{b.fullName}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.phone}</span>
                                  </td>
                                  <td className="p-2.5">{b.teamName || '—'}</td>
                                  <td className="p-2.5 font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                                    ₹{b.price.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
                                      b.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800' :
                                      'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                                    }`}>
                                      {b.status}
                                    </span>
                                  </td>
                                  <td className="p-2.5">
                                    <span className={`text-[10px] font-mono ${b.paymentStatus === 'Verified' ? 'text-[#15803d] dark:text-[#4ade80]' : 'text-slate-500 dark:text-slate-400'}`}>
                                      {b.paymentStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB B: GROUND BOOKING MANAGEMENT */}
                  {activeTab === 'ground' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <div>
                          <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                            Ground Booking Management
                          </h3>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Approve slots, reject duplicates, mark payments verified, and override availability
                          </span>
                        </div>
                      </div>

                      {/* Filter Bar */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Filter by Match Date:</label>
                          <input
                            type="date"
                            value={groundFilterDate}
                            onChange={(e) => setGroundFilterDate(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a22] text-slate-900 dark:text-white text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Filter by Session:</label>
                          <select
                            value={groundFilterSession}
                            onChange={(e) => setGroundFilterSession(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a22] text-slate-900 dark:text-white text-xs"
                          >
                            <option value="all">All Sessions</option>
                            <option value="s1">Session 1 (7:30 AM – 10:30 AM)</option>
                            <option value="s2">Session 2 (10:30 AM – 2:00 PM)</option>
                            <option value="s3">Session 3 (2:30 PM – 6:00 PM)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Search ID / Customer / Team:</label>
                          <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a22] text-slate-900 dark:text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Bookings Table */}
                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-3">Booking ID</th>
                                <th className="p-3">Match Date</th>
                                <th className="p-3">Session & Time</th>
                                <th className="p-3">Customer & Contact</th>
                                <th className="p-3">Team & Players</th>
                                <th className="p-3">Rate</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {filteredGroundBookings.length === 0 ? (
                                <tr>
                                  <td colSpan={9} className="p-6 text-center text-slate-500">
                                    No ground bookings matched your filters.
                                  </td>
                                </tr>
                              ) : (
                                filteredGroundBookings.map(b => (
                                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-[#0e2717]/40">
                                    <td className="p-3 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">
                                      {b.id}
                                    </td>
                                    <td className="p-3">
                                      <span className="text-slate-900 dark:text-white font-medium block">{b.date}</span>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {b.isWeekend ? 'Weekend' : 'Weekday'}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span className="text-slate-900 dark:text-white block">{b.sessionName}</span>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{b.timing}</span>
                                    </td>
                                    <td className="p-3">
                                      <span className="text-slate-900 dark:text-white font-medium block">{b.fullName}</span>
                                      <span className="text-[11px] text-[#15803d] dark:text-[#4ade80] font-mono">{b.phone}</span>
                                      {b.email && <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[130px]">{b.email}</span>}
                                    </td>
                                    <td className="p-3">
                                      <span className="text-slate-900 dark:text-white block">{b.teamName || '—'}</span>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.playersCount} players</span>
                                    </td>
                                    <td className="p-3 font-bold font-['Barlow_Condensed'] text-base text-[#15803d] dark:text-[#4ade80]">
                                      ₹{b.price.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3">
                                      <select
                                        value={b.status}
                                        onChange={(e) => handleGroundStatusChange(b.id, e.target.value)}
                                        className={`px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-[#050e07] border ${
                                          b.status === 'Confirmed' ? 'text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' :
                                          b.status === 'Rejected' ? 'text-red-700 dark:text-red-400 border-red-300 dark:border-red-800' :
                                          'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                                        }`}
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </td>
                                    <td className="p-3">
                                      <select
                                        value={b.paymentStatus}
                                        onChange={(e) => handleGroundPaymentChange(b.id, e.target.value)}
                                        className="px-2 py-1 rounded text-xs bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-800 dark:text-slate-300"
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Verified">Verified</option>
                                        <option value="Failed">Failed</option>
                                      </select>
                                      {b.utrNumber && (
                                        <span className="text-[9px] font-mono text-[#15803d] dark:text-[#84cc16] block mt-0.5">
                                          UTR: {b.utrNumber}
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5">
                                        {b.status !== 'Confirmed' && (
                                          <button
                                            onClick={() => handleGroundStatusChange(b.id, 'Confirmed')}
                                            title="Quick Approve"
                                            className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                        {b.status !== 'Rejected' && (
                                          <button
                                            onClick={() => handleGroundStatusChange(b.id, 'Rejected')}
                                            title="Reject Slot"
                                            className="p-1 rounded bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800"
                                          >
                                            <XCircle className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB C: NETS & BOWLING MACHINE */}
                  {activeTab === 'nets_bowling' && (
                    <div className="space-y-6">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Practice Nets & Bowling Machine Enquiries
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Training bays schedule, machine operators, and customer enquiries
                        </span>
                      </div>

                      {/* Nets Table */}
                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] p-4">
                        <h4 className="text-base font-bold font-['Barlow_Condensed'] uppercase text-[#15803d] dark:text-[#4ade80] mb-3">
                          Practice Nets Bookings ({netsBookings.length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Date & Slot</th>
                                <th className="p-2">Session Type</th>
                                <th className="p-2">Duration</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Total Price</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {netsBookings.map(n => (
                                <tr key={n.id}>
                                  <td className="p-2 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{n.id}</td>
                                  <td className="p-2">{n.date} · {n.timing}</td>
                                  <td className="p-2 capitalize">{n.sessionType}</td>
                                  <td className="p-2">{n.durationHours} hr</td>
                                  <td className="p-2">{n.fullName} ({n.phone})</td>
                                  <td className="p-2 font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">₹{n.totalPrice}</td>
                                  <td className="p-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                                      {n.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Bowling Machine Table */}
                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] p-4">
                        <h4 className="text-base font-bold font-['Barlow_Condensed'] uppercase text-[#15803d] dark:text-[#4ade80] mb-3">
                          Bowling Machine Sessions ({bowlingBookings.length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Date & Time</th>
                                <th className="p-2">Balls / Sessions</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Total Price</th>
                                <th className="p-2">Drill Notes</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {bowlingBookings.map(bm => (
                                <tr key={bm.id}>
                                  <td className="p-2 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{bm.id}</td>
                                  <td className="p-2">{bm.date} at {bm.preferredTime}</td>
                                  <td className="p-2">{bm.sessionCount} hr ({bm.totalBalls} balls)</td>
                                  <td className="p-2">{bm.fullName} ({bm.phone})</td>
                                  <td className="p-2 font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">₹{bm.totalPrice}</td>
                                  <td className="p-2 text-slate-600 dark:text-slate-400 max-w-xs truncate">{bm.message || 'Standard inswing/outswing'}</td>
                                  <td className="p-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                                      {bm.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB D: ACADEMY ADMISSIONS */}
                  {activeTab === 'academy' && (
                    <div className="space-y-4">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Academy Admissions & Student Management
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Youth applicant details, membership packages (Quarterly, 6M, Yearly), and fee records
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-3">Applicant ID</th>
                                <th className="p-3">Student Name</th>
                                <th className="p-3">Age / DOB</th>
                                <th className="p-3">Parent & Contact</th>
                                <th className="p-3">Training Program</th>
                                <th className="p-3">Membership Tier</th>
                                <th className="p-3">Fee</th>
                                <th className="p-3">Application Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {admissions.map(adm => (
                                <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-[#0e2717]/40">
                                  <td className="p-3 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{adm.id}</td>
                                  <td className="p-3 font-medium text-slate-900 dark:text-white">{adm.studentName}</td>
                                  <td className="p-3">{adm.age} yrs <span className="text-slate-500 font-mono">({adm.dob})</span></td>
                                  <td className="p-3">
                                    <span className="text-slate-900 dark:text-white block">{adm.parentName}</span>
                                    <span className="text-[#15803d] dark:text-[#4ade80] font-mono">{adm.parentPhone}</span>
                                  </td>
                                  <td className="p-3">{adm.trainingProgram}</td>
                                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{adm.membership}</td>
                                  <td className="p-3 font-bold font-['Barlow_Condensed'] text-[#15803d] dark:text-[#4ade80]">
                                    ₹{adm.fee.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={adm.status}
                                      onChange={(e) => handleAdmissionStatusChange(adm.id, e.target.value)}
                                      className="px-2 py-1 rounded bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-xs font-semibold text-slate-800 dark:text-slate-200"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB E: HOSTEL MANAGEMENT */}
                  {activeTab === 'hostel' && (
                    <div className="space-y-4">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Academy Hostel Accommodation Enquiries
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Student boarding requests, room allocation (AC/Non-AC), and contact details
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Student Name</th>
                                <th className="p-3">Age</th>
                                <th className="p-3">Parent Name</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Room Type</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {hostelEnquiries.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-[#0e2717]/40">
                                  <td className="p-3 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{h.id}</td>
                                  <td className="p-3 font-medium text-slate-900 dark:text-white">{h.studentName}</td>
                                  <td className="p-3">{h.age} yrs</td>
                                  <td className="p-3">{h.parentName}</td>
                                  <td className="p-3 font-mono text-[#15803d] dark:text-[#4ade80]">{h.phone}</td>
                                  <td className="p-3">{h.preferredDuration}</td>
                                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{h.roomType}</td>
                                  <td className="p-3">
                                    <select
                                      value={h.status}
                                      onChange={(e) => handleHostelStatusChange(h.id, e.target.value)}
                                      className="px-2 py-1 rounded bg-white dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-xs font-semibold text-slate-800 dark:text-slate-200"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Allocated">Allocated</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: TOURNAMENTS & CUPS */}
                  {activeTab === 'tournaments' && (
                    <div className="space-y-6">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Tournaments & Team Entries Management
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Active league cups, tournament status, fixtures, and incoming team registration entries
                        </span>
                      </div>

                      {/* Tournament Cards Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tournaments.map(t => (
                          <div key={t.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23]">
                            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                              <span className="font-bold text-[#15803d] dark:text-[#84cc16]">{t.id}</span>
                              <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                                t.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                t.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <h4 className="text-base font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-1">
                              {t.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {t.format} · {t.prizePool}
                            </p>
                            <div className="pt-2 border-t border-slate-200 dark:border-[#142e1b] flex items-center justify-between text-[11px] font-mono text-slate-500">
                              <span>{t.dates}</span>
                              <span>{t.teamsCount} Teams</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Team Registrations Table */}
                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] overflow-hidden p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                            Incoming Team Registrations ({tournamentRegistrations.length})
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">
                            Squad submissions for upcoming cups
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-3">Reg ID</th>
                                <th className="p-3">Tournament</th>
                                <th className="p-3">Team Name</th>
                                <th className="p-3">Captain / Manager</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">City / Players</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {tournamentRegistrations.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="p-6 text-center text-slate-500">
                                    No team registrations received yet.
                                  </td>
                                </tr>
                              ) : (
                                tournamentRegistrations.map(r => (
                                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#0e2717]/40">
                                    <td className="p-3 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{r.id}</td>
                                    <td className="p-3 text-slate-900 dark:text-white font-medium">{r.tournamentName}</td>
                                    <td className="p-3 font-bold text-slate-900 dark:text-white">{r.teamName}</td>
                                    <td className="p-3">{r.captainName}</td>
                                    <td className="p-3 font-mono text-[#15803d] dark:text-[#4ade80]">{r.phone}</td>
                                    <td className="p-3">{r.city} ({r.playersCount} Players)</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                        r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                        r.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                      }`}>
                                        {r.status}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5">
                                        {r.status !== 'Approved' && (
                                          <button
                                            onClick={() => handleTournamentRegStatus(r.id, 'Approved')}
                                            className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold"
                                          >
                                            Approve
                                          </button>
                                        )}
                                        {r.status !== 'Rejected' && (
                                          <button
                                            onClick={() => handleTournamentRegStatus(r.id, 'Rejected')}
                                            className="px-2 py-1 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800 text-[11px]"
                                          >
                                            Reject
                                          </button>
                                        )}
                                        <a
                                          href={createWhatsAppUrl(formatTournamentRegistrationWhatsApp(r))}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 rounded bg-emerald-50 dark:bg-[#0c2415] text-[#16a34a] dark:text-[#4ade80] border border-emerald-300 dark:border-[#22c55e]/40"
                                          title="WhatsApp Captain"
                                        >
                                          WA
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB F: PAYMENT MANAGEMENT */}
                  {activeTab === 'payments' && (
                    <div className="space-y-4">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          PhonePe & UPI Payment Verifications
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Review submitted 12-digit UTR numbers against merchant bank statements and approve bookings
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-[#050e07] text-slate-600 dark:text-slate-400">
                              <tr>
                                <th className="p-3">Payment ID</th>
                                <th className="p-3">Booking ID</th>
                                <th className="p-3">Payer Name</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">12-Digit UTR Number</th>
                                <th className="p-3">Date Submitted</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a]">
                              {payments.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#0e2717]/40">
                                  <td className="p-3 font-mono text-[#15803d] dark:text-[#84cc16] font-bold">{p.id}</td>
                                  <td className="p-3 font-mono text-slate-900 dark:text-white">{p.bookingId}</td>
                                  <td className="p-3">{p.payerName}</td>
                                  <td className="p-3 font-bold font-['Barlow_Condensed'] text-base text-[#15803d] dark:text-[#4ade80]">
                                    ₹{p.amount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-[#050e07] px-2 py-1 rounded">
                                    {p.utrNumber}
                                  </td>
                                  <td className="p-3 text-[10px] text-slate-500 dark:text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                      p.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                                      p.status === 'Failed' ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800' :
                                      'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1.5">
                                      {p.status !== 'Verified' && (
                                        <button
                                          onClick={() => handleVerifyPayment(p.id, 'Verified')}
                                          className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-[#10301a] hover:bg-emerald-100 dark:hover:bg-[#154223] text-emerald-800 dark:text-[#4ade80] border border-emerald-500/50 dark:border-[#22c55e]/50 text-xs font-bold"
                                        >
                                          Verify & Confirm
                                        </button>
                                      )}
                                      {p.status !== 'Failed' && (
                                        <button
                                          onClick={() => handleVerifyPayment(p.id, 'Failed')}
                                          className="px-2 py-1 rounded bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800 text-xs"
                                        >
                                          Reject
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB G: WEBSITE SETTINGS & 360 STREAMING */}
                  {activeTab === 'settings' && (
                    <div className="max-w-3xl space-y-6">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Website & 360° Live Streaming Controls
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Toggle live broadcasting status, match banner, and payment QR details
                        </span>
                      </div>

                      {settingsSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
                          <span>Settings updated successfully across the website!</span>
                        </div>
                      )}

                      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] space-y-4 text-xs">
                        {/* Live Streaming Toggle */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white block">
                                360° Live Broadcast Stream Switch
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                When OFF, the website displays: "Live streaming is currently unavailable. Check back when the match begins."
                              </span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={streamActive}
                                onChange={(e) => setStreamActive(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22c55e]"></div>
                            </label>
                          </div>

                          {streamActive && (
                            <div>
                              <label className="block text-slate-700 dark:text-slate-300 mb-1">Current Match Broadcast Title:</label>
                              <input
                                type="text"
                                value={streamTitle}
                                onChange={(e) => setStreamTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#091a0f] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs"
                              />
                            </div>
                          )}
                        </div>

                        {/* Banner Notice */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                            Site Notice Announcement
                          </label>
                          <input
                            type="text"
                            value={noticeBanner}
                            onChange={(e) => setNoticeBanner(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs"
                          />
                        </div>

                        {/* PhonePe UPI ID */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                            Official PhonePe UPI ID
                          </label>
                          <input
                            type="text"
                            value={phonePeUpi}
                            onChange={(e) => setPhonePeUpi(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1b3a23] text-slate-900 dark:text-white text-xs font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={savingSettings}
                          className="py-2.5 px-6 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-white dark:text-black bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] transition-colors cursor-pointer"
                        >
                          {savingSettings ? 'Saving...' : 'Save Website Settings'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB H: REPORTS & CSV EXPORT */}
                  {activeTab === 'reports' && (
                    <div className="space-y-6">
                      <div className="pb-2 border-b border-slate-200 dark:border-[#142e1b]">
                        <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Operational Reports & CSV Exports
                        </h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Export complete datasets for matches, youth admissions, and financial audits
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Match Ground Data</span>
                            <h4 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
                              Ground Bookings Report
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                              Includes date, session, customer, phone, team, pricing, and booking confirmation status.
                            </p>
                          </div>
                          <a
                            href="/api/export/ground-bookings"
                            download="ksm_ground_bookings.csv"
                            className="py-2.5 px-4 rounded-lg bg-emerald-50 dark:bg-[#0e2717] hover:bg-emerald-100 dark:hover:bg-[#143921] border border-emerald-600/40 dark:border-[#22c55e]/50 text-slate-900 dark:text-white font-bold font-['Barlow_Condensed'] uppercase text-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4 text-[#15803d] dark:text-[#84cc16]" />
                            <span>Export Ground Bookings CSV</span>
                          </a>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Coaching Admissions</span>
                            <h4 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
                              Academy Admissions Report
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                              Includes student names, age, parent contacts, training program, and membership package.
                            </p>
                          </div>
                          <a
                            href="/api/export/admissions"
                            download="ksm_academy_admissions.csv"
                            className="py-2.5 px-4 rounded-lg bg-emerald-50 dark:bg-[#0e2717] hover:bg-emerald-100 dark:hover:bg-[#143921] border border-emerald-600/40 dark:border-[#22c55e]/50 text-slate-900 dark:text-white font-bold font-['Barlow_Condensed'] uppercase text-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4 text-[#15803d] dark:text-[#84cc16]" />
                            <span>Export Admissions CSV</span>
                          </a>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">Financial Transactions</span>
                            <h4 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mt-1 mb-2">
                              Payment Records Report
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                              Includes all 12-digit UTR numbers, amounts, payer names, and verification stamps.
                            </p>
                          </div>
                          <a
                            href="/api/export/payments"
                            download="ksm_payments.csv"
                            className="py-2.5 px-4 rounded-lg bg-emerald-50 dark:bg-[#0e2717] hover:bg-emerald-100 dark:hover:bg-[#143921] border border-emerald-600/40 dark:border-[#22c55e]/50 text-slate-900 dark:text-white font-bold font-['Barlow_Condensed'] uppercase text-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4 text-[#15803d] dark:text-[#84cc16]" />
                            <span>Export Payments CSV</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
