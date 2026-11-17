import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  CloudRain, 
  AlertTriangle, 
  Trash2, 
  Leaf, 
  Bot, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  X,
  Activity
} from 'lucide-react';

export const DEPARTMENTS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, badge: 'Live', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  { id: 'digital-twin', name: 'Digital Twin', icon: Building2, badge: '3D GIS', badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
  { id: 'traffic', name: 'Traffic Intelligence', icon: Car, badge: 'Active', badgeColor: 'bg-amber-950 text-amber-400 border-amber-800' },
  { id: 'weather', name: 'Weather Intelligence', icon: CloudRain, badge: 'Synced', badgeColor: 'bg-blue-950 text-blue-400 border-blue-800' },
  { id: 'disaster', name: 'Disaster Intelligence', icon: AlertTriangle, badge: 'Watch', badgeColor: 'bg-rose-950 text-rose-400 border-rose-800' },
  { id: 'waste', name: 'Waste Management', icon: Trash2, badge: 'Red/Grn', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  { id: 'environment', name: 'Environmental Intel', icon: Leaf, badge: 'AQI 92', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  { id: 'ai-advisor', name: 'AI Advisor', icon: Bot, badge: 'Neural', badgeColor: 'bg-purple-950 text-purple-400 border-purple-800' },
  { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, badge: 'Metrics', badgeColor: 'bg-slate-900 text-slate-400 border-slate-700' },
  { id: 'settings', name: 'Settings', icon: Settings, badge: 'Config', badgeColor: 'bg-slate-900 text-slate-400 border-slate-700' }
];

export default function Sidebar({ 
  activeDepartment, 
  onSelectDepartment, 
  isCollapsed, 
  setIsCollapsed,
  mobileOpen = false,
  onCloseMobile = () => {}
}) {
  return (
    <>
      {/* 1. Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 lg:hidden transition-opacity animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* 2. Slide-out Mobile Navigation Drawer (< lg) */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#07090e]/98 backdrop-blur-2xl border-r border-cyan-500/30 flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                <Activity className="w-4 h-4 text-slate-950 font-black" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-white font-sans text-sm block">
                  CITY<span className="text-cyan-400">MIND</span> AI
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  CITY NAVIGATION
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Mobile Department Links List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
            <div className="text-[10px] font-mono tracking-widest text-slate-500 font-bold uppercase px-3 py-1 mb-1">
              ALL CITY MODULES
            </div>
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              const isActive = activeDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    onSelectDepartment(dept.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-xl transition-all group relative cursor-pointer min-h-[44px] ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00f0ff]" />
                  )}

                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 mr-3 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`} />

                  <div className="flex-1 flex items-center justify-between overflow-hidden text-left">
                    <span className="truncate text-xs">{dept.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono shrink-0 ml-2 ${dept.badgeColor}`}>
                      {dept.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Corridor Live Widget (Bottom of Mobile Drawer) */}
          <div className="p-3 m-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] shrink-0">
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span className="font-semibold text-xs">JAYDEV VIHAR CORRIDOR</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              NH-16 Jaydev Vihar – Acharya Vihar – Vani Vihar live digital twin active.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Persistent Desktop Sidebar (Hidden on < lg, shown on >= lg) */}
      <aside 
        className={`hidden lg:flex border-r border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Top Department Navigation */}
        <div className="py-4">
          <div className="px-4 mb-3 flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-[11px] font-mono tracking-widest text-slate-500 font-bold uppercase">
                DEPARTMENTS
              </span>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-900 transition-colors mx-auto cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1 px-2 font-mono">
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              const isActive = activeDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => onSelectDepartment(dept.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs transition-all group relative cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                  title={isCollapsed ? dept.name : undefined}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00f0ff]" />
                  )}

                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`} />

                  {!isCollapsed && (
                    <div className="ml-3 flex-1 flex items-center justify-between overflow-hidden text-left">
                      <span className="truncate">{dept.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${dept.badgeColor}`}>
                        {dept.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Corridor Telemetry Widget */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px]">
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold text-xs">JAYDEV VIHAR CORRIDOR</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Active digital twin tracking NH-16 corridor through Acharya Vihar to Vani Vihar Square.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
