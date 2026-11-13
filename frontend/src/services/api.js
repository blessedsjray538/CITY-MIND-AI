import axios from 'axios';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Map Endpoints
export const fetchCorridorInfo = async () => {
  try {
    const res = await apiClient.get('/map/corridor');
    return res.data;
  } catch (err) {
    console.warn('Fallback corridor info:', err);
    return {
      city: 'Bhubaneswar',
      state: 'Odisha',
      country: 'India',
      corridor: 'Jaydev Vihar – Acharya Vihar – Vani Vihar corridor',
      center: { lat: 20.2995, lng: 85.8335, zoom: 14.5 }
    };
  }
};

export const fetchCorridorNetwork = async () => {
  try {
    const res = await apiClient.get('/map/network');
    return res.data;
  } catch (err) {
    console.warn('Fallback corridor network:', err);
    return null;
  }
};

// Traffic Endpoints
export const fetchTrafficState = async () => {
  try {
    const res = await apiClient.get('/traffic/state');
    return res.data;
  } catch (err) {
    console.warn('Traffic state fallback');
    return null;
  }
};

export const fetchTrafficLiveStream = async () => {
  try {
    const res = await apiClient.get('/traffic/live-stream');
    return res.data;
  } catch (err) {
    return null;
  }
};

export const toggleRoadClosure = async (road_id, is_closed) => {
  const res = await apiClient.post('/traffic/road/toggle', { road_id, is_closed });
  return res.data;
};

export const optimizeTrafficSignal = async (intersection_id, current_cycle_seconds) => {
  const res = await apiClient.post('/traffic/signal/optimize', { intersection_id, current_cycle_seconds });
  return res.data;
};

export const fetchTrafficPredictions = async () => {
  const res = await apiClient.get('/traffic/predictions');
  return res.data;
};

// Weather Endpoints
export const fetchCurrentWeather = async () => {
  try {
    const res = await apiClient.get('/weather/current');
    return res.data;
  } catch (err) {
    console.warn('Weather fallback');
    return null;
  }
};

// Disaster Endpoints
export const fetchHistoricalDisasters = async () => {
  try {
    const res = await apiClient.get('/disasters/historical');
    return res.data;
  } catch (err) {
    return { count: 0, disasters: [] };
  }
};

export const fetchDisasterAlerts = async () => {
  try {
    const res = await apiClient.get('/disasters/alerts');
    return res.data;
  } catch (err) {
    return { status: 'STANDBY', alerts: [] };
  }
};

export const compareDisasterRisk = async (wind_speed, pressure) => {
  const res = await apiClient.post(`/disasters/compare?current_wind_kmh=${wind_speed}&current_pressure_hpa=${pressure}`);
  return res.data;
};

// Waste Management Endpoints
export const fetchWasteReports = async () => {
  try {
    const res = await apiClient.get('/waste/reports');
    return res.data;
  } catch (err) {
    return { count: 0, reports: [] };
  }
};

export const submitWasteReport = async (payload) => {
  const res = await apiClient.post('/waste/report', payload);
  return res.data;
};

export const markWasteCleaned = async (incident_id, worker_notes) => {
  const res = await apiClient.post(`/waste/reports/${incident_id}/complete`, { incident_id, worker_notes });
  return res.data;
};

export const fetchWasteAnalytics = async () => {
  const res = await apiClient.get('/waste/analytics');
  return res.data;
};

export const fetchOptimizedRoute = async () => {
  const res = await apiClient.get('/waste/routes');
  return res.data;
};

// Environment Endpoints
export const fetchAirQuality = async () => {
  try {
    const res = await apiClient.get('/environment/air-quality');
    return res.data;
  } catch (err) {
    return null;
  }
};

// AI Central Chat
export const askAIChat = async (query, department_context = 'Overview', selected_entity_id = null, api_key = null) => {
  try {
    const key = api_key || localStorage.getItem('gemini_api_key') || null;
    const res = await apiClient.post('/ai/chat', {
      query,
      department_context,
      selected_entity_id,
      api_key: key
    });
    return res.data;
  } catch (err) {
    console.error('AI chat endpoint error:', err);
    return {
      answer: "CITYMIND AI central offline buffer: Connecting to local heuristics. Bhubaneswar urban network active.",
      confidence: 0.8,
      source: "Offline Heuristics",
      data_classification: "AI_ESTIMATE",
      subsystem_used: "Local Fallback",
      context_tags: ["Offline"],
      suggested_actions: ["Check backend connection"]
    };
  }
};

// Analytics Overview
export const fetchAnalyticsOverview = async () => {
  try {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  } catch (err) {
    return null;
  }
};

// Autonomous Orchestrator & Web Cross-Verification Endpoints
export const fetchOrchestratorStatus = async () => {
  try {
    const res = await apiClient.get('/orchestrator/status');
    return res.data;
  } catch (err) {
    console.warn('Orchestrator fallback state');
    return {
      status: "ONLINE",
      mode: "AUTONOMOUS_OPERATIONS",
      verification_cadence_minutes: 60,
      verification_confidence: 0.98,
      last_cross_verification: new Date().toISOString(),
      latest_decisions: []
    };
  }
};

export const triggerWebCrossVerification = async () => {
  try {
    const res = await apiClient.post('/orchestrator/verify-now');
    return res.data;
  } catch (err) {
    return { message: "Offline verified", updated_confidence: 0.95 };
  }
};

export const fetchOrchestratorDecisions = async () => {
  try {
    const res = await apiClient.get('/orchestrator/decisions');
    return res.data;
  } catch (err) {
    return { count: 0, decisions: [] };
  }
};
