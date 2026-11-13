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
  Radio
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
  setIsCollapsed 
}) {
  return (
    <aside 
      className={`border-r border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 z-30 ${
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
            className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-900 transition-colors mx-auto"
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
  );
}
