import React, { useState } from 'react';
import { Building2, Layers, Compass, Eye, ShieldCheck, MapPin, Zap, Maximize2 } from 'lucide-react';
import CityMap from '../../map/CityMap';

export default function DigitalTwinPage() {
  const [basemap, setBasemap] = useState("dark");
  const [activeLayers, setActiveLayers] = useState({
    buildings: true,
    landmarks: true,
    drainage: true
  });

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const landmarks = [
    { name: "Jaydev Vihar Square", type: "Major Arterial Flyover & Grade Junction", coords: "20.2974° N, 85.8249° E" },
    { name: "Acharya Vihar Square", type: "NH-16 & Sainik School Corridor", coords: "20.3023° N, 85.8340° E" },
    { name: "Vani Vihar Square", type: "Utkal University Primary Portal", coords: "20.3015° N, 85.8452° E" },
    { name: "Pathani Samanta Planetarium", type: "Science & Civic Heritage Landmark", coords: "20.3010° N, 85.8306° E" },
    { name: "Ekamra Kanan (RPRC)", type: "Regional Botanical Conservation Zone", coords: "20.3020° N, 85.8150° E" }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>URBAN GEOSPATIAL TWIN // 3D GIS ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            BHUBANESWAR DIGITAL TWIN
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Spatial foundation across the Jaydev Vihar – Acharya Vihar – Vani Vihar development corridor.
          </p>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            CRS: EPSG:4326 (WGS84)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            Fidelity: High 3D
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side Layer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Map Viewport (Takes 3 columns) */}
        <div className="lg:col-span-3 h-[580px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl relative">
          <CityMap mode="digital-twin" basemap={basemap} activeLayers={activeLayers} />
        </div>

        {/* Side Panel: Layer Controllers & GIS Entities */}
        <div className="space-y-4 font-mono text-xs">
          {/* Basemap Tile Switcher */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4" />
              <span>BASEMAP TILE</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'dark', label: 'DARK' },
                { id: 'osm', label: 'OSM' },
                { id: 'streets', label: 'STREETS' },
                { id: 'satellite', label: 'SATELLITE' }
              ].map(tile => (
                <button
                  key={tile.id}
                  onClick={() => setBasemap(tile.id)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    basemap === tile.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tile.label}
                </button>
              ))}
            </div>
          </div>

          
          {/* Layer Switches */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4" />
              <span>GEOMETRIC LAYERS</span>
            </div>
            <div className="space-y-2.5">
              {[
                { id: 'buildings', label: '3D Building Extrusions' },
                { id: 'landmarks', label: 'Civic Landmarks & Squares' },
                { id: 'drainage', label: 'Stormwater Drainage Lines' }
              ].map(item => (
                <label 
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={activeLayers[item.id]}
                    onChange={() => toggleLayer(item.id)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Corridor Landmarks Info List */}
          <div className="glass-panel p-4 max-h-[300px] overflow-y-auto">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <MapPin className="w-4 h-4" />
              <span>KEY SPATIAL ANCHORS</span>
            </div>
            <div className="space-y-2">
              {landmarks.map((lm, i) => (
                <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <div className="font-semibold text-slate-200">{lm.name}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">{lm.type}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{lm.coords}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
