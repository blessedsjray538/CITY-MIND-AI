import React, { useState, useEffect } from 'react';
import DisasterDashboard from '../../components/disaster/DisasterDashboard';
import { 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp, 
  Scale, 
  Wind, 
  Gauge, 
  LifeBuoy, 
  ExternalLink,
  Info,
  CheckCircle2,
  Sliders,
  Compass,
  Map as MapIcon
} from 'lucide-react';
import { fetchHistoricalDisasters, fetchDisasterAlerts, compareDisasterRisk } from '../../services/api';

export default function DisasterPage() {
  const [historical, setHistorical] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  
  // Interactive Cyclone Simulator Controls
  const [simWind, setSimWind] = useState(85); // km/h
  const [simPressure, setSimPressure] = useState(992); // hPa
  const [comparison, setComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('gis-map'); // 'gis-map' | 'cyclone-model'

  useEffect(() => {
    async function loadData() {
      const hData = await fetchHistoricalDisasters();
      if (hData && hData.disasters) {
        setHistorical(hData.disasters);
        setSelectedDisaster(hData.disasters[0]);
      }
      const aData = await fetchDisasterAlerts();
      if (aData && aData.alerts) setAlerts(aData.alerts);
    }
    loadData();
  }, []);

  // Update comparison whenever slider values change
  useEffect(() => {
    async function updateComp() {
      const comp = await compareDisasterRisk(simWind, simPressure);
      if (comp) setComparison(comp);
    }
    updateComp();
  }, [simWind, simPressure]);

  const getStormCategory = (wind) => {
    if (wind < 62) return { label: "Depression / Low Pressure", color: "text-blue-400", tier: "Tier 1" };
    if (wind < 88) return { label: "Cyclonic Storm", color: "text-amber-400", tier: "Tier 2" };
    if (wind < 118) return { label: "Severe Cyclonic Storm", color: "text-orange-400", tier: "Tier 3" };
    if (wind < 166) return { label: "Very Severe Cyclonic Storm (Phailin tier)", color: "text-rose-400", tier: "Tier 4" };
    if (wind < 221) return { label: "Extremely Severe Cyclonic Storm (Fani tier)", color: "text-purple-400", tier: "Tier 5" };
    return { label: "Super Cyclonic Storm (1999 Odisha tier)", color: "text-red-500 font-black", tier: "Catastrophic" };
  };

  const cat = getStormCategory(simWind);

  return (
    <div className="space-y-4">
      {/* Top Department View Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('gis-map')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 ${
            activeTab === 'gis-map'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Interactive Disaster GIS Map &amp; Live Traffic</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded text-cyan-300">Live</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cyclone-model')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 ${
            activeTab === 'cyclone-model'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Cyclone Risk Benchmark &amp; Simulator</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-black/40 rounded text-rose-300">1999 Model</span>
        </button>
      </div>

      {activeTab === 'gis-map' ? (
        <DisasterDashboard />
      ) : (
        <div className="space-y-5">
          {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>DISASTER INTELLIGENCE // EARLY WARNING & HISTORICAL RECONSTRUCTION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            DISASTER EARLY WARNING & CYCLONE BENCHMARK
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Bay of Bengal storm tracking, IMD alert assimilation, and 1999 Odisha Super Cyclone comparative modeling.
          </p>
        </div>

        {/* Threat Level Badge */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 font-bold">
            LEVEL: ADVISORY (BAY OF BENGAL WATCH)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            OSDMA Protocol: STANDBY
          </span>
        </div>
      </div>

      {/* Active Disaster Warning Banner */}
      {alerts.map(alert => (
        <div key={alert.id} className="glass-panel p-5 border-l-4 border-l-rose-500 bg-rose-950/15 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{alert.title}</span>
                  <span className="text-[10px] bg-rose-900/60 text-rose-300 border border-rose-700 px-1.5 py-0.2 rounded">
                    {alert.severity} Level
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {alert.hazard_type} affecting {alert.affected_corridors}. Issuing Authority: {alert.issuing_authority}.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs shrink-0">
              <div className="text-right">
                <div className="text-slate-400 text-[10px]">WIND FORECAST</div>
                <div className="text-cyan-300 font-bold">{alert.wind_speed_estimate}</div>
              </div>
              <div className="text-right pl-3 border-l border-slate-800">
                <div className="text-slate-400 text-[10px]">24H RAINFALL</div>
                <div className="text-blue-400 font-bold">{alert.rainfall_forecast_mm}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-900/30 flex flex-wrap gap-2 text-[11px]">
            {alert.recommended_precautions.map((p, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-rose-900/50 text-slate-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-rose-400" />
                <span>{p}</span>
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Interactive Cyclone Risk Simulation Playground */}
      <div className="glass-panel p-5 border border-rose-500/30 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400 font-bold">
            <Sliders className="w-4 h-4" />
            <span>INTERACTIVE CYCLONE RISK SIMULATOR & HISTORICAL COMPARISON</span>
          </div>
          <span className="text-[10px] text-cyan-400">Bay of Bengal Trajectory Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Wind Slider */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Simulated Wind Speed:</span>
              <span className="text-rose-400 font-bold">{simWind} km/h</span>
            </div>
            <input 
              type="range"
              min="30"
              max="270"
              step="5"
              value={simWind}
              onChange={(e) => setSimWind(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>30 km/h (Breeze)</span>
              <span>260 km/h (1999 Peak)</span>
            </div>
          </div>

          {/* Barometric Pressure Slider */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Central Pressure:</span>
              <span className="text-purple-400 font-bold">{simPressure} hPa</span>
            </div>
            <input 
              type="range"
              min="905"
              max="1015"
              step="1"
              value={simPressure}
              onChange={(e) => setSimPressure(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>912 hPa (1999 Low)</span>
              <span>1013 hPa (Standard)</span>
            </div>
          </div>

          {/* Dynamic IMD Cyclone Category Badge */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500">IMD CYCLONE CLASSIFICATION</span>
            <div className={`font-bold text-sm ${cat.color} mt-1`}>
              {cat.label}
            </div>
            <span className="text-[10px] text-slate-400">{cat.tier} Emergency Level</span>
          </div>

          {/* Benchmark Ratio vs 1999 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500">1999 SUPER CYCLONE RATIO</span>
            <div className="text-xl font-bold text-white mt-1">
              {comparison ? `${comparison.current_event.wind_ratio_vs_1999}x` : '0.33x'}
            </div>
            <span className="text-[10px] text-cyan-400">
              Pressure Diff: {comparison ? `+${comparison.current_event.pressure_differential_vs_1999} hPa` : '+86 hPa'}
            </span>
          </div>

        </div>

        {comparison && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[11px] text-slate-300 leading-relaxed">
            <span className="text-cyan-300 font-semibold">Central AI Risk Synthesis: </span>
            {comparison.assessment}
          </div>
        )}
      </div>

      {/* Main Grid: Historical Cyclone Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Historical Disaster Dossier */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold font-mono text-sm">
                <BookOpen className="w-4 h-4" />
                <span>ODISHA HISTORICAL DISASTER KNOWLEDGE ARCHIVE</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Verified IMD / OSDMA Records</span>
            </div>

            {/* Disaster Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 font-mono text-xs mb-4">
              {historical.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisaster(d)}
                  className={`px-3 py-2 rounded-xl border transition-all text-left shrink-0 cursor-pointer ${
                    selectedDisaster?.id === d.id
                      ? 'bg-rose-500/20 border-rose-500/60 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs">{d.name}</div>
                  <div className="text-[10px] text-slate-400">{d.dates}</div>
                </button>
              ))}
            </div>

            {/* Selected Historical Dossier Card */}
            {selectedDisaster && (
              <div className="space-y-4 font-mono text-xs">
                {/* Meteorological Parameters Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">PEAK WIND SPEED</span>
                    <span className="text-xl font-bold text-rose-400 mt-1 block">
                      {selectedDisaster.max_wind_kmh} km/h
                    </span>
                    <span className="text-[10px] text-slate-500">Cat 5 Equivalent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CENTRAL PRESSURE</span>
                    <span className="text-xl font-bold text-purple-400 mt-1 block">
                      {selectedDisaster.lowest_pressure_hpa} hPa
                    </span>
                    <span className="text-[10px] text-slate-500">Historic Low</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">LANDFALL LOCATION</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate" title={selectedDisaster.landfall_location}>
                      {selectedDisaster.landfall_location}
                    </span>
                    <span className="text-[10px] text-slate-500">Odisha Coastline</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CASUALTIES</span>
                    <span className="text-sm font-bold text-white mt-1 block truncate">
                      {selectedDisaster.official_casualties}
                    </span>
                    <span className="text-[10px] text-slate-500">Official Toll</span>
                  </div>
                </div>

                {/* Narrative Impact */}
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="font-semibold text-rose-300">INFRASTRUCTURE & URBAN IMPACT IN BHUBANESWAR:</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedDisaster.damage_description}
                  </p>
                </div>

                {/* Lessons Learned */}
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="font-semibold text-emerald-300">DISASTER POLICY & RECONSTRUCTION LEGACY:</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedDisaster.lessons_learned}
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 italic">
                  Verified Data Citation: {selectedDisaster.source}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Emergency Shelter Matrix */}
        <div className="space-y-4 font-mono text-xs">
          
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <LifeBuoy className="w-4 h-4" />
              <span>BHUBANESWAR CYCLONE SHELTERS</span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Designated multi-purpose cyclone shelters along the Jaydev Vihar corridor:
            </p>

            <div className="space-y-2">
              {[
                { name: "Jaydev Vihar High School Shelter", capacity: "1,200", status: "READY", distance: "0.4 km" },
                { name: "Acharya Vihar Community Hall", capacity: "850", status: "READY", distance: "1.1 km" },
                { name: "Utkal University Indoor Stadium", capacity: "3,500", status: "READY", distance: "2.3 km" },
                { name: "Nayapalli Kalyan Mandap", capacity: "950", status: "READY", distance: "1.5 km" }
              ].map((sh, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">{sh.name}</span>
                    <span className="text-[10px] text-slate-400">Capacity: {sh.capacity} persons • {sh.distance}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {sh.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Safety Directives */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold mb-2 pb-2 border-b border-slate-800">
              <LifeBuoy className="w-4 h-4" />
              <span>EMERGENCY HELPLINES (24/7)</span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span>State Emergency Operations (SEOC):</span>
                <span className="text-rose-400 font-bold">1070</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span>Bhubaneswar Municipal Helpline:</span>
                <span className="text-cyan-400 font-bold">1929</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span>Disaster Fire & Rescue:</span>
                <span className="text-amber-400 font-bold">101 / 112</span>
              </li>
              <li className="flex justify-between">
                <span>Ambulance Emergency:</span>
                <span className="text-emerald-400 font-bold">108</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )}
</div>
  );
}
