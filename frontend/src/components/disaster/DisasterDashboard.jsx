import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import DisasterMap from './DisasterMap';
import { 
  DEFAULT_EMERGENCY_LOCATIONS, 
  DEFAULT_DISASTER_ZONES, 
  DEFAULT_EVACUATION_ROUTES,
  findNearestEmergencyFacilities 
} from './disasterData';
import { 
  ShieldAlert, 
  Search, 
  Layers, 
  Compass, 
  Crosshair, 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  Activity, 
  Wind, 
  CloudRain, 
  Droplets,
  HelpCircle,
  X
} from 'lucide-react';

export default function DisasterDashboard({ onBackToDashboard }) {
  const [tomtomApiKey, setTomtomApiKey] = useState(
    () => import.meta.env.VITE_TOMTOM_API_KEY || localStorage.getItem('tomtom_api_key') || ''
  );
  const [keyInputModal, setKeyInputModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [emergencyLocations, setEmergencyLocations] = useState(DEFAULT_EMERGENCY_LOCATIONS);
  const [disasterZones, setDisasterZones] = useState(DEFAULT_DISASTER_ZONES);
  const [evacuationRoutes, setEvacuationRoutes] = useState(DEFAULT_EVACUATION_ROUTES);
  const [incidents, setIncidents] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    emergency: true,
    zones: true,
    evacuation: true,
    weatherHud: true,
  });

  const [selectedFacilityType, setSelectedFacilityType] = useState('all');
  const [basemap, setBasemap] = useState('osm');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [nearestFacilities, setNearestFacilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 20.2961, lng: 85.8245, zoom: 13 });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Quick preset locations in Bhubaneswar
  const presetLocations = [
    { name: 'Jaydev Vihar Corridor', lat: 20.3015, lng: 85.8235 },
    { name: 'Acharya Vihar Junction', lat: 20.2952, lng: 85.8264 },
    { name: 'Vani Vihar (Utkal Univ)', lat: 20.3068, lng: 85.8398 },
    { name: 'AIIMS Bhubaneswar', lat: 20.2312, lng: 85.7758 },
    { name: 'Capital Hospital Unit 6', lat: 20.2618, lng: 85.8286 },
    { name: 'Rasulgarh Flyover', lat: 20.2974, lng: 85.8645 },
    { name: 'Baramunda Evac Hub', lat: 20.2760, lng: 85.7950 },
  ];

  // Fetch TomTom Live Incidents directly using user key
  const fetchTomTomIncidents = useCallback(async () => {
    if (!tomtomApiKey) return;
    try {
      const bbox = '85.75,20.20,85.92,20.38';
      const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code},startTime,endTime,from,to,length,roadNumbers}}}&language=en-GB&key=${tomtomApiKey}`;
      const res = await axios.get(url, { timeout: 6000 });
      const rawIncidents = res.data?.incidents || [];

      const parsed = rawIncidents.map((inc) => {
        const props = inc.properties || {};
        const geom = inc.geometry || {};
        const coords = geom.coordinates;
        let pt = null;
        if (geom.type === 'Point' && Array.isArray(coords)) {
          pt = [coords[1], coords[0]];
        } else if (geom.type === 'LineString' && Array.isArray(coords) && coords.length > 0) {
          const mid = coords[Math.floor(coords.length / 2)];
          pt = [mid[1], mid[0]];
        }
        return {
          id: props.id || Math.random().toString(),
          category: props.iconCategory === 8 ? 'Road Closed' : props.iconCategory === 1 ? 'Accident' : 'Traffic Incident',
          description: props.events?.[0]?.description || 'Active traffic alert',
          magnitude: props.magnitudeOfDelay === 1 ? 'Minor' : props.magnitudeOfDelay === 2 ? 'Moderate' : 'Major',
          from_location: props.from || 'Bhubaneswar Corridor',
          to_location: props.to || '',
          length_meters: props.length || 0,
          point: pt,
        };
      });

      setIncidents(parsed);
    } catch (err) {
      console.warn('TomTom incidents fetch note:', err.message);
    }
  }, []);

  // Fetch real-time weather from Open-Meteo
  const fetchWeatherData = useCallback(async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=20.2961&longitude=85.8245&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
      const res = await axios.get(url, { timeout: 5000 });
      const curr = res.data?.current || {};
      const temp = curr.temperature_2m ?? 27.5;
      const rain = curr.precipitation ?? 0.0;
      const wind = curr.wind_speed_10m ?? 8.5;

      let floodLevel = 'Normal (Low)';
      let floodBadge = 'No Active Flood Threat';
      let floodColor = '#10b981';

      if (rain > 20) {
        floodLevel = 'Severe Inundation Threat';
        floodBadge = 'Red Warning - Severe Waterlogging';
        floodColor = '#ef4444';
      } else if (rain > 10) {
        floodLevel = 'Moderate Inundation Watch';
        floodBadge = 'Orange Alert - Water Accumulation';
        floodColor = '#f59e0b';
      }

      setWeatherData({
        temp,
        rain,
        wind,
        humidity: curr.relative_humidity_2m ?? 65,
        flood_level: floodLevel,
        flood_badge: floodBadge,
        flood_color: floodColor,
        source: 'Open-Meteo & IMD Bhubaneswar',
        time: curr.time?.split('T')?.[1] || 'Live',
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Weather fetch note:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchTomTomIncidents();
    fetchWeatherData();

    const interval = setInterval(() => {
      fetchTomTomIncidents();
      fetchWeatherData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchTomTomIncidents, fetchWeatherData]);

  // Search input handler
  const searchTimeoutRef = useRef(null);
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      // Local match against emergency facilities and preset hubs
      const q = val.toLowerCase();
      const localMatches = [
        ...emergencyLocations.map(l => ({ display_name: l.name, lat: l.lat, lng: l.lng, type: l.type })),
        ...presetLocations.map(p => ({ display_name: p.name, lat: p.lat, lng: p.lng, type: 'landmark' }))
      ].filter(item => item.display_name.toLowerCase().includes(q));

      setSearchResults(localMatches.slice(0, 5));
    }, 250);
  };

  const handleSelectSearchResult = (item) => {
    setSearchedLocation(item);
    setSearchQuery(item.display_name);
    setSearchResults([]);
    setSelectedEntity({ type: 'location', data: item });
    const nearest = findNearestEmergencyFacilities(item.lat, item.lng, emergencyLocations);
    setNearestFacilities(nearest);
  };

  // GPS User Location
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const loc = { lat: latitude, lng: longitude, accuracy };
        setUserLocation(loc);
        setLocatingUser(false);
        const nearest = findNearestEmergencyFacilities(latitude, longitude, emergencyLocations);
        setNearestFacilities(nearest);
      },
      (err) => {
        setLocatingUser(false);
        alert('Location permission denied or unavailable: ' + err.message);
      },
      { timeout: 8000 }
    );
  };

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#07090e] text-slate-100 font-sans border-t border-slate-800">
      
      {/* Top Operations Nav */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 gap-3 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
              <span>DISASTER MANAGEMENT &amp; LIVE TRAFFIC GIS</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
                Bhubaneswar Urban Ops
              </span>
            </h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-cyan-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search emergency hospital, shelter, junction..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-slate-500"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 shadow-2xl z-50 text-xs">
              {searchResults.map((res, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  className="px-2.5 py-1.5 hover:bg-cyan-950/60 rounded cursor-pointer text-slate-200 hover:text-white font-mono"
                >
                  {res.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRequestLocation}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-cyan-500 hover:text-white transition font-mono"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locatingUser ? 'Locating…' : 'My Location'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const entered = prompt('Enter TomTom API Key to activate live traffic flow:', tomtomApiKey || '');
              if (entered !== null) {
                const clean = entered.trim();
                setTomtomApiKey(clean);
                if (clean) localStorage.setItem('tomtom_api_key', clean);
                else localStorage.removeItem('tomtom_api_key');
              }
            }}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              tomtomApiKey
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Configure TomTom Traffic API Key"
          >
            <span>{tomtomApiKey ? 'TomTom Live' : 'Set Key'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLegendOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/80 text-xs text-amber-300 hover:bg-amber-900/40 font-mono"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Legend</span>
          </button>
        </div>
      </div>

      {/* 3-Column GIS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] flex-1 overflow-hidden relative">
        
        {/* Left Sidebar: Layer Controls & Filters */}
        <aside className="bg-slate-950/90 border-r border-slate-800/80 p-3.5 space-y-4 overflow-y-auto text-xs font-mono">
          <div>
            <div className="flex items-center space-x-1.5 text-slate-400 font-bold tracking-wider uppercase mb-2.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Layers</span>
            </div>

            <div className="space-y-2">
              {/* TomTom Live Traffic */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Live Traffic Flow</span>
                  <input
                    type="checkbox"
                    checked={activeLayers.traffic}
                    onChange={() => toggleLayer('traffic')}
                    className="accent-cyan-500"
                  />
                </label>
                <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <Activity className="w-3 h-3 shrink-0" />
                  <span>TomTom Live Stream ({incidents.length} incidents)</span>
                </div>
              </div>

              {/* Emergency Facilities */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Emergency Facilities</span>
                  <input
                    type="checkbox"
                    checked={activeLayers.emergency}
                    onChange={() => toggleLayer('emergency')}
                    className="accent-cyan-500"
                  />
                </label>
                {activeLayers.emergency && (
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-300 outline-none"
                  >
                    <option value="all">All Facilities ({emergencyLocations.length})</option>
                    <option value="hospital">Hospitals</option>
                    <option value="fire_station">Fire &amp; Rescue</option>
                    <option value="police_station">Police Stations</option>
                    <option value="ambulance_service">Ambulance / ODRAF</option>
                    <option value="emergency_shelter">Cyclone Shelters</option>
                  </select>
                )}
              </div>

              {/* Disaster Hazard Zones */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Disaster Risk Zones</span>
                  <input
                    type="checkbox"
                    checked={activeLayers.zones}
                    onChange={() => toggleLayer('zones')}
                    className="accent-cyan-500"
                  />
                </label>
                <div className="text-[10px] text-slate-400">
                  {disasterZones.length} GeoJSON Risk Perimeters
                </div>
              </div>

              {/* Evacuation Corridors */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Evacuation Routes</span>
                  <input
                    type="checkbox"
                    checked={activeLayers.evacuation}
                    onChange={() => toggleLayer('evacuation')}
                    className="accent-cyan-500"
                  />
                </label>
                <div className="text-[10px] text-cyan-400">
                  {evacuationRoutes.length} Designated Highways
                </div>
              </div>
            </div>
          </div>

          {/* Basemap Styles */}
          <div>
            <div className="text-slate-400 font-bold tracking-wider uppercase mb-2 text-[11px]">
              Basemap Tile
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {['osm', 'dark', 'humanitarian', 'streets'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setBasemap(style)}
                  className={`p-1.5 rounded text-[11px] uppercase border transition ${
                    basemap === style
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Demonstration Hubs */}
          <div>
            <div className="text-slate-400 font-bold tracking-wider uppercase mb-2 text-[11px]">
              Quick Hubs
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presetLocations.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    setSearchedLocation(loc);
                    const nearest = findNearestEmergencyFacilities(loc.lat, loc.lng, emergencyLocations);
                    setNearestFacilities(nearest);
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-cyan-500 hover:text-white"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Interactive Leaflet Map */}
        <section className="relative w-full h-full min-h-[480px] bg-[#020b14]">
          <DisasterMap
            emergencyLocations={emergencyLocations}
            disasterZones={disasterZones}
            evacuationRoutes={evacuationRoutes}
            incidents={incidents}
            activeLayers={activeLayers}
            selectedFacilityType={selectedFacilityType}
            basemap={basemap}
            userLocation={userLocation}
            searchedLocation={searchedLocation}
            tomtomApiKey={tomtomApiKey}
            onSelectFacility={(fac) => {
              setSelectedEntity({ type: 'facility', data: fac });
              const nearest = findNearestEmergencyFacilities(fac.lat, fac.lng, emergencyLocations);
              setNearestFacilities(nearest);
            }}
            onSelectZone={(zone) => setSelectedEntity({ type: 'zone', data: zone })}
            onSelectRoute={(route) => setSelectedEntity({ type: 'route', data: route })}
            onSelectIncident={(inc) => setSelectedEntity({ type: 'incident', data: inc })}
            onMapCoordinatesChange={setMapCoordinates}
          />

          {/* Weather Floating HUD */}
          {activeLayers.weatherHud && weatherData && (
            <div className="absolute top-3 right-3 z-30 p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-2xl font-mono text-xs space-y-2 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded font-bold text-[10px] text-white" style={{ background: weatherData.flood_color }}>
                  {weatherData.flood_badge}
                </span>
                <span className="text-[10px] text-slate-400">{weatherData.time}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
                <div>
                  <div className="text-slate-500 text-[9px]">TEMP</div>
                  <div className="font-bold text-white">{weatherData.temp}°C</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px]">RAIN</div>
                  <div className="font-bold text-blue-400">{weatherData.rain} mm/h</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px]">WIND</div>
                  <div className="font-bold text-cyan-300">{weatherData.wind} km/h</div>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
                Source: {weatherData.source}
              </div>
            </div>
          )}

          {/* Traffic Legend Pill */}
          <div className="absolute bottom-3 left-3 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Free Flow</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" /> <span>Moderate</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 ml-2" /> <span>Heavy</span>
            <span className="w-2 h-2 rounded-full bg-rose-900 ml-2" /> <span>Severe</span>
          </div>
        </section>

        {/* Right Sidebar: Inspector & Rapid Facility Solver */}
        <aside className="bg-slate-950/90 border-l border-slate-800/80 p-3.5 space-y-4 overflow-y-auto font-mono text-xs">
          
          {selectedEntity ? (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  {selectedEntity.type} INSPECTION
                </span>
                <button type="button" onClick={() => setSelectedEntity(null)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedEntity.type === 'facility' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">{selectedEntity.data.name}</h3>
                  <div className="text-[10px] text-cyan-300 font-bold uppercase">{selectedEntity.data.category}</div>
                  <div className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-800 text-[11px]">
                    <div><strong>Emergency Helpline:</strong> <a href={`tel:${selectedEntity.data.emergency_helpline}`} className="text-cyan-400 font-bold">{selectedEntity.data.emergency_helpline}</a></div>
                    {selectedEntity.data.capacity_beds && <div><strong>Bed Capacity:</strong> {selectedEntity.data.capacity_beds} beds</div>}
                    {selectedEntity.data.capacity_persons && <div><strong>Shelter Capacity:</strong> {selectedEntity.data.capacity_persons} evacuees</div>}
                    <div className="text-slate-400 text-[10px]">{selectedEntity.data.address}</div>
                    <div className="text-emerald-400 text-[10px] pt-1">&#10003; {selectedEntity.data.verified_by}</div>
                  </div>
                </div>
              )}

              {selectedEntity.type === 'zone' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">{selectedEntity.data.name}</h3>
                  <div className="text-[10px] text-rose-400 font-bold uppercase">{selectedEntity.data.risk_level}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{selectedEntity.data.description}</p>
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300 text-[10px]">
                    <strong>Advisory:</strong> {selectedEntity.data.advisory}
                  </div>
                </div>
              )}

              {selectedEntity.type === 'route' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">{selectedEntity.data.code}: {selectedEntity.data.name}</h3>
                  <div className="text-[10px] text-emerald-400 font-bold">{selectedEntity.data.priority}</div>
                  <div className="text-[11px] space-y-1 text-slate-300">
                    <div>Length: {selectedEntity.data.length_km} km (~{selectedEntity.data.est_travel_time_min} min)</div>
                    <div>From: {selectedEntity.data.start_point}</div>
                    <div>To: {selectedEntity.data.end_point}</div>
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-900/50 text-amber-300 text-[10px]">
                    {selectedEntity.data.disclaimer}
                  </div>
                </div>
              )}

              {selectedEntity.type === 'incident' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-rose-400 text-sm">{selectedEntity.data.category}</h3>
                  <div className="text-[10px] text-amber-300 font-bold">{selectedEntity.data.magnitude} Delay</div>
                  <p className="text-slate-300 text-[11px]">{selectedEntity.data.description}</p>
                  <div className="text-[10px] text-slate-400">Location: {selectedEntity.data.from_location}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2 text-slate-400">
              <Compass className="w-6 h-6 mx-auto text-slate-600" />
              <div className="font-bold text-white text-xs">GIS Inspector</div>
              <p className="text-[11px]">Click any hospital, shelter, hazard zone, or evacuation corridor on the map to inspect.</p>
            </div>
          )}

          {/* Rapid Facilities Transit Solver */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Nearest Emergency Facilities
            </div>

            {nearestFacilities.length > 0 ? (
              <div className="space-y-1.5">
                {nearestFacilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setSelectedEntity({ type: 'facility', data: fac });
                      setSearchedLocation(fac);
                    }}
                    className="p-2 rounded bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500 cursor-pointer flex items-center justify-between text-[11px] transition"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-white truncate">{fac.name}</div>
                      <div className="text-[9px] text-slate-500">{fac.category}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-cyan-400 font-bold">{fac.distance_km} km</div>
                      <div className="text-[9px] text-slate-400">~{fac.est_transit_minutes} min</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-500">
                Use &ldquo;My Location&rdquo; or click any landmark to solve for nearest tertiary care and flood shelters.
              </p>
            )}
          </div>

          {/* Emergency Helplines */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <PhoneCall className="w-3 h-3" />
              <span>Odisha Emergency Helplines</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-center">
              <a href="tel:112" className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500">
                <div className="text-rose-400 font-black text-sm">112</div>
                <div className="text-[9px] text-slate-400">National Emergency</div>
              </a>
              <a href="tel:108" className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500">
                <div className="text-rose-400 font-black text-sm">108</div>
                <div className="text-[9px] text-slate-400">Ambulance Fleet</div>
              </a>
              <a href="tel:101" className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500">
                <div className="text-rose-400 font-black text-sm">101</div>
                <div className="text-[9px] text-slate-400">Fire &amp; Rescue</div>
              </a>
              <a href="tel:1077" className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500">
                <div className="text-rose-400 font-black text-sm">1077</div>
                <div className="text-[9px] text-slate-400">OSDMA Disaster Cell</div>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] font-mono text-slate-500 gap-3">
        <div className="flex items-center space-x-3">
          <span>COORDS: {mapCoordinates.lat}°N, {mapCoordinates.lng}°E</span>
          <span>ZOOM: {mapCoordinates.zoom}x</span>
          <span>SYNC: {lastUpdated}</span>
        </div>
        <div>
          <span>&copy; OpenStreetMap contributors &middot; TomTom Traffic &middot; OSDMA &middot; Open-Meteo &middot; IMD</span>
        </div>
      </footer>

      {/* Legend Modal */}
      {legendOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-5 font-mono text-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">GIS Map Legend</h3>
              <button type="button" onClick={() => setLegendOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <strong className="text-cyan-400 block mb-1">Traffic Conditions (TomTom Flow)</strong>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded bg-emerald-500 shrink-0" /><span>Green: Free Flow</span></div>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded bg-amber-500 shrink-0" /><span>Orange: Moderate Delay</span></div>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded bg-rose-500 shrink-0" /><span>Red: Heavy Congestion</span></div>
                  <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded bg-rose-900 shrink-0" /><span>Dark Red: Severe Blockage</span></div>
                </div>
              </div>

              <div>
                <strong className="text-cyan-400 block mb-1">Facility Symbols</strong>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center space-x-2"><span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">H</span><span>Hospital / Trauma</span></div>
                  <div className="flex items-center space-x-2"><span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">F</span><span>Fire Station</span></div>
                  <div className="flex items-center space-x-2"><span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">P</span><span>Police Station</span></div>
                  <div className="flex items-center space-x-2"><span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">S</span><span>Cyclone Shelter</span></div>
                </div>
              </div>

              <div>
                <strong className="text-cyan-400 block mb-1">Disaster Zones &amp; Routes</strong>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Blue polygons mark flood drainage basins (Gangua Nullah); purple polygons mark cyclone wind exposure zones; glowing blue dashed lines mark designated arterial evacuation highways (NH-16, Janpath).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLegendOpen(false)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition"
            >
              Close Legend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
