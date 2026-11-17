import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  Truck, 
  Activity, 
  Clock, 
  Camera, 
  Send, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Crosshair
} from 'lucide-react';
import CityMap from '../../map/CityMap';
import { 
  fetchWasteReports, 
  submitWasteReport, 
  markWasteCleaned, 
  fetchWasteAnalytics, 
  fetchOptimizedRoute 
} from '../../services/api';

export default function WastePage() {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cleaningLoading, setCleaningLoading] = useState(false);

  // New report form state with default coordinates in corridor
  const [form, setForm] = useState({
    title: '',
    location_name: 'Jaydev Vihar Square (Near Overpass)',
    latitude: 20.2982,
    longitude: 85.8260,
    category: 'plastic',
    priority: 'high',
    notes: '',
    photo_url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80'
  });

  async function loadData() {
    try {
      const [rData, aData, rtData] = await Promise.all([
        fetchWasteReports(),
        fetchWasteAnalytics(),
        fetchOptimizedRoute()
      ]);
      if (rData && rData.reports) {
        setReports(rData.reports);
        if (rData.reports.length > 0) setSelectedReport(rData.reports[0]);
      }
      if (aData) setAnalytics(aData);
      if (rtData) setOptimizedRoute(rtData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // When user clicks anywhere on map, automatically open modal or set coords
  const handleMapClick = (coords) => {
    setForm(prev => ({
      ...prev,
      latitude: round(coords.lat, 4),
      longitude: round(coords.lng, 4),
      location_name: `Bhubaneswar Corridor (${round(coords.lat, 4)}° N, ${round(coords.lng, 4)}° E)`
    }));
    setShowReportModal(true);
  };

  const round = (val, dec) => Number(Math.round(val + 'e' + dec) + 'e-' + dec);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSubmitting(true);
    try {
      const res = await submitWasteReport(form);
      if (res && res.report) {
        setReports([res.report, ...reports]);
        setSelectedReport(res.report);
        setShowReportModal(false);
        setForm({
          title: '',
          location_name: 'Jaydev Vihar Square (East Flank)',
          latitude: 20.2982,
          longitude: 85.8260,
          category: 'plastic',
          priority: 'high',
          notes: '',
          photo_url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80'
        });
        
        // Refresh analytics & route
        const [aData, rtData] = await Promise.all([
          fetchWasteAnalytics(),
          fetchOptimizedRoute()
        ]);
        if (aData) setAnalytics(aData);
        if (rtData) setOptimizedRoute(rtData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkCleaned = async (reportId) => {
    setCleaningLoading(true);
    try {
      const res = await markWasteCleaned(reportId, "Verified cleared and sanitized by BMC sanitation crew.");
      if (res && res.report) {
        setReports(reports.map(r => r.id === reportId ? res.report : r));
        setSelectedReport(res.report);
        const [aData, rtData] = await Promise.all([
          fetchWasteAnalytics(),
          fetchOptimizedRoute()
        ]);
        if (aData) setAnalytics(aData);
        if (rtData) setOptimizedRoute(rtData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCleaningLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Trash2 className="w-4 h-4" />
            <span>MUNICIPAL SANITATION // GEOSPATIAL WASTE INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            SMART WASTE & CLEANING OPERATIONS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time Red (Unattended) & Green (Cleaned) spatial workflow for Bhubaneswar sanitation workers.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-mono text-xs font-bold transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REPORT NEW WASTE INCIDENT</span>
          </button>
        </div>
      </div>

      {/* Top Sanitation Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
        <div className="glass-panel p-3 sm:p-3.5 border-l-4 border-l-rose-500">
          <div className="text-[10px] text-slate-400">UNATTENDED INCIDENTS</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">
            {analytics?.pending_cleaning_red ?? reports.filter(r => r.status === 'REPORTED').length}
          </div>
          <div className="text-[10px] text-slate-400 truncate">Cleaning Required</div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5 border-l-4 border-l-emerald-500">
          <div className="text-[10px] text-slate-400">CLEANED &amp; VERIFIED</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
            {analytics?.completed_cleaned_green ?? reports.filter(r => r.status === 'CLEANED').length}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold truncate">Completed Workflow</div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5">
          <div className="text-[10px] text-slate-400">ACTIVE WORKERS</div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {analytics?.active_workers_on_duty || 18}
          </div>
          <div className="text-[10px] text-cyan-400 truncate">Squads On Shift</div>
        </div>

        <div className="glass-panel p-3 sm:p-3.5">
          <div className="text-[10px] text-slate-400">RESOLUTION RATE</div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-1">
            {analytics?.resolution_rate_percent || 75.0}%
          </div>
          <div className="text-[10px] text-slate-400 truncate">turnaround: ~3.4h</div>
        </div>
      </div>

      {/* Main Grid: Dedicated Waste Map + Incidents List / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Map Viewport (2 cols) */}
        <div className="lg:col-span-2 h-[340px] xs:h-[380px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <CityMap 
            mode="waste" 
            wasteReports={reports}
            collectionRouteWaypoints={optimizedRoute?.waypoints || []}
            onMarkerClick={(report) => setSelectedReport(report)}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Right Incident Feed & Verification Panel */}
        <div className="space-y-4 font-mono text-xs">
          
          {/* Selected Incident Detail Card */}
          {selectedReport ? (
            <div className="glass-panel p-4 border border-cyan-500/30">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-[10px] text-slate-400 font-bold">INCIDENT #{selectedReport.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedReport.status === 'CLEANED' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                }`}>
                  {selectedReport.status === 'CLEANED' ? 'CLEANED & VERIFIED (GREEN)' : 'UNATTENDED (RED)'}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-white text-sm leading-snug">
                  {selectedReport.title}
                </div>
                
                <div className="flex items-center space-x-1.5 text-slate-300 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{selectedReport.location_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">CATEGORY</span>
                    <span className="text-cyan-300 font-semibold uppercase">{selectedReport.category}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">PRIORITY</span>
                    <span className={`font-semibold uppercase ${selectedReport.priority === 'critical' ? 'text-rose-400' : 'text-amber-300'}`}>
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 leading-relaxed">
                  <span className="text-slate-500 block mb-0.5">FIELD REPORT NOTES:</span>
                  {selectedReport.notes}
                </div>

                {/* Mark Cleaned Worker Button (Turns Red into Green) */}
                {selectedReport.status === 'REPORTED' ? (
                  <button
                    onClick={() => handleMarkCleaned(selectedReport.id)}
                    disabled={cleaningLoading}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{cleaningLoading ? 'RECORDING CONFIRMATION...' : 'MARK AS CLEANED (TURN GREEN)'}</span>
                  </button>
                ) : (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-center text-[10px] flex items-center justify-center space-x-1.5 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>CLEANING COMPLETED & RECORDED</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 text-center text-slate-500">
              Select an incident marker on the map to inspect details.
            </div>
          )}

          {/* Incidents Feed List */}
          <div className="glass-panel p-3 max-h-[220px] overflow-y-auto space-y-1.5">
            <div className="text-[10px] text-slate-400 font-bold px-1 mb-1">
              CORRIDOR INCIDENT LEDGER:
            </div>
            {reports.map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-2 rounded-lg border text-[11px] cursor-pointer transition-colors flex items-center justify-between ${
                  selectedReport?.id === r.id 
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-white' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-[9px] text-slate-500">{r.location_name}</div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  r.status === 'CLEANED' ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
                }`} />
              </div>
            ))}
          </div>

          {/* Collection Truck Routing Box */}
          {optimizedRoute && (
            <div className="glass-panel p-3 font-mono text-[11px]">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>DIJKSTRA OPTIMIZED TRUCK ROUTE</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Vehicle: {optimizedRoute.vehicle_assigned} • Covering {optimizedRoute.total_distance_km} km sweep through all pending RED sites. Rendered on map as cyan dashed line.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* New Incident Submission Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="glass-panel p-4 sm:p-6 max-w-md w-[95%] sm:w-full max-h-[92vh] overflow-y-auto border border-cyan-500/40 shadow-2xl font-mono text-xs animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">SUBMIT WASTE REPORT</span>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded text-slate-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">INCIDENT TITLE</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Garbage accumulation near Jaydev Vihar underpass"
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">LOCATION IN CORRIDOR</label>
                <input
                  type="text"
                  required
                  value={form.location_name}
                  onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">LATITUDE</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">LONGITUDE</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none"
                  >
                    <option value="plastic">Plastic Waste</option>
                    <option value="construction">Construction Debris</option>
                    <option value="organic">Organic / Market</option>
                    <option value="drain_blockage">Drain Blockage</option>
                    <option value="overflowing_bins">Overflowing Bin</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PRIORITY</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">OBSERVATION DETAILS</label>
                <textarea
                  rows="2"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Detail waste volume, road obstruction, or drain blockage..."
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
                >
                  {submitting ? 'LOGGING INCIDENT...' : 'SUBMIT REPORT (TURN RED)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
