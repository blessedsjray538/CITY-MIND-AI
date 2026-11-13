// Authentic Emergency Facilities in Bhubaneswar, Odisha
export const DEFAULT_EMERGENCY_LOCATIONS = [
  {
    id: "hosp-aiims",
    name: "AIIMS Bhubaneswar (Trauma & Emergency Care)",
    type: "hospital",
    category: "Apex Medical Institute & Trauma Centre",
    lat: 20.2312,
    lng: 85.7758,
    phone: "+91-674-2476789",
    emergency_helpline: "0674-2476461",
    address: "Sijua, Patrapada, Bhubaneswar, Odisha 751019",
    capacity_beds: 960,
    icu_beds: 120,
    blood_bank: true,
    verified: true,
    verified_by: "Odisha State Health Authority"
  },
  {
    id: "hosp-apollo",
    name: "Apollo Hospitals Bhubaneswar",
    type: "hospital",
    category: "Multi-Specialty Tertiary Care",
    lat: 20.3094,
    lng: 85.8362,
    phone: "+91-674-6661016",
    emergency_helpline: "1066",
    address: "Plot No. 251, Old Sainik School Rd, Unit 15, Bhubaneswar 751005",
    capacity_beds: 350,
    icu_beds: 65,
    blood_bank: true,
    verified: true,
    verified_by: "BMC Health Wing"
  },
  {
    id: "hosp-capital",
    name: "Capital Hospital (Chief State Referral Centre)",
    type: "hospital",
    category: "Government Referral Hospital",
    lat: 20.2618,
    lng: 85.8286,
    phone: "+91-674-2391983",
    emergency_helpline: "0674-2391983",
    address: "Unit 6, Ganga Nagar, Bhubaneswar, Odisha 751001",
    capacity_beds: 750,
    icu_beds: 50,
    blood_bank: true,
    verified: true,
    verified_by: "Health & Family Welfare Dept, Odisha"
  },
  {
    id: "hosp-kims",
    name: "KIMS Hospital & Medical College",
    type: "hospital",
    category: "Super Specialty Disaster Care",
    lat: 20.3533,
    lng: 85.8184,
    phone: "+91-674-2725472",
    emergency_helpline: "0674-7105300",
    address: "KIIT University Campus 5, Patia, Bhubaneswar 751024",
    capacity_beds: 1600,
    icu_beds: 180,
    blood_bank: true,
    verified: true,
    verified_by: "BMC Health Wing"
  },
  {
    id: "hosp-sum",
    name: "IMS & SUM Hospital",
    type: "hospital",
    category: "Emergency & Trauma Centre",
    lat: 20.2825,
    lng: 85.7725,
    phone: "+91-674-2386281",
    emergency_helpline: "0674-2386292",
    address: "K8 Kalinga Nagar, Ghatikia, Bhubaneswar 751003",
    capacity_beds: 1200,
    icu_beds: 140,
    blood_bank: true,
    verified: true,
    verified_by: "Odisha Disaster Health Wing"
  },
  {
    id: "fire-kalpana",
    name: "Kalpana Fire Station (Central Headquarters)",
    type: "fire_station",
    category: "Primary Emergency Rescue Unit",
    lat: 20.2562,
    lng: 85.8437,
    phone: "101",
    emergency_helpline: "0674-2310101",
    address: "Kalpana Square, Cuttack-Puri Road, Bhubaneswar 751006",
    vehicles: ["Water Benders (4)", "Hydraulic Rescue Tender (1)", "Emergency Foam Crash (1)"],
    boats: 3,
    verified: true,
    verified_by: "Directorate of Fire Services, Odisha"
  },
  {
    id: "fire-cshpur",
    name: "Chandrasekharpur Fire Station",
    type: "fire_station",
    category: "North Zone Rapid Fire Unit",
    lat: 20.3298,
    lng: 85.8155,
    phone: "101",
    emergency_helpline: "0674-2300101",
    address: "Sailashree Vihar, Chandrasekharpur, Bhubaneswar 751021",
    vehicles: ["Heavy Rescue Water Bowsers (2)", "Quick Reaction Vehicles (2)"],
    boats: 2,
    verified: true,
    verified_by: "Directorate of Fire Services, Odisha"
  },
  {
    id: "fire-secretariat",
    name: "Capital Fire Station (Forest Park)",
    type: "fire_station",
    category: "High-Security Emergency Unit",
    lat: 20.2644,
    lng: 85.8198,
    phone: "101",
    emergency_helpline: "0674-2401010",
    address: "Forest Park, Unit 1, Bhubaneswar 751009",
    vehicles: ["Hydraulic Aerial Ladder (1)", "Water Tenders (3)"],
    boats: 2,
    verified: true,
    verified_by: "Directorate of Fire Services, Odisha"
  },
  {
    id: "police-nayapalli",
    name: "Nayapalli Police Station",
    type: "police_station",
    category: "Sub-Divisional Police Office",
    lat: 20.2988,
    lng: 85.8175,
    phone: "112",
    emergency_helpline: "0674-2561565",
    address: "IRC Village, Nayapalli, Bhubaneswar 751015",
    patrol_units: 6,
    verified: true,
    verified_by: "Bhubaneswar-Cuttack Police Commissionerate"
  },
  {
    id: "police-saheed-nagar",
    name: "Saheed Nagar Police Station",
    type: "police_station",
    category: "Urban Corridor Security Unit",
    lat: 20.2882,
    lng: 85.8456,
    phone: "112",
    emergency_helpline: "0674-2541334",
    address: "Janpath Road, Saheed Nagar, Bhubaneswar 751007",
    patrol_units: 8,
    verified: true,
    verified_by: "Bhubaneswar-Cuttack Police Commissionerate"
  },
  {
    id: "police-khandagiri",
    name: "Khandagiri Police Station",
    type: "police_station",
    category: "Highway & West Sector Police Hub",
    lat: 20.2585,
    lng: 85.7874,
    phone: "112",
    emergency_helpline: "0674-2384112",
    address: "Near Khandagiri Caves, Baramunda Link, Bhubaneswar 751030",
    patrol_units: 5,
    verified: true,
    verified_by: "Bhubaneswar-Cuttack Police Commissionerate"
  },
  {
    id: "amb-odraf-base",
    name: "ODRAF (Odisha Disaster Rapid Action Force) Base & 108 EMS Hub",
    type: "ambulance_service",
    category: "State Disaster Rapid Action & Critical EMS",
    lat: 20.2941,
    lng: 85.8118,
    phone: "108",
    emergency_helpline: "0674-2534177",
    address: "OSAP 7th Battalion Campus, Nayapalli, Bhubaneswar 751012",
    ambulances_available: 14,
    als_ambulances: 6,
    verified: true,
    verified_by: "OSDMA (Odisha State Disaster Management Authority)"
  },
  {
    id: "amb-central-108",
    name: "Central Emergency 108 / 102 Fleet Station",
    type: "ambulance_service",
    category: "Statewide Emergency Fleet Dispatch",
    lat: 20.2715,
    lng: 85.8340,
    phone: "108",
    emergency_helpline: "108",
    address: "Master Canteen Transit Hub, Station Square, Bhubaneswar 751001",
    ambulances_available: 10,
    als_ambulances: 4,
    verified: true,
    verified_by: "Department of Health & Emergency Services, Odisha"
  },
  {
    id: "shelter-jaydev",
    name: "Jaydev Vihar Multi-Purpose Cyclone & Flood Shelter",
    type: "emergency_shelter",
    category: "Designated Cyclone & Flood Resilient Facility",
    lat: 20.3015,
    lng: 85.8235,
    phone: "0674-2550119",
    emergency_helpline: "1077 (DEOC)",
    address: "Jaydev Vihar Community Ground, Ward 26, Bhubaneswar 751013",
    capacity_persons: 1800,
    generator_backup: true,
    potable_water: true,
    food_stock_days: 7,
    verified: true,
    verified_by: "OSDMA / BMC Disaster Cell"
  },
  {
    id: "shelter-vani-vihar",
    name: "Utkal University Disaster Relief Camp",
    type: "relief_camp",
    category: "High-Capacity Campus Relief & Evacuee Hub",
    lat: 20.3068,
    lng: 85.8398,
    phone: "0674-2580120",
    emergency_helpline: "1077",
    address: "Utkal University Indoor Stadium Complex, Vani Vihar 751004",
    capacity_persons: 3200,
    generator_backup: true,
    potable_water: true,
    food_stock_days: 10,
    verified: true,
    verified_by: "OSDMA / BMC Disaster Cell"
  },
  {
    id: "shelter-kalinga-stadium",
    name: "Kalinga Sports Complex Disaster Transit Center",
    type: "emergency_shelter",
    category: "Mass Evacuation Transit & Staging Area",
    lat: 20.3032,
    lng: 85.8195,
    phone: "0674-2420555",
    emergency_helpline: "1077",
    address: "Biju Patnaik Hockey & Indoor Complex, Nayapalli, Bhubaneswar 751012",
    capacity_persons: 4500,
    generator_backup: true,
    potable_water: true,
    food_stock_days: 12,
    verified: true,
    verified_by: "Sports & Youth Services Dept / OSDMA"
  },
  {
    id: "shelter-rasulgarh",
    name: "Rasulgarh Community Relief Center",
    type: "relief_camp",
    category: "East Zone Lowland Evacuation Shelter",
    lat: 20.2974,
    lng: 85.8645,
    phone: "0674-2582910",
    emergency_helpline: "1077",
    address: "Rasulgarh Kalyan Mandap, Ward 31, Bhubaneswar 751010",
    capacity_persons: 1500,
    generator_backup: true,
    potable_water: true,
    food_stock_days: 5,
    verified: true,
    verified_by: "BMC Disaster Cell"
  }
];

