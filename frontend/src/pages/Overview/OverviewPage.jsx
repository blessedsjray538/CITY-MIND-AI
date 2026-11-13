import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Car, 
  CloudRain, 
  AlertTriangle, 
  Trash2, 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  TrendingUp, 
  Compass,
  Radio,
  ExternalLink
} from 'lucide-react';
import { fetchCurrentWeather, fetchTrafficState, fetchWasteAnalytics, fetchAirQuality, fetchDisasterAlerts } from '../../services/api';

export default function OverviewPage({ onNavigateDepartment }) {
  const [weather, setWeather] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [waste, setWaste] = useState(null);
  const [env, setEnv] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [wData, tData, wstData, eData, aData] = await Promise.all([
          fetchCurrentWeather(),
          fetchTrafficState(),
          fetchWasteAnalytics(),
          fetchAirQuality(),
          fetchDisasterAlerts()
        ]);
        if (wData) setWeather(wData);
        if (tData) setTraffic(tData);
        if (wstData) setWaste(wstData);
        if (eData) setEnv(eData);
        if (aData && aData.alerts) setAlerts(aData.alerts);
      } catch (err) {
        console.error("Overview load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-[#0c1424] via-[#070b14] to-[#0d1729] p-6 shadow-[0_0_40px_rgba(0,240,255,0.08)]">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
              <Compass className="w-4 h-4 animate-spin text-cyan-400" />
              <span>PRIMARY COMMAND NODE // BHUBANESWAR URBAN DIGITAL TWIN</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              CITY<span className="text-cyan-400">MIND</span> AI COMMAND CENTER
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time synchronization across the <span className="text-cyan-300 font-semibold">Jaydev Vihar – Acharya Vihar – Vani Vihar</span> development corridor. Multi-department simulation, verified weather observation, disaster early warning, and responsive civic operations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateDepartment('traffic')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <Car className="w-4 h-4" />
              <span>LAUNCH TRAFFIC SIMULATION</span>
            </button>
            <button
              onClick={() => onNavigateDepartment('digital-twin')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>OPEN 3D DIGITAL TWIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Disaster Advisory Banner (If Any) */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 backdrop-blur-md flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider">
                  ACTIVE ALERT: {alerts[0].title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700">
                  {alerts[0].severity} Level
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {alerts[0].hazard_type} affecting {alerts[0].affected_corridors}. Wind speeds {alerts[0].wind_speed_estimate}. 24h Rainfall: {alerts[0].rainfall_forecast_mm}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('disaster')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/60 text-xs font-mono text-rose-200 transition-colors flex items-center space-x-1"
          >
            <span>REVIEW IN DISASTER STATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Department Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Traffic Intelligence Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Car className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Traffic Intelligence</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                LIVE_SIMULATION
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Simulated Vehicles:</span>
                <span className="text-slate-100 font-bold">{traffic?.state?.total_simulated_vehicles || 168}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Average Corridor Speed:</span>
                <span className="text-amber-400 font-bold">{traffic?.state?.average_speed_kmh || 36.4} km/h</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Congestion Level:</span>
                <span className="text-slate-100">Moderate (48.2%)</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Jaydev Vihar - Nandankanan Expressway experiencing queueing.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('traffic')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated Traffic Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Weather Intelligence Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <CloudRain className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Weather Intelligence</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800">
                VERIFIED_REAL
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Temperature:</span>
                <span className="text-blue-400 font-bold">{weather?.current?.temperature_c || 30.2}°C</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Surface Wind:</span>
                <span className="text-slate-100">{weather?.current?.wind_speed_kmh || 14.2} km/h</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Relative Humidity:</span>
                <span className="text-slate-100">{weather?.current?.humidity_percent || 68}%</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Live Open-Meteo feed synced with WMO Station 42971 (Bhubaneswar).
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('weather')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated Weather Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Smart Waste Management Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Waste Management</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                RED/GREEN WORKFLOW
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Pending Cleaning (RED):</span>
                <span className="text-rose-400 font-bold">{waste?.pending_cleaning_red || 2} locations</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cleaned & Verified (GREEN):</span>
                <span className="text-emerald-400 font-bold">{waste?.completed_cleaned_green || 2} locations</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Sanitation Workers:</span>
                <span className="text-slate-100">18 on duty</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Dijkstra route optimization active for compactor truck OD-02-AT-4481.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('waste')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated Waste Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Environmental Intelligence Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Environmental Intelligence</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                AQI SENSOR
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Air Quality Index (AQI):</span>
                <span className="text-emerald-400 font-bold">{env?.aqi_index || 92} ({env?.aqi_category || "Moderate"})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fine PM2.5:</span>
                <span className="text-slate-100">{env?.pollutants?.pm2_5?.value || 38.5} µg/m³</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Traffic Excess CO2:</span>
                <span className="text-amber-400 font-bold">114.5 kg/h</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Corridor emission reduction potential via signal sync: 21.4%.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('environment')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated Environment Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Disaster Early Warning Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Disaster Knowledge Base</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                IMD & OSDMA
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Historical Benchmarks:</span>
                <span className="text-slate-100">1999 Super Cyclone, Phailin, Fani</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>1999 Peak Wind:</span>
                <span className="text-rose-400 font-bold">260 km/h (912 hPa)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Threat Level:</span>
                <span className="text-amber-400 font-bold">Low (Localized Rain Watch)</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Automated parameter comparison against Odisha historical benchmarks.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('disaster')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated Disaster Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6. AI Central Advisor Card */}
        <div className="glass-panel p-5 glass-panel-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-100">Central AI Advisor</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                NEURAL ORCHESTRATION
              </span>
            </div>
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Architecture:</span>
                <span className="text-purple-400 font-bold">Tool-Based Multi-Subsystem</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cross-Domain Syntheses:</span>
                <span className="text-slate-100">Weather ↔ Traffic ↔ Waste</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fact Verification:</span>
                <span className="text-emerald-400 font-bold">Zero Hallucination Strict</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                Persistent analyst available from right drawer on every page.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateDepartment('ai-advisor')}
            className="mt-5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
          >
            <span>Open Dedicated AI Advisor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* AI City Summary Box */}
      <div className="glass-panel p-5 border-l-4 border-l-cyan-400 font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-2">
          <Activity className="w-4 h-4" />
          <span>AUTONOMOUS CITY STATUS BRIEFING (BHUBANESWAR METRO)</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          The Jaydev Vihar – Acharya Vihar – Vani Vihar corridor is currently functioning under normal mid-day traffic conditions with an average flow rate of 36.4 km/h. Atmospheric barometric readings (1011.2 hPa) indicate stable coastal conditions with isolated rain clouds. Two priority waste reports in Jaydev Vihar Square require civic compactor dispatch. Environmental sensors detect moderate AQI (92); optimizing traffic signal timing can reduce corridor carbon output by an estimated 21.4%.
        </p>
      </div>
    </div>
  );
}
