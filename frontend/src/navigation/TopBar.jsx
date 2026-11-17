import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Bell, 
  Bot, 
  User, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

export default function TopBar({ 
  navigationMode, 
  setNavigationMode, 
  aiDrawerOpen, 
  setAiDrawerOpen,
  onReplayIntro,
  activeDepartment,
  mobileMenuOpen,
  onToggleMobileMenu
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, title: "Monsoon Surge Advisory", dept: "Disaster", time: "10m ago", level: "warning" },
    { id: 2, title: "New Plastic Dumping Reported", dept: "Waste", time: "25m ago", level: "critical" },
    { id: 3, title: "Jaydev Vihar Signal Phase Optimized", dept: "Traffic", time: "42m ago", level: "info" }
  ];

  const departmentDisplayNames = {
    'overview': 'OVERVIEW',
    'digital-twin': 'DIGITAL TWIN',
    'traffic': 'TRAFFIC INTEL',
    'weather': 'WEATHER',
    'disaster': 'DISASTER',
    'waste': 'SMART WASTE',
    'environment': 'ENVIRONMENT',
    'ai-advisor': 'AI ADVISOR',
    'analytics': 'ANALYTICS',
    'settings': 'SETTINGS'
  };

  return (
    <header className="h-14 sm:h-16 border-b border-cyan-500/20 bg-[#07090e]/95 backdrop-blur-md sticky top-0 z-40 px-2.5 sm:px-4 md:px-6 flex items-center justify-between gap-2">
      {/* Left: Hamburger Menu (Mobile) & Brand */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 sm:p-2.5 min-w-[40px] min-h-[40px] rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center cursor-pointer"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] shrink-0">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-bold tracking-tight text-white font-sans text-sm sm:text-base whitespace-nowrap">
                CITY<span className="text-cyan-400">MIND</span> AI
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 shrink-0">
                DT-v1.0
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider hidden sm:block">
              INTELLIGENT URBAN DIGITAL TWIN
            </div>
          </div>
        </div>

        {/* Current Active Department Badge on Mobile */}
        <div className="lg:hidden hidden xs:flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="truncate max-w-[90px]">{departmentDisplayNames[activeDepartment] || activeDepartment.toUpperCase()}</span>
        </div>

        {/* Location Indicator (Desktop) */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Bhubaneswar, Odisha</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400">Jaydev Vihar Corridor</span>
        </div>
      </div>

      {/* Center: View Switcher (Direct Single Page vs Continuous Scroll) */}
      <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono">
        <button
          onClick={() => setNavigationMode('single')}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
            navigationMode === 'single'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Direct Dedicated Department Page Navigation"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dedicated Page</span>
        </button>
        <button
          onClick={() => setNavigationMode('continuous')}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
            navigationMode === 'continuous'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Continuous Scroll Through All City Modules"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Continuous Scroll</span>
        </button>
      </div>

      {/* Right: Telemetry, Clock, Notifications, AI Trigger, Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* System Online Badge (Large screens) */}
        <div className="hidden 2xl:flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SYSTEM ONLINE 99.8%</span>
        </div>

        {/* Live IST Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-slate-300 px-2 py-1 bg-slate-900/60 rounded border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} IST
          </span>
        </div>

        {/* Replay Intro Button */}
        <button
          onClick={onReplayIntro}
          title="Replay Cinematic Intro"
          className="p-1.5 sm:p-2 min-w-[36px] min-h-[36px] rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-1.5 sm:p-2 min-w-[36px] min-h-[36px] rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Toggle notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm glass-panel p-3 shadow-2xl z-50 border border-cyan-500/30 font-mono text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-400 font-semibold">
                <span>CITY ALERTS &amp; NOTIFICATIONS</span>
                <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300">3 NEW</span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-200">{n.title}</span>
                      <span className="text-[9px] text-slate-500">{n.time}</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-0.5">{n.dept} Subsystem</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
            aiDrawerOpen 
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.6)]' 
              : 'bg-slate-900 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40'
          }`}
          title="Open AI Assistant"
        >
          <Bot className="w-4 h-4 animate-bounce text-cyan-400 group-hover:text-cyan-300" />
          <span className="hidden sm:inline">AI ASSISTANT</span>
        </button>

        {/* User Profile */}
        <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