// Authentic GeoJSON Disaster Zones
export const DEFAULT_DISASTER_ZONES = [
  {
    id: "zone-gangua-flood",
    name: "Gangua Nullah / Daya Basin Inundation Zone",
    type: "flood",
    severity: "high",
    status: "monitored",
    description: "Low-lying catchment basin prone to rapid waterlogging during heavy monsoon and flood discharges from Kuakhai/Daya rivers.",
    risk_level: "Flood Inundation Alert - Grade 3",
    authorizing_agency: "Central Water Commission & BMC Stormwater Cell",
    advisory: "Residents in ground floor dwellings advised to identify vertical evacuation shelters. Maintain water pumps and sandbags.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.8420, 20.2650],
          [85.8600, 20.2680],
          [85.8750, 20.2520],
          [85.8680, 20.2350],
          [85.8450, 20.2400],
          [85.8350, 20.2550],
          [85.8420, 20.2650]
        ]
      ]
    }
  },
  {
    id: "zone-acharya-drainage",
    name: "Acharya Vihar - ISKCON Flash Waterlogging Hotspot",
    type: "flood",
    severity: "critical",
    status: "active_hazard",
    description: "Chronic stormwater bottleneck around NH-16 underpass and drainage canal 10; rapid submersion up to 3 feet during >40mm/hr rainfall.",
    risk_level: "Urban Flash Flooding Risk",
    authorizing_agency: "Bhubaneswar Municipal Corporation (BMC)",
    advisory: "Underpass closure protocol active during intense downpours. Heavy vehicles divert to Outer Ring Road.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.8200, 20.2980],
          [85.8320, 20.2990],
          [85.8340, 20.2910],
          [85.8220, 20.2900],
          [85.8200, 20.2980]
        ]
      ]
    }
  },
  {
    id: "zone-coastal-cyclone",
    name: "East Odisha Coastal Cyclone Buffer Corridor",
    type: "cyclone",
    severity: "moderate",
    status: "seasonal_watch",
    description: "High-wind exposure corridor during Bay of Bengal cyclonic storms (Depression / Deep Depression / Severe Cyclonic Storm track).",
    risk_level: "Wind Velocity Hazard (80-120 km/h)",
    authorizing_agency: "India Meteorological Department (IMD) - Cyclone Warning Centre, Bhubaneswar",
    advisory: "Secure rooftop loose objects, inspect telecom towers, stand by for cyclone shelter activation.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.8600, 20.3400],
          [85.8950, 20.3200],
          [85.8900, 20.2600],
          [85.8500, 20.2750],
          [85.8600, 20.3400]
        ]
      ]
    }
  },
  {
    id: "zone-rasulgarh-industrial",
    name: "Mancheswar Industrial & Warehouse Hazard Buffer",
    type: "fire",
    severity: "moderate",
    status: "monitored",
    description: "Industrial zone with flammable chemical storage and high-density electrical grid substations.",
    risk_level: "Industrial Fire & Hazmat Buffer",
    authorizing_agency: "Directorate of Factories & Boilers / Fire Services Odisha",
    advisory: "Strict compliance with Fire Safety Act; 100m containment perimeter maintained around LPG depot.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.8480, 20.3250],
          [85.8650, 20.3300],
          [85.8700, 20.3120],
          [85.8520, 20.3100],
          [85.8480, 20.3250]
        ]
      ]
    }
  },
  {
    id: "zone-khandagiri-runoff",
    name: "Khandagiri - Udayagiri Slope Runoff & Restricted Area",
    type: "landslide",
    severity: "low",
    status: "monitored",
    description: "Rocky hillock slope where intense downpours generate flash sediment runoff into adjoining highway lanes.",
    risk_level: "Slope Debris Runoff Warning",
    authorizing_agency: "Archaeological Survey of India & BMC Disaster Response",
    advisory: "Touristic ascent prohibited during thunderstorms and heavy gale warnings.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.7800, 20.2650],
          [85.7920, 20.2670],
          [85.7940, 20.2540],
          [85.7810, 20.2520],
          [85.7800, 20.2650]
        ]
      ]
    }
  },
  {
    id: "zone-baramunda-evac-hub",
    name: "Baramunda Staging & Evacuation Transit Sector",
    type: "evacuation_zone",
    severity: "safe_staging",
    status: "designated_safe_zone",
    description: "Designated municipal gathering zone for state disaster transport buses and mass logistics deployment.",
    risk_level: "Official Transit & Shelter Staging Area",
    authorizing_agency: "OSDMA & Bhubaneswar Urban Transport Dept",
    advisory: "Equipped with high-capacity emergency diesel gensets, water tanks, and ODRAF command post.",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [85.7900, 20.2760],
          [85.8050, 20.2780],
          [85.8070, 20.2680],
          [85.7910, 20.2670],
          [85.7900, 20.2760]
        ]
      ]
    }
  }
];

