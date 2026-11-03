import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Medal,
  Award,
  ChevronRight,
  Radio,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Send,
  X
} from 'lucide-react';
import type {
  Tournament,
  TournamentRegistration
} from '../types/index.js';
import {
  api,
  createWhatsAppUrl,
  formatTournamentRegistrationWhatsApp
} from '../services/api.js';

interface TournamentsProps {
  onWatchLiveClick?: () => void;
  onBookGroundClick?: () => void;
}

export const Tournaments: React.FC<TournamentsProps> = ({
  onWatchLiveClick,
  onBookGroundClick
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournamentId, setActiveTournamentId] = useState<string>('TRN-APL-2026');
  const [activeSubTab, setActiveSubTab] = useState<'fixtures' | 'standings' | 'honours'>('fixtures');
  const [loading, setLoading] = useState(true);

  // Registration modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedTournamentForReg, setSelectedTournamentForReg] = useState<Tournament | null>(null);
  const [regForm, setRegForm] = useState({
    teamName: '',
    captainName: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    playersCount: '15',
    notes: ''
  });
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState<TournamentRegistration | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    api.getTournaments()
      .then(data => {
        if (data && data.length > 0) {
          setTournaments(data);
          setActiveTournamentId(data[0].id);
        }
      })
      .catch(err => console.error('Failed to load tournaments:', err))
      .finally(() => setLoading(false));
  }, []);

  const activeTournament = tournaments.find(t => t.id === activeTournamentId) || tournaments[0];

  const handleOpenRegister = (trn: Tournament) => {
    setSelectedTournamentForReg(trn);
    setRegForm({
      teamName: '',
      captainName: '',
      phone: '',
      email: '',
      city: 'Hyderabad',
      playersCount: '15',
      notes: ''
    });
    setRegSuccess(null);
    setRegError(null);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournamentForReg) return;

    if (!regForm.teamName.trim() || !regForm.captainName.trim() || !regForm.phone.trim()) {
      setRegError('Please provide team name, captain name, and contact phone.');
      return;
    }

    try {
      setSubmittingReg(true);
      setRegError(null);
      const res = await api.registerTournamentTeam(selectedTournamentForReg.id, {
        teamName: regForm.teamName.trim(),
        captainName: regForm.captainName.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email.trim(),
        city: regForm.city.trim(),
        playersCount: parseInt(regForm.playersCount, 10) || 15,
        notes: regForm.notes.trim()
      });

      if (res.success) {
        setRegSuccess(res.registration);
      }
    } catch (err: any) {
      setRegError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <section id="tournaments" className="py-20 bg-white dark:bg-[#050c07] border-t border-slate-200 dark:border-[#142e1b] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#16a34a] dark:text-[#84cc16] mb-2 uppercase tracking-wider font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Championships & Leagues</span>
              <span>·</span>
              <span>KSM Ground Adibatla</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
              Tournaments & <span className="text-[#16a34a] dark:text-[#4ade80]">League Cups</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              Official T20, youth, and corporate cricket tournaments hosted at KSM Cricket Ground. Explore live match scorecards, league tables, player honors, and team entry registrations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onBookGroundClick && (
              <button
                onClick={onBookGroundClick}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1e4528] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0c2214] text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider transition-colors"
              >
                Book Ground For Match
              </button>
            )}
            <a
              href="tel:+919392259363"
              className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] text-white dark:text-black text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <span>Host A Tournament</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <span>Loading tournament championships...</span>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#07130b] border border-slate-200 dark:border-[#16351f] text-center text-slate-500">
            No tournament data available right now.
          </div>
        ) : (
          <div>
            {/* Tournament Selector Pill Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {tournaments.map((trn) => {
                const isActive = trn.id === activeTournamentId;
                const isLive = trn.status === 'Ongoing';
                const isUpcoming = trn.status === 'Upcoming';

                return (
                  <button
                    key={trn.id}
                    onClick={() => {
                      setActiveTournamentId(trn.id);
                      setActiveSubTab('fixtures');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isActive
                        ? 'bg-emerald-50/80 dark:bg-[#092212] border-emerald-500 dark:border-[#22c55e] shadow-lg ring-1 ring-emerald-500/30'
                        : 'bg-slate-50/70 dark:bg-[#07130b] border-slate-200 dark:border-[#16351f] hover:border-emerald-400 dark:hover:border-[#22c55e]/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                        isLive
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : isUpcoming
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
                        <span>{isLive ? 'Live · Ongoing' : isUpcoming ? 'Upcoming Season' : 'Concluded'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {trn.edition}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white line-clamp-1">
                        {trn.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {trn.format} · {trn.prizePool}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-[#142e1b] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>{trn.dates}</span>
                      <span className="text-[#16a34a] dark:text-[#4ade80] font-semibold flex items-center gap-1">
                        View Cup <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tournament Main Card */}
            {activeTournament && (
              <div className="rounded-3xl bg-slate-50 dark:bg-[#07130b] border border-slate-200 dark:border-[#16351f] overflow-hidden shadow-xl">
                {/* Tournament Hero Banner */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900/10 via-slate-50 to-emerald-950/20 dark:from-[#0c2415] dark:via-[#07130b] dark:to-[#040a06] border-b border-slate-200 dark:border-[#142e1b]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-3 py-1 rounded-full bg-[#16a34a] dark:bg-[#22c55e] text-white dark:text-black font-bold uppercase font-['Barlow_Condensed'] tracking-wider">
                          {activeTournament.edition}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-[#0d2215] border border-slate-300 dark:border-[#1b3a24] text-slate-800 dark:text-slate-300 font-mono text-[11px]">
                          {activeTournament.format}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
                          Prize Pool: {activeTournament.prizePool}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight">
                        {activeTournament.name}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeTournament.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400 font-mono pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                          <span>{activeTournament.dates}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                          <span>{activeTournament.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#22c55e]" />
                          <span>{activeTournament.teamsCount} Squads Competing</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Hub */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                      {activeTournament.status === 'Ongoing' && onWatchLiveClick && (
                        <button
                          onClick={onWatchLiveClick}
                          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                        >
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span>Watch 360° Live Broadcast</span>
                        </button>
                      )}

                      {activeTournament.registrationOpen ? (
                        <button
                          onClick={() => handleOpenRegister(activeTournament)}
                          className="px-6 py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] text-white dark:text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Register Team Entry (Open)</span>
                        </button>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#050e07] border border-slate-200 dark:border-[#142e1b] text-center text-xs text-slate-500">
                          <span className="block font-semibold text-slate-700 dark:text-slate-300">
                            {activeTournament.status === 'Completed' ? 'Tournament Concluded' : 'Team Registrations Closed'}
                          </span>
                          <span className="text-[11px] font-mono">
                            {activeTournament.status === 'Completed' ? 'Trophy Presented' : 'Fixtures in Progress'}
                          </span>
                        </div>
                      )}

                      <a
                        href={createWhatsAppUrl(`Hello KSM Committee, I am interested in tournament information regarding ${activeTournament.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-[#0c2415] hover:bg-emerald-100 dark:hover:bg-[#12331f] border border-emerald-300 dark:border-[#22c55e]/40 text-emerald-800 dark:text-[#4ade80] font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Enquire on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="px-6 bg-slate-100/80 dark:bg-[#050e07] border-b border-slate-200 dark:border-[#142e1b] flex items-center gap-4 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveSubTab('fixtures')}
                    className={`py-3.5 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      activeSubTab === 'fixtures'
                        ? 'border-[#16a34a] dark:border-[#22c55e] text-[#16a34a] dark:text-[#4ade80]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Matches & Schedule ({activeTournament.fixtures.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('standings')}
                    className={`py-3.5 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      activeSubTab === 'standings'
                        ? 'border-[#16a34a] dark:border-[#22c55e] text-[#16a34a] dark:text-[#4ade80]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Points Table & Standings</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('honours')}
                    className={`py-3.5 text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      activeSubTab === 'honours'
                        ? 'border-[#16a34a] dark:border-[#22c55e] text-[#16a34a] dark:text-[#4ade80]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Honours, Awards & Rules</span>
                  </button>
                </div>

                {/* Sub-tab 1: Fixtures & Matches */}
                {activeSubTab === 'fixtures' && (
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
                        Matchday Schedule & Official Results
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Official Red/White Leather Ball Fixtures
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTournament.fixtures.map((f) => {
                        const isLiveMatch = f.status === 'Live';
                        const isCompleted = f.status === 'Completed';

                        return (
                          <div
                            key={f.id}
                            className={`p-5 rounded-2xl border transition-all ${
                              isLiveMatch
                                ? 'bg-emerald-50 dark:bg-[#0a2614] border-emerald-500 dark:border-[#22c55e] shadow-lg ring-1 ring-emerald-500/30'
                                : 'bg-white dark:bg-[#050e07] border-slate-200 dark:border-[#16351f]'
                            }`}
                          >
                            {/* Fixture Header */}
                            <div className="flex items-center justify-between text-xs mb-3">
                              <span className="font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                                Match #{f.matchNo} · {f.stage}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-['Barlow_Condensed'] tracking-wider ${
                                isLiveMatch
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                              }`}>
                                {isLiveMatch ? '● LIVE MATCH' : isCompleted ? 'RESULT' : 'UPCOMING'}
                              </span>
                            </div>

                            {/* Teams & Scores */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-tight">
                                  {f.team1}
                                </span>
                                {f.scores?.team1Score && (
                                  <span className="font-mono font-bold text-slate-900 dark:text-[#4ade80] text-xs">
                                    {f.scores.team1Score}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-tight">
                                  {f.team2}
                                </span>
                                {f.scores?.team2Score && (
                                  <span className="font-mono font-bold text-slate-900 dark:text-[#4ade80] text-xs">
                                    {f.scores.team2Score}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Match Result / Status Note */}
                            {f.result && (
                              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#07130b] border border-slate-200 dark:border-[#142e1b] text-xs mb-3">
                                <span className="text-[#16a34a] dark:text-[#84cc16] font-semibold block">
                                  {f.result}
                                </span>
                                {f.playerOfTheMatch && (
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                                    ★ POTM: {f.playerOfTheMatch}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Timing & Venue */}
                            <div className="pt-2 border-t border-slate-100 dark:border-[#132c1a] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              <span>{f.date} · {f.time}</span>
                              <span className="truncate max-w-[180px]">{f.venue}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Points Table / Standings */}
                {activeSubTab === 'standings' && (
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                          Official Tournament Standings
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Top 4 squads advance to playoff qualifiers & championship finals
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="text-slate-500">Playoffs Zone</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#142e1b]">
                      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                        <thead className="text-[10px] uppercase font-mono bg-slate-100 dark:bg-[#050e07] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#142e1b]">
                          <tr>
                            <th className="p-3">Pos</th>
                            <th className="p-3">Team Name</th>
                            <th className="p-3 text-center">Played</th>
                            <th className="p-3 text-center">Won</th>
                            <th className="p-3 text-center">Lost</th>
                            <th className="p-3 text-center">NRR</th>
                            <th className="p-3 text-center font-bold text-slate-900 dark:text-white">Points</th>
                            <th className="p-3 text-center">Form</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-[#132d1a] bg-white dark:bg-[#07130b]">
                          {activeTournament.standings.map((s, idx) => {
                            const isTop4 = idx < 4;

                            return (
                              <tr
                                key={s.team}
                                className={`hover:bg-slate-50 dark:hover:bg-[#0c2214]/40 transition-colors ${
                                  isTop4 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
                                }`}
                              >
                                <td className="p-3 font-mono font-bold text-slate-500 dark:text-slate-400">
                                  {idx + 1}
                                </td>
                                <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                  {s.team}
                                </td>
                                <td className="p-3 text-center font-mono">{s.played}</td>
                                <td className="p-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">{s.won}</td>
                                <td className="p-3 text-center font-mono text-red-600 dark:text-red-400">{s.lost}</td>
                                <td className="p-3 text-center font-mono">{s.nrr}</td>
                                <td className="p-3 text-center font-mono font-extrabold text-base text-[#16a34a] dark:text-[#4ade80]">
                                  {s.points}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    {(s.form || ['W', 'L']).map((result, i) => (
                                      <span
                                        key={i}
                                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono ${
                                          result === 'W'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                        }`}
                                      >
                                        {result}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: Honours, Awards & Rules */}
                {activeSubTab === 'honours' && (
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Individual Honours Cards */}
                    <div>
                      <h4 className="text-lg font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-3">
                        Tournament Honours & Key Performers
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(activeTournament.awards || []).map((a, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-white dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f] flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Award className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                                  {a.title}
                                </span>
                                <h5 className="text-base font-bold text-slate-900 dark:text-white font-['Barlow_Condensed'] uppercase">
                                  {a.player}
                                </h5>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#132c1a] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                              <span>{a.team}</span>
                              <span className="font-mono font-bold text-[#16a34a] dark:text-[#4ade80]">{a.stats}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tournament Features & Ground Highlights */}
                    {activeTournament.highlights && (
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#050e07] border border-slate-200 dark:border-[#16351f]">
                        <h5 className="text-sm font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white mb-3">
                          Tournament Features & Ground Standards
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                          {activeTournament.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team Registration Modal Dialog */}
      {registerModalOpen && selectedTournamentForReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#07130b] border border-slate-200 dark:border-[#1b3a24] shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-[#050e07] border-b border-slate-200 dark:border-[#142e1b] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#16a34a] dark:text-[#84cc16] font-bold block mb-1">
                  Team Entry Registration
                </span>
                <h3 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight">
                  {selectedTournamentForReg.name}
                </h3>
              </div>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0b1c11] border border-slate-200 dark:border-[#193a23]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {regSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-[#4ade80]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                      Registration Submitted!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Registration ID: <span className="font-mono text-[#16a34a] dark:text-[#4ade80] font-bold">{regSuccess.id}</span>.
                      KSM Tournament Committee will review your team entry and contact Captain {regSuccess.captainName}.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#142e1b] text-left text-xs space-y-1.5 font-mono">
                    <div>Team: <span className="text-slate-900 dark:text-white font-bold">{regSuccess.teamName}</span></div>
                    <div>Captain: <span className="text-slate-900 dark:text-white">{regSuccess.captainName}</span> ({regSuccess.phone})</div>
                    <div>Location: <span className="text-slate-900 dark:text-white">{regSuccess.city}</span> · {regSuccess.playersCount} Players</div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={createWhatsAppUrl(formatTournamentRegistrationWhatsApp(regSuccess))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-[#25D366] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm Team on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setRegisterModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0e2416] text-slate-700 dark:text-slate-300 text-xs font-bold font-['Barlow_Condensed'] uppercase"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad Super Strikers"
                        value={regForm.teamName}
                        onChange={e => setRegForm(prev => ({ ...prev, teamName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Captain / Manager Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={regForm.captainName}
                        onChange={e => setRegForm(prev => ({ ...prev, captainName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98490 12345"
                        value={regForm.phone}
                        onChange={e => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="team.captain@gmail.com"
                        value={regForm.email}
                        onChange={e => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        City / Home Ground
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Adibatla / Secunderabad"
                        value={regForm.city}
                        onChange={e => setRegForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Expected Squad Size
                      </label>
                      <select
                        value={regForm.playersCount}
                        onChange={e => setRegForm(prev => ({ ...prev, playersCount: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs"
                      >
                        <option value="12">12 Players (11 + 1 Reserve)</option>
                        <option value="15">15 Players (Standard Squad)</option>
                        <option value="18">18 Players (Full Squad)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Team Background / Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note on team experience, previous tournaments played, or jersey colors..."
                      value={regForm.notes}
                      onChange={e => setRegForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-300 dark:border-[#1a3a23] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-[#22c55e]"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#050e07] border border-slate-200 dark:border-[#142e1b] text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Entry Terms:</span>
                    Entry fee of {selectedTournamentForReg.entryFee || '₹15,000'} includes official leather match balls, ground lights, HCA umpires, and 360° video highlights.
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="w-full py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] text-white dark:text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
                  >
                    {submittingReg ? (
                      <span>Submitting Team Entry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Tournament Registration</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
