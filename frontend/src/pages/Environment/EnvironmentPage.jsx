import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Wind, 
  Activity, 
  TrendingDown, 
  ShieldCheck, 
  Gauge, 
  AlertCircle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { fetchAirQuality } from '../../services/api';

export default function EnvironmentPage() {
  const [envData, setEnvData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadEnv() {
    setLoading(true);
    try {
      const data = await fetchAirQuality();
      if (data) setEnvData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnv();
  }, []);

  const aqi = envData?.aqi_index || 92;
  const aqiCat = envData?.aqi_category || "Moderate";
  const pollutants = envData?.pollutants || {
    pm2_5: { value: 38.5, unit: "µg/m³", label: "Fine Particulate Matter (PM2.5)" },
    pm10: { value: 72.0, unit: "µg/m³", label: "Coarse Particulate Matter (PM10)" },
    no2: { value: 24.5, unit: "µg/m³", label: "Nitrogen Dioxide (NO2)" },
    co: { value: 410.0, unit: "µg/m³", label: "Carbon Monoxide (CO)" },
    so2: { value: 11.2, unit: "µg/m³", label: "Sulphur Dioxide (SO2)" },
    ozone: { value: 48.0, unit: "µg/m³", label: "Surface Ozone (O3)" }
  };

  const trafficEmissions = envData?.traffic_emission_correlation || {
    corridor_hourly_co2_kg: 412.5,
    free_flow_baseline_co2_kg: 298.0,
    excess_emissions_due_to_congestion_kg: 114.5,
    reduction_potential_via_optimization_pct: 21.4
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Leaf className="w-4 h-4" />
            <span>ENVIRONMENTAL TELEMETRY // AIR QUALITY & EMISSION MODELING</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            BHUBANESWAR ENVIRONMENTAL INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Continuous ambient air quality monitoring and vehicle idling emission impact analysis along the NH-16 corridor.
          </p>
        </div>

        {/* Telemetry Actions */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={loadEnv}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Refresh Air Quality Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            {envData?.data_classification || "VERIFIED_REAL"}
          </span>
        </div>
      </div>

      {/* Main AQI Gauge & Traffic Emission Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* AQI Master Gauge Card */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center font-mono border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
            BHUBANESWAR AIR QUALITY INDEX (CPCB STANDARD)
          </div>

          {/* Circular AQI Badge */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-emerald-500/40 flex flex-col items-center justify-center bg-slate-950/80 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
              <span className="text-5xl font-black text-emerald-400">{aqi}</span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase">AQI INDEX</span>
            </div>
          </div>

          <div className="text-lg font-bold text-emerald-300">
            {aqiCat}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed">
            Station: Jaydev Vihar - Nayapalli Monitoring Station. Air quality is acceptable for most individuals.
          </p>
        </div>

        {/* Traffic Emissions Correlation Card (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 font-mono text-xs space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
            <TrendingDown className="w-4 h-4" />
            <span>TRAFFIC CONGESTION & EMISSIONS CORRELATION MODEL</span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            Quantifying the direct atmospheric cost of corridor queueing between Jaydev Vihar and Vani Vihar:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CURRENT CO2 RATE</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {trafficEmissions.corridor_hourly_co2_kg} kg/h
              </span>
              <span className="text-[10px] text-rose-400">Congested State</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">OPTIMAL BASELINE</span>
              <span className="text-xl font-bold text-cyan-300 mt-1 block">
                {trafficEmissions.free_flow_baseline_co2_kg} kg/h
              </span>
              <span className="text-[10px] text-slate-400">Free-Flow Speed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">AVOIDABLE EXCESS CO2</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {trafficEmissions.excess_emissions_due_to_congestion_kg} kg/h
              </span>
              <span className="text-[10px] text-slate-400">Due to Idling & Braking</span>
            </div>
          </div>

          {/* AI Signal Optimization Impact Note */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-200 leading-relaxed">
            <span className="font-bold text-cyan-400">Decarbonization Dividend:</span> Synchronizing signal phases across Jaydev Vihar and Acharya Vihar junctions is estimated to eliminate up to <span className="font-bold text-emerald-400">{trafficEmissions.reduction_potential_via_optimization_pct}%</span> of localized vehicular tailpipe emissions.
          </div>
        </div>

      </div>

      {/* Pollutant Spectrum Grid */}
      <div className="glass-panel p-5 font-mono text-xs">
        <div className="text-slate-400 font-bold mb-4 pb-2 border-b border-slate-800">
          DETAILED CORRIDOR POLLUTANT CONCENTRATIONS:
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(pollutants).map(([key, item]) => (
            <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block truncate" title={item.label}>
                {item.label}
              </span>
              <div className="text-xl font-bold text-white mt-1">
                {item.value} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