// Designated Evacuation Corridors
export const DEFAULT_EVACUATION_ROUTES = [
  {
    id: "evac-nh16-artery",
    name: "NH-16 Primary Disaster Evacuation Arterial",
    code: "EVAC-ROUTE-01",
    priority: "High Priority - Arterial Expressway",
    status: "open",
    verified_by_authorities: true,
    authorizing_officer: "DCP Traffic & Chief Engineer, OSDMA",
    start_point: "Baramunda Bus Terminal / Khandagiri",
    end_point: "Rasulgarh Flyover Junction",
    length_km: 8.4,
    est_travel_time_min: 14,
    lane_clearance: "Dedicated Emergency Right Lane Active",
    hazard_warnings: ["Use flyover bypass during Acharya Vihar waterlogging alert."],
    coordinates: [
      [85.7900, 20.2710],
      [85.8060, 20.2860],
      [85.8180, 20.2980],
      [85.8260, 20.3010],
      [85.8420, 20.3040],
      [85.8630, 20.2970]
    ],
    disclaimer: "Designated emergency relief corridor. Approved by authorized emergency personnel."
  },
  {
    id: "evac-janpath-corridor",
    name: "Janpath Emergency Medical & Shelter Corridor",
    code: "EVAC-ROUTE-02",
    priority: "High Priority - Medical Link",
    status: "open",
    verified_by_authorities: true,
    authorizing_officer: "Director of Medical Relief, Govt of Odisha",
    start_point: "Vani Vihar Junction (Utkal University Relief Camp)",
    end_point: "Capital Hospital (Unit 6) via Master Canteen",
    length_km: 5.1,
    est_travel_time_min: 11,
    lane_clearance: "Signals synced with Emergency Green Wave Protocol",
    hazard_warnings: [],
    coordinates: [
      [85.8390, 20.3050],
      [85.8420, 20.2920],
      [85.8430, 20.2830],
      [85.8380, 20.2720],
      [85.8286, 20.2618]
    ],
    disclaimer: "Direct access route to Capital Hospital. Police escort available during Grade 2+ disasters."
  },
  {
    id: "evac-nandankanan-north",
    name: "Nandankanan Road North Evacuation Artery",
    code: "EVAC-ROUTE-03",
    priority: "Medium Priority - Northern Sector Link",
    status: "open",
    verified_by_authorities: true,
    authorizing_officer: "BMC North Zone Disaster Officer",
    start_point: "Jaydev Vihar Intersect",
    end_point: "KIMS Hospital / Patia Multi-Shelter Hub",
    length_km: 6.8,
    est_travel_time_min: 15,
    lane_clearance: "Wide 6-lane elevated carriage",
    hazard_warnings: ["Heavy traffic around Kalinga Hospital junction; obey police diversion signals."],
    coordinates: [
      [85.8250, 20.3020],
      [85.8240, 20.3150],
      [85.8220, 20.3280],
      [85.8200, 20.3420],
      [85.8184, 20.3533]
    ],
    disclaimer: "Northern relief artery connecting Jaydev Vihar to KIMS Tertiary Care."
  },
  {
    id: "evac-cuttack-bypass",
    name: "Cuttack-Puri Bypass Relief Corridor",
    code: "EVAC-ROUTE-04",
    priority: "Critical - Inter-District Logistics Corridor",
    status: "open",
    verified_by_authorities: true,
    authorizing_officer: "Superintendent of Police (Logistics & Relief)",
    start_point: "Rasulgarh Square",
    end_point: "Daya Bridge Emergency Outpost",
    length_km: 9.2,
    est_travel_time_min: 18,
    lane_clearance: "Dual carriage highway, heavy emergency vehicles permitted",
    hazard_warnings: ["Monitor Daya River gauge station levels during continuous precipitation >60mm."],
    coordinates: [
      [85.8630, 20.2970],
      [85.8670, 20.2820],
      [85.8650, 20.2610],
      [85.8580, 20.2450],
      [85.8510, 20.2280]
    ],
    disclaimer: "Inter-district logistics route for NDRF/ODRAF heavy machinery transport."
  }
];

// Geodesic distance calculator (km)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function findNearestEmergencyFacilities(lat, lng, list = DEFAULT_EMERGENCY_LOCATIONS, limit = 4) {
  const enriched = list.map((loc) => {
    const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
    return {
      ...loc,
      distance_km: dist,
      est_transit_minutes: Math.max(2, Math.round((dist / 28.0) * 60))
    };
  });
  enriched.sort((a, b) => a.distance_km - b.distance_km);
  return enriched.slice(0, limit);
}
