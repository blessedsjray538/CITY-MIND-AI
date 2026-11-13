import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Car, 
  Trash2, 
  Leaf, 
  Clock 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { fetchAnalyticsOverview } from '../../services/api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadData() {
      const data = await fetchAnalyticsOverview();
      if (data) setAnalytics(data);
    }
    loadData();
  }, []);

  const trafficData = analytics?.trends?.traffic_hourly || [
    { hour: "06:00", speed: 48, congestion: 20 },
    { hour: "08:00", speed: 32, congestion: 65 },
    { hour: "10:00", speed: 26, congestion: 82 },
    { hour: "12:00", speed: 38, congestion: 45 },
    { hour: "14:00", speed: 42, congestion: 38 },
    { hour: "16:00", speed: 34, congestion: 60 },
    { hour: "18:00", speed: 24, congestion: 88 },
    { hour: "20:00", speed: 31, congestion: 70 },
    { hour: "22:00", speed: 46, congestion: 25 }
  ];

  const wasteData = analytics?.trends?.waste_weekly_resolution || [
    { day: "Mon", reported: 14, cleaned: 12 },
    { day: "Tue", reported: 18, cleaned: 17 },
    { day: "Wed", reported: 11, cleaned: 11 },
    { day: "Thu", reported: 16, cleaned: 15 },
    { day: "Fri", reported: 22, cleaned: 20 },
    { day: "Sat", reported: 25, cleaned: 22 },
    { day: "Sun", reported: 13, cleaned: 13 }
  ];

  const aqiData = analytics?.trends?.aqi_weekly || [
    { day: "Mon", aqi: 88, pm25: 38 },
    { day: "Tue", aqi: 94, pm25: 42 },
    { day: "Wed", aqi: 105, pm25: 48 },
    { day: "Thu", aqi: 92, pm25: 41 },
    { day: "Fri", aqi: 98, pm25: 44 },
    { day: "Sat", aqi: 85, pm25: 36 },
    { day: "Sun", aqi: 79, pm25: 32 }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>EXECUTIVE INTELLIGENCE // PERFORMANCE ANALYTICS & REPORTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            CITYMIND ANALYTICS & METRICS SUITE
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Historical trends, department SLA turnaround indices, and predictive corridor modeling.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => alert("Report compiled: Bhubaneswar_JaydevVihar_Corridor_Briefing.pdf")}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CORRIDOR REPORT</span>
          </button>
        </div>
      </div>

      {/* KPI Scores Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-3.5">
          <div className="text-[10px] text-slate-400">OVERALL CITY HEALTH INDEX</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">94.2 / 100</div>
          <div className="text-[10px] text-emerald-400">+2.4% vs last week</div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] text-slate-400">PEAK SPEED DEVIATION</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">-38% (18:00)</div>
          <div className="text-[10px] text-slate-400">Jaydev Vihar bottleneck</div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] text-slate-400">WASTE RESOLUTION EFFICIENCY</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">92.4%</div>
          <div className="text-[10px] text-slate-400">110 / 119 weekly cleared</div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] text-slate-400">AVERAGE AIR QUALITY (7-DAY)</div>
          <div className="text-2xl font-bold text-white mt-1">91 AQI</div>
          <div className="text-[10px] text-emerald-400">Moderate Tier</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        
        {/* Chart 1: Hourly Traffic Speed & Congestion */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Car className="w-4 h-4" />
              <span>HOURLY TRAFFIC SPEED (KM/H) & CONGESTION (%)</span>
            </div>
            <span className="text-[10px] text-slate-500">Corridor NH-16</span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" textAnchor="end" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} 
                />
                <Legend />
                <Line type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#00f0ff" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="congestion" name="Congestion (%)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Waste Reports vs Cleaned */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Trash2 className="w-4 h-4" />
              <span>WEEKLY WASTE REPORTS (RED) VS CLEANED (GREEN)</span>
            </div>
            <span className="text-[10px] text-slate-500">BMC Ward 22 & 23</span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} 
                />
                <Legend />
                <Bar dataKey="reported" name="Reported (Red)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cleaned" name="Cleaned (Green)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Air Quality & PM2.5 Trend */}
        <div className="glass-panel p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <Leaf className="w-4 h-4" />
              <span>7-DAY AIR QUALITY INDEX (AQI) & PM2.5 VARIATION</span>
            </div>
            <span className="text-[10px] text-slate-500">Nayapalli / Jaydev Vihar Sensor</span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aqiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} 
                />
                <Legend />
                <Line type="monotone" dataKey="aqi" name="Overall AQI" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
