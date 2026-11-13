import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Multiple Basemap Tile Options for Digital Twin & Traffic Intelligence
export const MAP_BASEMAPS = {
  dark: {
    name: 'Dark Canvas',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}']
  },
  osm: {
    name: 'OpenStreetMap',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png']
  },
  streets: {
    name: 'World Street',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}']
  },
  satellite: {
    name: 'Satellite View',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}']
  }
};

const MAP_SOURCES = {
  version: 8,
  sources: {
    'dark-basemap': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; Esri'
    }
  },
  layers: [
    {
      id: 'dark-basemap-layer',
      type: 'raster',
      source: 'dark-basemap',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

const BHUBANESWAR_CENTER = [85.8335, 20.2995];

// Primary corridor roads with default status
export const CORRIDOR_ROADS = [
  {
    id: 'road_jv_av',
    name: 'Jaydev Vihar to Acharya Vihar (NH-16)',
    congestion: 'moderate',
    avg_speed: '38 km/h',
    coordinates: [
      [85.8249, 20.2974],
      [85.8268, 20.2984],
      [85.8285, 20.2993],
      [85.8305, 20.3003],
      [85.8322, 20.3013],
      [85.8340, 20.3023]
    ]
  },
  {
    id: 'road_av_vv',
    name: 'Acharya Vihar to Vani Vihar (NH-16)',
    congestion: 'low',
    avg_speed: '52 km/h',
    coordinates: [
      [85.8340, 20.3023],
      [85.8365, 20.3022],
      [85.8390, 20.3020],
      [85.8420, 20.3018],
      [85.8452, 20.3015]
    ]
  },
  {
    id: 'road_jv_nandankanan',
    name: 'Jaydev Vihar - Nandankanan Expressway',
    congestion: 'high',
    avg_speed: '24 km/h',
    coordinates: [
      [85.8249, 20.2974],
      [85.8242, 20.3000],
      [85.8235, 20.3025],
      [85.8222, 20.3055],
      [85.8210, 20.3080],
      [85.8190, 20.3150]
    ]
  },
  {
    id: 'road_av_sainik',
    name: 'Acharya Vihar - Sainik School Road',
    congestion: 'low',
    avg_speed: '47 km/h',
    coordinates: [
      [85.8340, 20.3023],
      [85.8338, 20.3050],
      [85.8335, 20.3075],
      [85.8332, 20.3105],
      [85.8330, 20.3130]
    ]
  },
  {
    id: 'road_vv_rasulgarh',
    name: 'Vani Vihar to Rasulgarh (NH-16)',
    congestion: 'moderate',
    avg_speed: '36 km/h',
    coordinates: [
      [85.8452, 20.3015],
      [85.8490, 20.3008],
      [85.8530, 20.2995],
      [85.8580, 20.2975],
      [85.8640, 20.2945]
    ]
  }
];

export default function CityMap({ 
  mode = 'digital-twin',
  basemap = 'dark',
  activeLayers = null,
  roadsState = null,
  wasteReports = [],
  collectionRouteWaypoints = [],
  onMarkerClick = null,
  onMapClick = null,
  roadClosureActive = false
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState(null);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_SOURCES,
        center: BHUBANESWAR_CENTER,
        zoom: 14.3,
        pitch: mode === 'digital-twin' ? 45 : 20,
        bearing: -10,
        antialias: true
      });

      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

      // Click handler for coordinates
      map.on('click', (e) => {
        if (onMapClick) {
          onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        }
      });

      map.on('load', () => {
        setMapLoaded(true);

        // 1. Add Corridor Roads Layer with Color-Coded Congestion Logic (Disabled in Digital Twin mode)
        if (mode !== 'digital-twin') {
          const features = CORRIDOR_ROADS.map(r => ({
            type: 'Feature',
            properties: { 
              id: r.id, 
              name: r.name, 
              congestion: r.congestion,
              avg_speed: r.avg_speed
            },
            geometry: { type: 'LineString', coordinates: r.coordinates }
          }));

          map.addSource('corridor-roads', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features }
          });

          // Glowing outer halo based on congestion
          map.addLayer({
            id: 'roads-halo',
            type: 'line',
            source: 'corridor-roads',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': [
                'match',
                ['get', 'congestion'],
                'severe', '#dc2626',   // Deep Red / Roadblock
                'high', '#ea580c',     // Orange / Heavy Jam
                'moderate', '#eab308', // Yellow / Slowing Down
                'low', '#10b981',      // Green / Free Flow
                '#38bdf8'
              ],
              'line-width': 12,
              'line-opacity': 0.45,
              'line-blur': 4
            }
          });

          // Sharp core polyline color-coded
          map.addLayer({
            id: 'roads-core',
            type: 'line',
            source: 'corridor-roads',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': [
                'match',
                ['get', 'congestion'],
                'severe', '#ef4444',   // RED: Severe / Road Closed
                'high', '#f97316',     // ORANGE: High Density
                'moderate', '#facc15', // YELLOW: Moderate Flow
                'low', '#22c55e',      // GREEN: Clear Flow
                '#38bdf8'
              ],
              'line-width': 6.5
            }
          });

          // Center dashed white traffic lane divider
          map.addLayer({
            id: 'roads-divider',
            type: 'line',
            source: 'corridor-roads',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#ffffff',
              'line-width': 1.5,
              'line-dasharray': [2, 3],
              'line-opacity': 0.7
            }
          });

          // Road Click Inspector
          map.on('click', 'roads-core', (e) => {
            if (e.features && e.features[0]) {
              const props = e.features[0].properties;
              setSelectedRoad(props);
            }
          });

          // Cursor pointer over roads
          map.on('mouseenter', 'roads-core', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'roads-core', () => {
            map.getCanvas().style.cursor = '';
          });
        }

        // 2. Add 3D Building Extrusions for Digital Twin
        const buildings = [
          {
            type: 'Feature',
            properties: { name: 'Utkal University Parija Library Tower', height: 48 },
            geometry: {
              type: 'Polygon',
              coordinates: [[[85.8420, 20.3035], [85.8435, 20.3035], [85.8435, 20.3050], [85.8420, 20.3050], [85.8420, 20.3035]]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Pathani Samanta Planetarium Dome', height: 32 },
            geometry: {
              type: 'Polygon',
              coordinates: [[[85.8298, 20.3005], [85.8312, 20.3005], [85.8312, 20.3018], [85.8298, 20.3018], [85.8298, 20.3005]]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Apollo Hospitals Complex', height: 42 },
            geometry: {
              type: 'Polygon',
              coordinates: [[[85.8195, 20.3065], [85.8215, 20.3065], [85.8215, 20.3085], [85.8195, 20.3085], [85.8195, 20.3065]]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Jaydev Vihar Commercial Hub', height: 55 },
            geometry: {
              type: 'Polygon',
              coordinates: [[[85.8235, 20.2965], [85.8255, 20.2965], [85.8255, 20.2980], [85.8235, 20.2980], [85.8235, 20.2965]]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Acharya Vihar Administrative Centre', height: 38 },
            geometry: {
              type: 'Polygon',
              coordinates: [[[85.8330, 20.3015], [85.8350, 20.3015], [85.8350, 20.3030], [85.8330, 20.3030], [85.8330, 20.3015]]]
            }
          }
        ];

        map.addSource('corridor-buildings', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: buildings }
        });

        map.addLayer({
          id: '3d-buildings',
          type: 'fill-extrusion',
          source: 'corridor-buildings',
          paint: {
            'fill-extrusion-color': '#0f172a',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.88
          }
        });

        // 3. Add Dijkstra Collection Route Source (Waste mode)
        map.addSource('collection-route-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'collection-route-line',
          type: 'line',
          source: 'collection-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#00f0ff',
            'line-width': 3.5,
            'line-dasharray': [3, 2]
          }
        });

        // 4. Add Key Spatial Anchor Landmarks
        const landmarks = [
          { name: "Jaydev Vihar Square", coords: [85.8249, 20.2974], type: "Major Flyover Junction" },
          { name: "Acharya Vihar Square", coords: [85.8340, 20.3023], type: "NH-16 Overbridge" },
          { name: "Vani Vihar Square", coords: [85.8452, 20.3015], type: "Utkal University Gate" },
          { name: "Pathani Samanta Planetarium", coords: [85.8306, 20.3010], type: "Heritage Landmark" }
        ];

        landmarks.forEach(lm => {
          const el = document.createElement('div');
          el.className = 'w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#00f0ff] cursor-pointer';
          new maplibregl.Marker({ element: el })
            .setLngLat(lm.coords)
            .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`
              <div style="font-family: monospace; font-size: 11px; padding: 2px;">
                <strong style="color: #38bdf8;">${lm.name}</strong><br/>
                <span style="color: #94a3b8; font-size: 10px;">${lm.type}</span>
              </div>
            `))
            .addTo(map);
        });

        // Resize triggers to ensure full viewport fill
        map.resize();
        setTimeout(() => map.resize(), 300);
        setTimeout(() => map.resize(), 800);
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.warn("MapLibre initialization warning:", err);
    }
  }, [mode]);


  // Dynamic Basemap Switcher (Dark, OSM, Streets, Satellite)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const selectedTiles = MAP_BASEMAPS[basemap]?.tiles || MAP_BASEMAPS.dark.tiles;
    
    // Safely update or replace the raster basemap source
    try {
      const source = map.getSource('dark-basemap');
      if (source && source.setTiles) {
        source.setTiles(selectedTiles);
      }
    } catch (e) {
      console.warn('Basemap tile switch warning:', e);
    }
  }, [basemap, mapLoaded]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) mapRef.current.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update layer visibility if activeLayers provided (Digital Twin mode)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !activeLayers) return;
    const map = mapRef.current;
    try {
      if (map.getLayer('3d-buildings')) {
        map.setLayoutProperty(
          '3d-buildings',
          'visibility',
          activeLayers.buildings !== false ? 'visible' : 'none'
        );
      }
    } catch (e) {
      console.warn('Layer visibility switch warning:', e);
    }
  }, [activeLayers, mapLoaded]);

  // Update Road Color-Coding dynamically (Green / Yellow / Orange / Red)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || mode === 'digital-twin') return;
    const map = mapRef.current;
    const source = map.getSource('corridor-roads');
    if (!source) return;

    const updatedFeatures = CORRIDOR_ROADS.map(r => {
      let cong = r.congestion;
      let spd = r.avg_speed;

      // If backend provided live road state
      if (roadsState && roadsState[r.id]) {
        cong = roadsState[r.id].status;
        spd = `${roadsState[r.id].avg_speed_kmh} km/h`;
      } else {
        // Fallback closure logic
        if (r.id === 'road_jv_av') {
          cong = roadClosureActive ? 'severe' : 'moderate';
          spd = roadClosureActive ? '0 km/h (CLOSED)' : '38 km/h';
        } else if (r.id === 'road_jv_nandankanan' && roadClosureActive) {
          cong = 'high'; // Orange
          spd = '18 km/h';
        }
      }

      return {
        type: 'Feature',
        properties: { 
          id: r.id, 
          name: r.name, 
          congestion: cong,
          avg_speed: spd
        },
        geometry: { type: 'LineString', coordinates: r.coordinates }
      };
    });

    source.setData({ type: 'FeatureCollection', features: updatedFeatures });
  }, [roadClosureActive, roadsState, mapLoaded]);

  // Update Collection Route Waypoints (Waste mode)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('collection-route-source');
    if (source) {
      if (collectionRouteWaypoints && collectionRouteWaypoints.length >= 2) {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: collectionRouteWaypoints }
          }]
        });
      } else {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    }
  }, [collectionRouteWaypoints, mapLoaded]);

  // Update Waste Incident Markers (RED vs GREEN)
  useEffect(() => {
    if (!mapRef.current || mode !== 'waste' || !mapLoaded) return;
    const map = mapRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    wasteReports.forEach(report => {
      const isCleaned = report.status === 'CLEANED';
      const el = document.createElement('div');
      el.className = `flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-125 shadow-2xl ${
        isCleaned 
          ? 'bg-emerald-500/90 border-2 border-emerald-300 shadow-[0_0_20px_#10b981]' 
          : 'bg-rose-600/90 border-2 border-rose-300 shadow-[0_0_20px_#f43f5e] animate-pulse'
      }`;
      el.innerHTML = isCleaned
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

      if (onMarkerClick) {
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          onMarkerClick(report);
        });
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([report.longitude, report.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [wasteReports, mode, mapLoaded, onMarkerClick]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Road Congestion Legend - Hidden in Digital Twin mode */}
      {mode !== 'digital-twin' && (
        <div className="absolute top-4 right-4 z-10 glass-panel p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono shadow-2xl">
          <div className="font-bold text-white mb-1.5 flex items-center justify-between gap-4">
            <span>CORRIDOR FLOW</span>
            <span className="text-[9px] text-cyan-400">NO VEHICLE DOTS</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Green: Free Flow (50+ km/h)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-yellow-400" />
              <span className="text-slate-300">Yellow: Moderate (35-45 km/h)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-orange-500" />
              <span className="text-slate-300">Orange: Heavy Slowdown</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Red: Jam / Road Closed</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Road Card Popup - Hidden in Digital Twin mode */}
      {mode !== 'digital-twin' && selectedRoad && (
        <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 rounded-xl border border-cyan-500/50 text-xs font-mono max-w-xs shadow-2xl">
          <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
            <span>{selectedRoad.name}</span>
            <button 
              onClick={() => setSelectedRoad(null)}
              className="text-slate-400 hover:text-white px-1"
            >✕</button>
          </div>
          <div className="text-slate-300 space-y-0.5 text-[11px]">
            <div>Status: <span className="font-bold uppercase text-white">{selectedRoad.congestion}</span></div>
            <div>Average Flow Speed: <span className="text-cyan-300 font-bold">{selectedRoad.avg_speed}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
