import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe, Compass, Radio, CloudRain, Wind, Thermometer, Gauge } from 'lucide-react';

export default function WeatherGlobeViewport({ activeLayer = 'wind', weatherData = null }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const radarSweepAngleRef = useRef(0);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [radarSweepActive, setRadarSweepActive] = useState(true);

  // Key global weather targets
  const GLOBAL_CITIES = [
    { name: "Bhubaneswar (Odisha, India)", coords: [85.8245, 20.2961], temp: "30°C", condition: "Scattered Coastal Clouds", wind: "14 km/h", radarStation: "Paradip S-Band Doppler" },
    { name: "New Delhi, India", coords: [77.2090, 28.6139], temp: "26°C", condition: "Clear Haze", wind: "8 km/h", radarStation: "Palam Doppler" },
    { name: "Tokyo, Japan", coords: [139.6917, 35.6895], temp: "16°C", condition: "Partly Cloudy", wind: "18 km/h", radarStation: "JMA Tokyo Radar" },
    { name: "London, United Kingdom", coords: [-0.1278, 51.5074], temp: "12°C", condition: "Light Drizzle", wind: "22 km/h", radarStation: "MetOffice Chenies" },
    { name: "New York, USA", coords: [-74.0060, 40.7128], temp: "14°C", condition: "Breezy", wind: "26 km/h", radarStation: "NEXRAD KOKX" },
    { name: "Sydney, Australia", coords: [151.2093, -33.8688], temp: "22°C", condition: "Sunny", wind: "15 km/h", radarStation: "BoM Terrey Hills" }
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Initialize MapLibre with dark satellite basemap
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'satellite-earth': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: '&copy; Esri World Imagery'
            }
          },
          layers: [
            {
              id: 'satellite-layer',
              type: 'raster',
              source: 'satellite-earth',
              minzoom: 0,
              maxzoom: 18
            }
          ]
        },
        center: [85.8245, 20.2961], // Centered over India / Bhubaneswar
        zoom: 3.2,
        pitch: 30,
        bearing: 0,
        antialias: true
      });

      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

      map.on('load', () => {
        // Add animated weather radar echo rings around India / Bay of Bengal
        const radarFeatures = [
          { name: "Bay of Bengal Precipitation Cell", center: [88.5, 18.2], color: "#00f0ff" },
          { name: "Odisha Coastal Front", center: [86.2, 20.1], color: "#10b981" },
          { name: "Arabian Sea Moisture Arc", center: [71.5, 16.5], color: "#38bdf8" }
        ];

        // Global City Markers with interactive weather popups
        GLOBAL_CITIES.forEach((city) => {
          const el = document.createElement('div');
          el.className = 'w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_16px_#00f0ff] cursor-pointer hover:scale-125 transition-transform';
          
          const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
            <div style="font-family: monospace; font-size: 11px; padding: 4px; color: #0f172a;">
              <strong style="color: #0284c7; font-size: 12px;">${city.name}</strong><br/>
              <span style="font-size: 11px; font-weight: bold;">🌡️ ${city.temp} • ${city.condition}</span><br/>
              <span style="color: #64748b; font-size: 10px;">💨 Wind: ${city.wind}</span><br/>
              <span style="color: #10b981; font-size: 9px;">📡 Radar: ${city.radarStation}</span>
            </div>
          `);

          new maplibregl.Marker({ element: el })
            .setLngLat(city.coords)
            .setPopup(popup)
            .addTo(map);
        });

        // Mouse hover coordinate & atmospheric tracker
        map.on('mousemove', (e) => {
          setHoveredLocation({
            lat: e.lngLat.lat.toFixed(2),
            lng: e.lngLat.lng.toFixed(2)
          });
        });

        map.resize();
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.warn("Weather globe init warning:", err);
    }
  }, []);

  return (
    <div className="relative w-full h-[340px] xs:h-[380px] sm:h-[450px] md:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden border border-blue-500/40 bg-[#030712] shadow-2xl">
      {/* 3D Map Viewport (Earth / India / Global) */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Submarine Rotating Radar Sweep Overlay */}
      {radarSweepActive && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Concentric Radar Rings */}
          <div className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full border border-cyan-500/20 absolute" />
          <div className="w-[220px] sm:w-[360px] h-[220px] sm:h-[360px] rounded-full border border-cyan-500/25 absolute" />
          <div className="w-[140px] sm:w-[220px] h-[140px] sm:h-[220px] rounded-full border border-cyan-500/30 absolute" />
          <div className="w-[70px] sm:w-[100px] h-[70px] sm:h-[100px] rounded-full border border-cyan-500/35 absolute" />
          
          {/* Crosshair lines */}
          <div className="w-full h-[1px] bg-cyan-500/15 absolute" />
          <div className="h-full w-[1px] bg-cyan-500/15 absolute" />

          {/* Submarine Sweep Beam */}
          <div className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full overflow-hidden absolute">
            <div className="w-full h-full bg-gradient-to-tr from-cyan-400/25 via-emerald-400/10 to-transparent animate-spin [animation-duration:6s]" />
          </div>
        </div>
      )}

      {/* Top Left Telemetry HUD */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-10 glass-panel p-2 sm:p-3 rounded-xl border border-blue-500/40 text-[10px] sm:text-xs font-mono space-y-0.5 sm:space-y-1 backdrop-blur-md shadow-2xl max-w-[60%] sm:max-w-none">
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-cyan-400 font-bold text-[10px] sm:text-[11px]">
          <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-cyan-400 shrink-0" />
          <span className="truncate">DOPPLER RADAR SWEEP</span>
        </div>
        <div className="text-white text-[9px] sm:text-[10px] truncate">
          Focus: <strong className="text-cyan-300">India / Bay of Bengal</strong>
        </div>
        <div className="text-slate-400 text-[9px] sm:text-[10px] hidden sm:block">
          Interactive 3D Earth: Drag to rotate
        </div>
      </div>

      {/* Top Right Controls & Layer Status */}
      <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-10 flex flex-col items-end gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono">
        <button
          onClick={() => setRadarSweepActive(!radarSweepActive)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border font-semibold flex items-center space-x-1 sm:space-x-1.5 backdrop-blur-md transition-all cursor-pointer ${
            radarSweepActive
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/80 border-slate-700 text-slate-400'
          }`}
        >
          <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">{radarSweepActive ? 'RADAR: ACTIVE' : 'RADAR: PAUSED'}</span>
          <span className="xs:hidden">{radarSweepActive ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({ center: [85.8245, 20.2961], zoom: 4.5, pitch: 35, bearing: -5 });
            }
          }}
          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-950/80 border border-blue-600 text-blue-200 hover:bg-blue-900 transition-colors backdrop-blur-md flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shadow-lg"
          title="Snap to Bhubaneswar / Odisha"
        >
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
          <span>SNAP ODISHA</span>
        </button>
      </div>

      {/* Bottom Coordinates & Live Scan Legend */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-10 glass-panel p-2 sm:p-2.5 rounded-xl border border-slate-800 text-[10px] sm:text-xs font-mono flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-[11px]">
          <span className="text-slate-400 hidden xs:inline">Doppler Reflectivity:</span>
          <div className="flex items-center space-x-1">
            <span className="w-4 sm:w-5 h-2 bg-blue-500 rounded-sm" title="Light drizzle" />
            <span className="w-4 sm:w-5 h-2 bg-cyan-400 rounded-sm" title="Moderate shower" />
            <span className="w-4 sm:w-5 h-2 bg-emerald-400 rounded-sm" title="Heavy rain" />
            <span className="w-4 sm:w-5 h-2 bg-amber-400 rounded-sm" title="Severe squall" />
            <span className="w-4 sm:w-5 h-2 bg-rose-500 rounded-sm" title="Tropical cyclone eyewall" />
          </div>
          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-bold whitespace-nowrap">0 → 65 dBZ</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] text-slate-300">
          {hoveredLocation && (
            <span className="hidden md:inline">CURSOR: <strong className="text-white">{hoveredLocation.lat}° N, {hoveredLocation.lng}° E</strong></span>
          )}
          <span className="text-cyan-400 truncate">SATELLITE GLOBAL</span>
        </div>
      </div>
    </div>
  );
}
