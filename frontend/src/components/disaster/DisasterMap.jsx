import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG Icon generator for different emergency facility types
function createFacilityIcon(type, verified = true) {
  let iconHtml = '';
  let bgColor = '#3b82f6';

  switch (type) {
    case 'hospital':
      bgColor = '#ef4444';
      iconHtml = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M19 10.5h-5.5V5c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v5.5H5c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h5.5V19c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-5.5H19c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1z"/>
        </svg>
      `;
      break;
    case 'fire_station':
      bgColor = '#f97316';
      iconHtml = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M13.5 1.5s0 4.5-2.5 6.5C10 7 9.5 5.5 9.5 5.5S6 8.5 6 13c0 3.31 2.69 6 6 6s6-2.69 6-6c0-4-4.5-7.5-4.5-11.5zM12 17c-1.66 0-3-1.34-3-3 0-1.5 1.5-2.5 1.5-2.5s.5 1.5 1.5 1.5c1 0 1.5-1.5 1.5-1.5s1.5 1 1.5 2.5c0 1.66-1.34 3-3 3z"/>
        </svg>
      `;
      break;
    case 'police_station':
      bgColor = '#2563eb';
      iconHtml = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      `;
      break;
    case 'ambulance_service':
      bgColor = '#06b6d4';
      iconHtml = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      `;
      break;
    case 'emergency_shelter':
    case 'relief_camp':
      bgColor = '#10b981';
      iconHtml = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.5l5 4.5H7l5-4.5z"/>
        </svg>
      `;
      break;
    default:
      bgColor = '#8b5cf6';
      iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><circle cx="12" cy="12" r="8"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-gis-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px ${bgColor}99, 0 2px 6px rgba(0,0,0,0.6);
        border: 2px solid #ffffff;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${iconHtml}
        ${verified ? `<span style="position:absolute; bottom:-2px; right:-2px; background:#10b981; width:10px; height:10px; border-radius:50%; border:1.5px solid #fff;" title="Verified"></span>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function createIncidentIcon(category, magnitude) {
  let color = '#ef4444';
  if (magnitude === 'Minor') color = '#f59e0b';
  if (magnitude === 'Moderate') color = '#f97316';
  if (magnitude === 'Major') color = '#dc2626';

  return L.divIcon({
    className: 'incident-marker-icon',
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px ${color}aa, 0 3px 8px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
        cursor: pointer;
        transform: rotate(45deg);
      ">
        <span style="transform: rotate(-45deg); font-size: 13px; font-weight: bold; color: white;">!</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  },
  dark: {
    name: 'Esri Dark Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; OpenStreetMap contributors &copy; Esri',
    maxZoom: 19,
  },
  humanitarian: {
    name: 'Humanitarian OSM (HOT)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">HOT</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  },
  streets: {
    name: 'Esri World Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; OpenStreetMap contributors &copy; Esri',
    maxZoom: 19,
  },
};

export default function DisasterMap({
  emergencyLocations = [],
  disasterZones = [],
  evacuationRoutes = [],
  incidents = [],
  activeLayers = {
    traffic: true,
    emergency: true,
    zones: true,
    evacuation: true,
  },
  selectedFacilityType = 'all',
  basemap = 'dark',
  center = [20.2961, 85.8245],
  zoom = 13,
  userLocation = null,
  searchedLocation = null,
  tomtomApiKey = '',
  onSelectFacility,
  onSelectZone,
  onSelectRoute,
  onSelectIncident,
  onMapCoordinatesChange,
}) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const baseTileLayerRef = useRef(null);
  const trafficTileLayerRef = useRef(null);
  const emergencyGroupRef = useRef(null);
  const zonesGroupRef = useRef(null);
  const evacuationGroupRef = useRef(null);
  const incidentsGroupRef = useRef(null);
  const userLocGroupRef = useRef(null);
  const searchedMarkerRef = useRef(null);

  // Initialize Map safely
  useEffect(() => {
    if (!containerRef.current) return undefined;
    
    // If container already has an active Leaflet instance, clean it up first
    if (containerRef.current._leaflet_id) {
      containerRef.current._leaflet_id = null;
    }
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    map.on('mousemove', (e) => {
      if (onMapCoordinatesChange) {
        onMapCoordinatesChange({
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4)),
          zoom: map.getZoom(),
        });
      }
    });

    map.on('zoomend', () => {
      if (onMapCoordinatesChange) {
        const c = map.getCenter();
        onMapCoordinatesChange({
          lat: Number(c.lat.toFixed(4)),
          lng: Number(c.lng.toFixed(4)),
          zoom: map.getZoom(),
        });
      }
    });

    emergencyGroupRef.current = L.layerGroup().addTo(map);
    zonesGroupRef.current = L.layerGroup().addTo(map);
    evacuationGroupRef.current = L.layerGroup().addTo(map);
    incidentsGroupRef.current = L.layerGroup().addTo(map);
    userLocGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer safely
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (baseTileLayerRef.current) {
        map.removeLayer(baseTileLayerRef.current);
        baseTileLayerRef.current = null;
      }

      const config = TILE_PROVIDERS[basemap] || TILE_PROVIDERS.dark;
      const tileLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom || 19,
        subdomains: config.subdomains || ['a', 'b', 'c'],
        crossOrigin: true
      });

      tileLayer.addTo(map);
      baseTileLayerRef.current = tileLayer;

      if (trafficTileLayerRef.current && activeLayers.traffic) {
        trafficTileLayerRef.current.bringToFront();
      }
    } catch (err) {
      console.warn("Tile layer switch warning:", err);
    }
  }, [basemap]);

  // Update TomTom Live Traffic Flow Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (trafficTileLayerRef.current) {
      map.removeLayer(trafficTileLayerRef.current);
      trafficTileLayerRef.current = null;
    }

    if (activeLayers.traffic && tomtomApiKey) {
      // Connect to TomTom Relative Flow raster tiles
      const trafficUrl = `https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${tomtomApiKey}`;
      const trafficLayer = L.tileLayer(trafficUrl, {
        opacity: 0.85,
        maxZoom: 19,
        zIndex: 10,
      });

      trafficLayer.addTo(map);
      trafficTileLayerRef.current = trafficLayer;
    }
  }, [activeLayers.traffic, tomtomApiKey]);

  // Update Emergency Locations Markers
  useEffect(() => {
    const group = emergencyGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!activeLayers.emergency) return;

    const filtered = emergencyLocations.filter((loc) => {
      if (!selectedFacilityType || selectedFacilityType === 'all') return true;
      return loc.type === selectedFacilityType;
    });

    filtered.forEach((facility) => {
      const icon = createFacilityIcon(facility.type, facility.verified);
      const marker = L.marker([facility.lat, facility.lng], { icon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 200px; color: #1e293b;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #0f172a;">${facility.name}</div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">${facility.category || facility.type}</div>
          <div style="margin: 6px 0; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div><strong>Helpline:</strong> <a href="tel:${facility.emergency_helpline || facility.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${facility.emergency_helpline || facility.phone}</a></div>
            ${facility.capacity_beds ? `<div><strong>Bed Capacity:</strong> ${facility.capacity_beds}</div>` : ''}
            ${facility.capacity_persons ? `<div><strong>Shelter Capacity:</strong> ${facility.capacity_persons} evacuees</div>` : ''}
          </div>
          <div style="font-size: 11px; color: #10b981; font-weight: 600;">&#10003; ${facility.verified_by || 'Verified Facility'}</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectFacility) onSelectFacility(facility);
      });

      group.addLayer(marker);
    });
  }, [emergencyLocations, activeLayers.emergency, selectedFacilityType]);

  // Update Disaster Zones (GeoJSON Polygons)
  useEffect(() => {
    const group = zonesGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!activeLayers.zones) return;

    disasterZones.forEach((zone) => {
      if (!zone.geojson) return;

      let color = '#3b82f6';
      let fillColor = '#3b82f6';

      switch (zone.type) {
        case 'flood':
          color = '#0284c7';
          fillColor = '#38bdf8';
          break;
        case 'cyclone':
          color = '#9333ea';
          fillColor = '#c084fc';
          break;
        case 'fire':
          color = '#e11d48';
          fillColor = '#fb7185';
          break;
        case 'landslide':
          color = '#d97706';
          fillColor = '#fbbf24';
          break;
        case 'evacuation_zone':
          color = '#059669';
          fillColor = '#34d399';
          break;
        default:
          color = '#dc2626';
          fillColor = '#ef4444';
      }

      const polygonLayer = L.geoJSON(zone.geojson, {
        style: {
          color: color,
          weight: 2.5,
          opacity: 0.9,
          fillColor: fillColor,
          fillOpacity: 0.28,
          dashArray: zone.severity === 'critical' ? '6, 6' : undefined,
        },
      });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 220px; color: #1e293b;">
          <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${zone.name}</div>
          <div style="font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase; margin: 2px 0;">${zone.risk_level || zone.type}</div>
          <p style="margin: 6px 0; font-size: 12px; color: #334155; line-height: 1.4;">${zone.description}</p>
          <div style="background: #f1f5f9; padding: 6px; border-radius: 4px; font-size: 11px; margin-top: 6px;">
            <strong>Advisory:</strong> ${zone.advisory || 'Follow official municipal civil defense alerts.'}
          </div>
        </div>
      `;

      polygonLayer.bindPopup(popupContent);
      polygonLayer.on('click', () => {
        if (onSelectZone) onSelectZone(zone);
      });

      group.addLayer(polygonLayer);
    });
  }, [disasterZones, activeLayers.zones]);

  // Update Evacuation Routes Layer
  useEffect(() => {
    const group = evacuationGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!activeLayers.evacuation) return;

    evacuationRoutes.forEach((route) => {
      if (!Array.isArray(route.coordinates) || route.coordinates.length < 2) return;
      const latLngs = route.coordinates.map((pt) => [pt[1], pt[0]]);

      const casing = L.polyline(latLngs, {
        color: '#0284c7',
        weight: 9,
        opacity: 0.45,
      });

      const polyline = L.polyline(latLngs, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.95,
        dashArray: '10, 6',
      });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 220px; color: #1e293b;">
          <div style="font-weight: bold; font-size: 14px; color: #0284c7;">${route.code}: ${route.name}</div>
          <div style="font-size: 11px; font-weight: bold; color: #059669; margin: 2px 0;">${route.priority}</div>
          <div style="margin: 6px 0; font-size: 12px;">
            <div><strong>Corridor Length:</strong> ${route.length_km} km (~${route.est_travel_time_min} min)</div>
            <div><strong>From:</strong> ${route.start_point}</div>
            <div><strong>To:</strong> ${route.end_point}</div>
          </div>
          <div style="background: #fef2f2; border-left: 3px solid #ef4444; padding: 6px; font-size: 11px; color: #991b1b; margin-top: 6px;">
            ${route.disclaimer}
          </div>
        </div>
      `;

      casing.bindPopup(popupContent);
      polyline.bindPopup(popupContent);

      const handleClick = () => {
        if (onSelectRoute) onSelectRoute(route);
      };
      casing.on('click', handleClick);
      polyline.on('click', handleClick);

      group.addLayer(casing);
      group.addLayer(polyline);
    });
  }, [evacuationRoutes, activeLayers.evacuation]);

  // Update TomTom Traffic Incident Markers
  useEffect(() => {
    const group = incidentsGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!activeLayers.traffic) return;

    incidents.forEach((inc) => {
      if (!inc.point || !Array.isArray(inc.point) || inc.point.length < 2) return;

      const icon = createIncidentIcon(inc.category, inc.magnitude);
      const marker = L.marker(inc.point, { icon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 200px; color: #1e293b;">
          <div style="font-weight: bold; font-size: 14px; color: #dc2626;">${inc.category}</div>
          <div style="font-size: 12px; color: #475569; margin: 4px 0;">${inc.description}</div>
          <div style="margin: 6px 0; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div><strong>Location:</strong> ${inc.from_location} ${inc.to_location ? `to ${inc.to_location}` : ''}</div>
          </div>
          <div style="font-size: 10px; color: #64748b;">Source: TomTom Real-Time Incident Stream</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectIncident) onSelectIncident(inc);
      });

      group.addLayer(marker);
    });
  }, [incidents, activeLayers.traffic]);

  // Update User GPS Location
  useEffect(() => {
    const group = userLocGroupRef.current;
    const map = mapInstanceRef.current;
    if (!group || !map) return;
    group.clearLayers();

    if (userLocation && userLocation.lat && userLocation.lng) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2.5,
        fillColor: '#3b82f6',
        fillOpacity: 1,
      });

      const pulseCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy || 45,
        color: '#3b82f6',
        weight: 1,
        fillColor: '#60a5fa',
        fillOpacity: 0.18,
      });

      userMarker.bindPopup(`<strong>Your Current Location</strong><br/>Accuracy: ~${Math.round(userLocation.accuracy || 10)}m`);

      group.addLayer(pulseCircle);
      group.addLayer(userMarker);

      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 });
    }
  }, [userLocation]);

  // Update Searched Location Fly-To
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !searchedLocation) return;

    if (searchedMarkerRef.current) {
      map.removeLayer(searchedMarkerRef.current);
      searchedMarkerRef.current = null;
    }

    if (searchedLocation.lat && searchedLocation.lng) {
      const pinIcon = L.divIcon({
        className: 'search-pin-icon',
        html: `
          <div style="
            background: #ef4444;
            width: 24px;
            height: 24px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const marker = L.marker([searchedLocation.lat, searchedLocation.lng], { icon: pinIcon });
      marker.bindPopup(`<strong>${searchedLocation.display_name || searchedLocation.name || 'Selected Location'}</strong>`).openPopup();
      marker.addTo(map);
      searchedMarkerRef.current = marker;

      map.flyTo([searchedLocation.lat, searchedLocation.lng], 15, { duration: 1.2 });
    }
  }, [searchedLocation]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={containerRef} className="w-full h-full min-h-[500px] z-10" />
    </div>
  );
}
