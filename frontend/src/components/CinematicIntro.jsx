import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, ArrowRight, Zap, Play } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0: init, 1: outline scan, 2: letter glow, 3: subtitle reveal, 4: ready
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "INITIALIZING QUANTUM GIS CORE...",
    "CALIBRATING BHUBANESWAR DIGITAL TWIN...",
    "SYNCING JAYDEV VIHAR – ACHARYA VIHAR CORRIDOR...",
    "CONNECTING OPEN-METEO ATMOSPHERIC ARRAYS...",
    "ESTABLISHING CENTRAL AI COMMAND PROTOCOLS...",
    "SYSTEM FIDELITY: 99.8% • ALL SUBSYSTEMS NOMINAL"
  ];

  useEffect(() => {
    // Phase 1: Letter outline trace
    const t1 = setTimeout(() => setPhase(1), 600);
    // Phase 2: Letters illuminate with energy glow
    const t2 = setTimeout(() => setPhase(2), 2200);
    // Phase 3: Tagline reveal
    const t3 = setTimeout(() => setPhase(3), 3600);
    // Phase 4: Ready to enter
    const t4 = setTimeout(() => setPhase(4), 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (logIndex < logs.length - 1) {
      const interval = setInterval(() => {
        setLogIndex(prev => prev + 1);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [logIndex]);

  // Handle ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030508] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Cyber Grid & Atmospheric Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      
      {/* Ambient Radial Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none transition-opacity duration-1000"
        style={{ opacity: phase >= 2 ? 0.7 : 0.2 }}
      />

      {/* Top Status Banner */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs tracking-widest text-cyan-400 font-mono">
        <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-cyan-400" />
        <span className="truncate max-w-[180px] sm:max-w-none">SYS_INIT // BHUBANESWAR</span>
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 text-[10px] sm:text-xs font-mono text-slate-500 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer"
      >
        <span>SKIP</span>
        <span className="text-[9px] text-slate-600 hidden sm:inline">[ESC]</span>
      </button>

      {/* Main Brand Title with Electric Tracer Border Effect */}
      <div className="relative z-10 text-center px-3 sm:px-4 max-w-full">
        {/* Animated Scanning Beam Box */}
        <div className="relative inline-block p-4 sm:p-8 border border-cyan-500/20 rounded-2xl bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.05)] max-w-full">
          {/* Traveling Light Perimeter */}
          {phase >= 1 && (
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              <div className="w-full h-full border border-cyan-400/80 animate-pulse" />
            </div>
          )}

          {/* Project Name: CITYMIND AI */}
          <div className="relative">
            <h1 
              className={`text-4xl sm:text-6xl md:text-8xl font-black tracking-tight font-sans transition-all duration-1000 ${
                phase === 0 ? 'text-slate-900 opacity-20' :
                phase === 1 ? 'text-slate-700 [text-shadow:0_0_8px_#00f0ff]' :
                'text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.8)]'
              }`}
            >
              CITY<span className="text-cyan-400">MIND</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI</span>
            </h1>

            {/* Glowing Accent Underline */}
            <div 
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2 transition-all duration-1000"
              style={{ width: phase >= 2 ? '100%' : '0%', opacity: phase >= 2 ? 1 : 0 }}
            />
          </div>

          {/* Tagline Reveal */}
          <div 
            className="mt-6 transition-all duration-1000 transform"
            style={{ 
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)'
            }}
          >
            <p className="text-sm md:text-base font-mono tracking-[0.25em] text-cyan-200/90 font-semibold uppercase">
              AN INTELLIGENT DIGITAL TWIN OF A CITY
            </p>
            <p className="text-xs text-slate-400 font-mono tracking-widest mt-1">
              Bhubaneswar, Odisha • Jaydev Vihar Corridor
            </p>
          </div>
        </div>

        {/* Telemetry Log Terminal */}
        <div className="mt-8 font-mono text-xs text-cyan-400/80 h-6 flex items-center justify-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{logs[logIndex]}</span>
        </div>

        {/* Launch Command Button */}
        <div className="mt-6 sm:mt-10 px-2">
          <button
            onClick={onComplete}
            className={`group relative inline-flex items-center justify-center space-x-2 sm:space-x-3 px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm tracking-wider font-bold transition-all duration-500 max-w-full ${
              phase >= 4 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_35px_rgba(0,240,255,0.5)] hover:scale-105 cursor-pointer' 
                : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${phase >= 4 ? 'text-slate-950 fill-current' : 'text-slate-600'}`} />
            <span className="truncate">ENTER COMMAND ENVIRONMENT</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="absolute bottom-4 sm:bottom-6 text-center text-[10px] sm:text-[11px] font-mono text-slate-600 px-3 truncate max-w-full">
        CITYMIND AI • YOUR CITY. YOUR SIMULATION. SMARTER DECISIONS.
      </div>
    </div>
  );
}
