import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Sliders, 
  UserCheck, 
  Cpu, 
  Save, 
  Radio, 
  Globe 
} from 'lucide-react';

export default function SettingsPage() {
  const [role, setRole] = useState('planner');
  const [refreshInterval, setRefreshInterval] = useState('10');
  const [mapStyle, setMapStyle] = useState('dark');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 font-mono text-xs max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>SYSTEM CONFIGURATION // PLATFORM PARAMETERS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            PLATFORM SETTINGS & USER ROLES
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure backend telemetry synchronization, role authorizations, and geospatial simulation preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'SETTINGS SAVED!' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">
        
        {/* Role & Access Permissions */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
            <UserCheck className="w-4 h-4" />
            <span>USER ROLE & CLEARANCE LEVEL</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'admin', label: 'Administrator', desc: 'Full system & database write access' },
              { id: 'planner', label: 'City Planner', desc: 'Simulations, What-if tests, and AI analytics' },
              { id: 'worker', label: 'Sanitation Worker', desc: 'Field waste reporting & green clean verification' }
            ].map(r => (
              <div
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  role === r.id 
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs">{r.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Refresh & Backend Endpoints */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4" />
            <span>TELEMETRY & API CONFIGURATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">DATA REFRESH CADENCE (SECONDS)</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500"
              >
                <option value="5">5 Seconds (Real-time)</option>
                <option value="10">10 Seconds (Standard)</option>
                <option value="30">30 Seconds (Conserve Resources)</option>
                <option value="60">60 Seconds (Low Power)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">MAP BASE STYLE</label>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500"
              >
                <option value="dark">CartoDB Dark Matter (Futuristic Command)</option>
                <option value="satellite">High-Res Satellite Composite</option>
                <option value="osm">OpenStreetMap Standard Vector</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4" />
            <span>SYSTEM HEALTH & ENGINE SPECIFICATIONS</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">API BACKEND</span>
              <span className="text-emerald-400 font-bold">FastAPI / Uvicorn</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">DATABASE</span>
              <span className="text-emerald-400 font-bold">SQLite / PostGIS Ready</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">ROUTING ALGORITHM</span>
              <span className="text-cyan-400 font-bold">NetworkX A* / Dijkstra</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">METEOROLOGICAL API</span>
              <span className="text-blue-400 font-bold">Open-Meteo Verified</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
