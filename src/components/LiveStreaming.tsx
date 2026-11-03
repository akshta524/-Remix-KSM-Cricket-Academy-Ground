import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  VideoOff,
  Tv,
  Eye,
  Sparkles,
  RefreshCw,
  Sliders,
  Settings
} from 'lucide-react';

interface LiveStreamingProps {
  isStreamingActive: boolean;
  streamTitle?: string;
  activeAngle?: string;
  onToggleStreamActive?: (active: boolean) => void;
}

export const LiveStreaming: React.FC<LiveStreamingProps> = ({
  isStreamingActive: propStreamActive = true,
  streamTitle = 'Adibatla Premier Trophy – KSM Strikers XI vs Cyberabad CC',
  activeAngle = 'Main Pavilion Cam 1',
  onToggleStreamActive
}) => {
  // Local state for stream active status, defaulting to true so the user sees a working live stream immediately!
  const [isLiveActive, setIsLiveActive] = useState<boolean>(propStreamActive ?? true);

  // Sync if prop changes
  useEffect(() => {
    if (propStreamActive !== undefined) {
      setIsLiveActive(propStreamActive);
    }
  }, [propStreamActive]);

  const [selectedAngle, setSelectedAngle] = useState(activeAngle);
  const [is360Active, setIs360Active] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Live match simulator state
  const [score, setScore] = useState({ runs: 154, wickets: 3, overs: '17.3', cr: '8.80', target: '185' });
  const [recentBalls, setRecentBalls] = useState(['1', '4', '0', '6', '1', '2']);
  const [commentary, setCommentary] = useState('Lofted over extra cover! Vikram Reddy executes a textbook cover drive for four runs.');
  const [viewerCount, setViewerCount] = useState(248);

  // Web Audio Context for realistic ambient stadium sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const crowdNodeRef = useRef<GainNode | null>(null);

  // Camera angles mapped to actual high-resolution generated stadium photos
  const angles = [
    {
      id: 'cam1',
      name: 'Main Pavilion Cam 1',
      desc: 'Elevated wide tactical view over the outfield',
      img: '/src/assets/images/hero_cricket_ground_1793601200734.jpg'
    },
    {
      id: 'cam2',
      name: 'Pitch-Line Cam 2',
      desc: 'Direct floodlight pitch perspective under LED towers',
      img: '/src/assets/images/evening_floodlights_match_1793601203797.jpg'
    },
    {
      id: 'cam3',
      name: 'Slip Cordon Cam 3',
      desc: 'Close-up batsman stance & coaching clinic view',
      img: '/src/assets/images/academy_coaching_session_1793601202753.jpg'
    },
    {
      id: 'cam4',
      name: 'Deep Boundary 360°',
      desc: 'Perimeter practice nets & boundary fence view',
      img: '/src/assets/images/academy_cricket_nets_1793601202321.jpg'
    }
  ];

  const currentCam = angles.find(a => a.name === selectedAngle) || angles[0];

  // Auto-rotate 360 view when active
  useEffect(() => {
    if (!isLiveActive || !isAutoRotating) return;
    const interval = setInterval(() => {
      setPanX(prev => (prev >= 180 ? -180 : prev + 1));
    }, 80);
    return () => clearInterval(interval);
  }, [isLiveActive, isAutoRotating]);

  // Live match simulation tick (updates score, overs, commentary, and viewer count periodically)
  useEffect(() => {
    if (!isLiveActive) return;

    const commentaries = [
      'Cracking square cut! Pierces the point and third-man gap for 2 runs.',
      'Inswinging yorker from the Adibatla bowler, dug out solidly into the off side.',
      'Slog sweep high into the evening sky! Clears the deep mid-wicket boundary for SIX!',
      'Sharp bouncer! The batter ducks cleanly. Umpire signals one for the over.',
      'Quick single taken to mid-off! Great athletic sprint between the wickets.',
      'Driven crisply through mid-on! The outfield turf is exceptionally fast tonight.'
    ];

    const outcomes = ['1', '2', '4', '6', '.', '1lb', '4'];

    const interval = setInterval(() => {
      const nextBall = outcomes[Math.floor(Math.random() * outcomes.length)];
      setRecentBalls(prev => [...prev.slice(1), nextBall]);

      const runsToAdd = nextBall === '6' ? 6 : nextBall === '4' ? 4 : nextBall === '2' ? 2 : nextBall === '1' ? 1 : 0;
      setScore(prev => {
        const [ov, b] = prev.overs.split('.').map(Number);
        const nextB = b + 1;
        const newOvers = nextB >= 6 ? `${ov + 1}.0` : `${ov}.${nextB}`;
        const newRuns = prev.runs + runsToAdd;
        return {
          ...prev,
          runs: newRuns,
          overs: newOvers,
          cr: (newRuns / (ov + nextB / 6)).toFixed(2)
        };
      });

      setCommentary(commentaries[Math.floor(Math.random() * commentaries.length)]);
      setViewerCount(prev => prev + (Math.random() > 0.5 ? 2 : -1));
    }, 5500);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Sound Synthesis for crowd ambience
  const toggleSound = () => {
    try {
      if (isMuted) {
        // Start synthetic crowd murmur using Web Audio
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current && AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }

        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        if (audioCtxRef.current) {
          // Pink noise buffer for ambient stadium applause & wind
          const bufferSize = audioCtxRef.current.sampleRate * 2;
          const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2) * 0.08;
          }

          const whiteNoise = audioCtxRef.current.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = audioCtxRef.current.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 600;

          const gain = audioCtxRef.current.createGain();
          gain.gain.value = 0.12;

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          whiteNoise.start();

          crowdNodeRef.current = gain;
        }

        setIsMuted(false);
      } else {
        if (crowdNodeRef.current) {
          crowdNodeRef.current.gain.value = 0;
        }
        setIsMuted(true);
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
      setIsMuted(!isMuted);
    }
  };

  // Mouse & Touch 360 Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    setPanX(prev => {
      let next = prev + delta * 0.35;
      if (next > 180) next = -180;
      if (next < -180) next = 180;
      return next;
    });
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleStreamMode = (newState: boolean) => {
    setIsLiveActive(newState);
    if (onToggleStreamActive) {
      onToggleStreamActive(newState);
    }
  };

  return (
    <section id="live-streaming" className="py-20 bg-[#050c07] border-t border-[#122b19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#84cc16] mb-2 uppercase tracking-wider">
              <span>05</span>
              <span>·</span>
              <span>Broadcasting Infrastructure</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-1">
              From the Ground · Beyond the Boundary
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase font-['Barlow_Condensed'] text-white tracking-tight leading-none mb-3">
              360° <span className="text-[#4ade80]">Live Streaming</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience every moment of the match from every angle in high-definition 360° coverage.
            </p>
          </div>

          {/* Quick Stream Status Switcher (Allows user to toggle between Live Broadcast and Standby) */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#08170e] border border-[#1b3a24] shrink-0">
            <button
              onClick={() => toggleStreamMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                isLiveActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveActive ? 'animate-pulse text-white' : ''}`} />
              <span>Watch Live Feed</span>
            </button>
            <button
              onClick={() => toggleStreamMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                !isLiveActive
                  ? 'bg-[#0f2c18] text-[#4ade80] border border-[#22c55e]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <VideoOff className="w-3.5 h-3.5" />
              <span>Offline Standby</span>
            </button>
          </div>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-2xl bg-[#09180e] border border-[#1b3a24] overflow-hidden shadow-2xl">
          {/* Top Player HUD Bar */}
          <div className="px-5 py-3.5 bg-[#07130b] border-b border-[#152e1d] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isLiveActive ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold font-mono tracking-wider">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                  <span>LIVE MATCH</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
                  <VideoOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>OFFLINE</span>
                </div>
              )}

              <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {isLiveActive ? streamTitle : 'KSM Adibatla Ground Broadcast Feed'}
              </span>

              {isLiveActive && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-[#050e07] px-2 py-0.5 rounded border border-[#16331e]">
                  <Eye className="w-3 h-3 text-[#4ade80]" />
                  <span>{viewerCount} watching</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#84cc16] bg-[#050e07] px-2.5 py-1 rounded border border-[#183a21]">
                {currentCam.name}
              </span>
              <span className="hidden md:inline-block text-xs font-mono text-slate-400">
                1080p 60FPS · 360 Panoramic
              </span>
            </div>
          </div>

          {/* Viewport Display Area */}
          <div
            className={`relative w-full aspect-video sm:aspect-[21/9] bg-[#040906] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none ${
              isFullscreen ? 'fixed inset-0 z-50 aspect-auto h-screen w-screen' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isLiveActive ? (
              // Active Stream Mode: High-fidelity panoramic ground view with real 360 drag, angle images, and live match HUD
              <div className="relative w-full h-full">
                {/* Background stadium image with 360 transform */}
                <img
                  src={currentCam.img}
                  alt={currentCam.name}
                  className="w-full h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                  style={{
                    transform: `scale(${is360Active ? 1.15 : 1}) translateX(${panX * 1.5}px)`
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Subtle dark gradient scrims for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50 pointer-events-none" />

                {/* Top Left: Scoreboard Overlay HUD */}
                <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#22c55e]/40 text-white font-['Barlow_Condensed'] shadow-2xl max-w-xs">
                  <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-white/10 text-xs text-slate-300">
                    <span className="font-bold tracking-wider text-[#84cc16]">ADIBATLA PREMIER TROPHY</span>
                    <span className="font-mono bg-[#112d1b] px-1.5 py-0.5 rounded text-white text-[10px]">
                      OVER {score.overs}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 pt-2">
                    <div>
                      <span className="font-extrabold text-xl text-white tracking-wide block">
                        KSM STRIKERS XI
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">
                        CR: {score.cr} · Target: {score.target} (120 balls)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-3xl text-[#4ade80] leading-none">
                        {score.runs}/{score.wickets}
                      </span>
                    </div>
                  </div>

                  {/* Recent Balls Ticker */}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-sans mr-1">This Over:</span>
                    {recentBalls.map((b, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                          b === '6'
                            ? 'bg-purple-600 text-white'
                            : b === '4'
                            ? 'bg-blue-600 text-white'
                            : b === 'W'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Right: 360 Compass & Drag Status */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#22c55e]/30 text-white text-xs flex items-center gap-2.5 shadow-xl">
                    <Compass className={`w-4 h-4 text-[#4ade80] ${isAutoRotating ? 'animate-spin' : ''}`} />
                    <span className="font-mono text-[11px]">
                      360° Field: {Math.round((panX + 180) % 360)}°
                    </span>
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                        isAutoRotating ? 'bg-[#22c55e] text-black' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isAutoRotating ? 'Auto-Pan ON' : 'Paused'}
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
                    Drag anywhere to rotate 360°
                  </span>
                </div>

                {/* Center Lower: Live Commentary Ticker */}
                <div className="absolute bottom-16 left-4 right-4 max-w-2xl hidden sm:block">
                  <div className="p-2.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs text-slate-200 flex items-center gap-2.5 shadow-xl">
                    <span className="px-1.5 py-0.5 rounded bg-[#11311b] text-[#4ade80] font-mono text-[10px] font-bold uppercase shrink-0">
                      Live Comm
                    </span>
                    <p className="truncate text-slate-200 text-xs">
                      {commentary}
                    </p>
                  </div>
                </div>

                {/* Bottom Stream Controls Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      title={isMuted ? 'Unmute Stadium Audio' : 'Mute'}
                      className={`p-2.5 rounded-lg text-white backdrop-blur-sm border transition-colors ${
                        !isMuted
                          ? 'bg-[#22c55e] text-black border-[#22c55e]'
                          : 'bg-black/70 hover:bg-black text-white border-white/20'
                      }`}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setIs360Active(!is360Active)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider backdrop-blur-sm transition-colors border ${
                        is360Active
                          ? 'bg-[#0f2e19] text-[#4ade80] border-[#22c55e]'
                          : 'bg-black/70 hover:bg-black text-white border-white/20'
                      }`}
                    >
                      {is360Active ? '360° VR View Active' : 'Enable 360° View'}
                    </button>

                    {/* Reset Pan button */}
                    <button
                      onClick={() => setPanX(0)}
                      className="px-2.5 py-2 rounded-lg bg-black/70 hover:bg-black text-slate-300 text-xs border border-white/10 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Center</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2.5 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-sm border border-white/20 transition-colors"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Offline Message Mode (CRITICAL: Displays exact requested text with 1-click start)
              <div className="p-8 text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0c1f13] border border-[#1b3d24] flex items-center justify-center text-slate-400">
                  <Tv className="w-8 h-8 text-[#22c55e]/70" />
                </div>
                <h3 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide text-white mb-2">
                  Live Streaming Unavailable
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Live streaming is currently unavailable. Check back when the match begins.
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#07140b] border border-[#16331e] text-xs text-slate-400 mb-6">
                  <RotateCcw className="w-3.5 h-3.5 text-[#84cc16]" />
                  <span>Streams are broadcast during tournament days & weekend sessions</span>
                </div>

                <div>
                  <button
                    onClick={() => toggleStreamMode(true)}
                    className="py-3 px-6 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 mx-auto transition-all shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Interactive Match Broadcast</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Angle Selector Tabs & Features Grid */}
          <div className="p-6 bg-[#07140c] border-t border-[#152e1c]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <span className="text-xs font-mono uppercase text-[#84cc16] font-bold">
                Select 360° Ground Camera Angle:
              </span>
              <span className="text-xs text-slate-300">
                Active Angle: <span className="text-[#4ade80] font-semibold">{selectedAngle}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {angles.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => {
                    setSelectedAngle(cam.name);
                    if (!isLiveActive) setIsLiveActive(true);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAngle === cam.name
                      ? 'bg-[#0f2c18] border-[#22c55e] text-white shadow-md'
                      : 'bg-[#0a1b10] border-[#16351f] text-slate-300 hover:border-[#22c55e]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wide">
                      {cam.name}
                    </span>
                    <Layers className="w-3.5 h-3.5 text-[#84cc16]" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{cam.desc}</p>
                </button>
              ))}
            </div>

            {/* Broadcast Feature Cards */}
            <div className="mt-8 pt-6 border-t border-[#142e1b] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">360° Panoramic</span>
                <span className="text-[10px] text-slate-400">Full boundary sweep</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">Multi-Angle</span>
                <span className="text-[10px] text-slate-400">4 HD Ground cameras</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">Cross Platform</span>
                <span className="text-[10px] text-slate-400">Phone, tablet, desktop</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">Live Status</span>
                <span className="text-[10px] text-slate-400">Real-time match alerts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">Replay Support</span>
                <span className="text-[10px] text-slate-400">Match highlights clips</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050e07] border border-[#132c1a]">
                <span className="block text-xs font-bold text-white uppercase font-['Barlow_Condensed']">Crisp Quality</span>
                <span className="text-[10px] text-slate-400">Low-latency video feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
