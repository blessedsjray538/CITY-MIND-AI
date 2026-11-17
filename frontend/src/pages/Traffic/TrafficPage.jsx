import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertOctagon, 
  Clock, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  ArrowRight,
  Radio,
  Zap,
  Map
} from 'lucide-react';
import CityMap from '../../map/CityMap';
import { 
  fetchTrafficState, 
  toggleRoadClosure, 
  optimizeTrafficSignal, 
  fetchTrafficPredictions 
} from '../../services/api';

const BASEMAP_OPTIONS = [
  { id: 'dark', label: 'DARK' },
  { id: 'osm', label: 'OSM' },
  { id: 'satellite', label: 'SATELLITE' },
  { id: 'streets', label: 'STREETS' },
];

export default function TrafficPage() {
  const [trafficData, setTrafficData] = useState(null);
  const [roadsState, setRoadsState] = useState(null);
  const [roadClosureActive, setRoadClosureActive] = useState(false);
  const [closureLoading, setClosureLoading] = useState(false);
  const [signalResult, setSignalResult] = useState(null);
  const [optimizingSignal, setOptimizingSignal] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [basemap, setBasemap] = useState('dark');

  // Fetch initial traffic corridor status
  useEffect(() => {
    async function init() {
      const data = await fetchTrafficState();
      if (data) {
        setTrafficData(data);
        if (data.state?.roads) setRoadsState(data.state.roads);
      }
      const preds = await fetchTrafficPredictions();
      if (preds && preds.predictions) setPredictions(preds.predictions);
    }
    init();

    // Poll road congestion condition every 4 seconds
    const interval = setInterval(async () => {
      const data = await fetchTrafficState();
      if (data && data.state?.roads) {
        setRoadsState(data.state.roads);
        setTrafficData(data);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleClosure = async () => {
    setClosureLoading(true);
    try {
      const targetState = !roadClosureActive;
      const res = await toggleRoadClosure("road_jv_av", targetState);
      setRoadClosureActive(targetState);
      if (res && res.affected_state) {
        setRoadsState(res.affected_state.roads);
        setTrafficData(prev => ({
          ...prev,
          state: {
            ...prev?.state,
            roads: res.affected_state.roads,
            average_speed_kmh: res.affected_state.average_speed_kmh
          }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClosureLoading(false);
    }
  };

  const handleOptimizeSignals = async () => {
    setOptimizingSignal(true);
    try {
      const res = await optimizeTrafficSignal("Jaydev Vihar Square Junction", 75);
      setSignalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizingSignal(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
            <Car className="w-4 h-4" />
            <span>MOBILITY INTELLIGENCE // DYNAMIC CONGESTION NETWORK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            TRAFFIC OPERATIONS & WHAT-IF SIMULATOR
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Color-coded flow density, real-time detour redistribution, and Webster adaptive signal control.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CONGESTION ENGINE: LIVE</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300">
            COLOR POLYLINES
          </span>
        </div>
      </div>

      {/* Reroute Warning Banner (When Road is Closed) */}
      {roadClosureActive && (
        <div className="p-3.5 sm:p-4 rounded-xl border border-rose-500/50 bg-rose-950/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-xs gap-3 animate-pulse">
          <div className="flex items-start sm:items-center space-x-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-rose-300">ROAD CLOSURE DETOUR ACTIVE:</span> Jaydev Vihar Flyover is closed (Marked in RED).
              <span className="text-slate-300 block text-[11px] mt-0.5">
                Vehicles rerouted via Nandankanan Expressway (ORANGE) &amp; Sainik School Road.
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleClosure}
            className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center"
          >
            REOPEN ROAD
          </button>
        </div>
      )}

      {/* Top Simulation Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="glass-panel p-3 sm:p-3.5 font-mono">
          <div className="text-[10px] text-slate-400">MONITORED CORRIDORS</div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">5 ARTERIES</div>
          <div className="text-[10px] text-cyan-400 mt-0.5 truncate">NH-16 Bhubaneswar</div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5 font-mono">
          <div className="text-[10px] text-slate-400">CORRIDOR AVG SPEED</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
            {trafficData?.state?.average_speed_kmh || 38.5} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Limit: 60 km/h</div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5 font-mono">
          <div className="text-[10px] text-slate-400">CONGESTION LEVEL</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">
            {roadClosureActive ? '76.4%' : '48.2%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {roadClosureActive ? 'Severe Reroute Spikes' : 'Balanced Flow Index'}
          </div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5 font-mono">
          <div className="text-[10px] text-slate-400">ACTIVE CLOSURES</div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {roadClosureActive ? '1 ARTERY' : '0 (NONE)'}
          </div>
          <div className={`text-[10px] mt-0.5 font-semibold truncate ${roadClosureActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            {roadClosureActive ? 'Jaydev Vihar Closed' : 'All Arteries Clear'}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map with Real Live Vehicles + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Traffic Map with Color-Coded Congestion Corridors (2 cols) */}
        <div className="lg:col-span-2 h-[340px] xs:h-[380px] sm:h-[450px] md:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <CityMap 
            mode="traffic" 
            roadsState={roadsState}
            roadClosureActive={roadClosureActive}
            basemap={basemap}
          />
        </div>

        {/* Right Operations Console */}
        <div className="space-y-4 font-mono text-xs">
          
          {/* Simulation Controls Card */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4" />
              <span>ROAD INCIDENT SIMULATOR</span>
            </div>

            {/* What-If Road Closure Simulation Button */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold">Simulate Road Closure</span>
                <span className="text-[10px] text-cyan-400">NH-16 Flyover</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Trigger an intentional roadblock between Jaydev Vihar and Acharya Vihar to test rerouting and color shifts.
              </p>
              <button
                onClick={handleToggleClosure}
                disabled={closureLoading}
                className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  roadClosureActive
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>{roadClosureActive ? 'REOPEN JAYDEV VIHAR ROAD' : 'CLOSE JAYDEV VIHAR ROAD (TURN RED)'}</span>
              </button>
            </div>
          </div>

          {/* Basemap Tile Switcher */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Map className="w-4 h-4" />
              <span>BASEMAP TILE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BASEMAP_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBasemap(opt.id)}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    basemap === opt.id
                      ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                      : 'bg-slate-900/80 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Traffic Signal Timing Optimization */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Cpu className="w-4 h-4" />
                <span>SIGNAL OPTIMIZER</span>
              </div>
              <span className="text-[9px] text-slate-400">Jaydev Vihar Sq</span>
            </div>

            <button
              onClick={handleOptimizeSignals}
              disabled={optimizingSignal}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{optimizingSignal ? 'CALCULATING OPTIMAL PHASE...' : 'OPTIMIZE SIGNAL TIMINGS'}</span>
            </button>

            {signalResult && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/60 space-y-1.5 animate-in fade-in">
                <div className="flex justify-between text-slate-300">
                  <span>Cycle Duration:</span>
                  <span className="text-emerald-400 font-bold">
                    {signalResult.current_cycle_seconds}s → {signalResult.recommended_cycle_seconds}s
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Corridor Delay Reduction:</span>
                  <span className="text-emerald-400 font-bold">
                    -{signalResult.estimated_delay_reduction_pct}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Idle Carbon Offset:</span>
                  <span className="text-emerald-400 font-bold">
                    -{signalResult.co2_reduction_kg_hour} kg CO2/h
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Predictive Congestion Forecast */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-slate-300 font-bold mb-3 pb-2 border-b border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>CORRIDOR CONGESTION FORECAST</span>
            </div>
            <div className="space-y-2">
              {predictions.slice(0, 3).map((pred, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-white font-semibold">{pred.corridor_segment || 'Jaydev Vihar - Acharya Vihar'}</span>
                    <div className="text-[10px] text-slate-400">Confidence: {Math.round(pred.confidence * 100)}%</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-400 border border-amber-800">
                    {pred.predicted_condition?.toUpperCase() || 'MODERATE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
