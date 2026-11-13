# CITYMIND AI — API Documentation

Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs` when the backend is running.

## Department Endpoints

### 1. Map & Corridor GIS
- `GET /api/map/corridor`: Retrieves primary development corridor information and landmarks.
- `GET /api/map/network`: Retrieves GeoJSON FeatureCollection of Jaydev Vihar, Acharya Vihar, and Vani Vihar roads.

### 2. Traffic Intelligence
- `GET /api/traffic/state`: Retrieves current vehicular count, speeds, and road closure states.
- `POST /api/traffic/simulation/start`: Resumes simulation.
- `POST /api/traffic/simulation/pause`: Pauses simulation.
- `POST /api/traffic/simulation/reset`: Resets simulation state.
- `POST /api/traffic/road/toggle`: Closes or reopens a road segment (e.g. `road_jv_av`) and triggers congestion redistribution.
- `POST /api/traffic/signal/optimize`: Recommends optimal signal cycle times and calculates waiting time reduction.
- `GET /api/traffic/predictions`: Returns 15-30 minute Random Forest predicted speeds.

### 3. Weather Intelligence
- `GET /api/weather/current`: Returns live Open-Meteo observations for Bhubaneswar.
- `GET /api/weather/layers`: Returns metadata for meteorological layers (wind, radar, thermal, isobars).

### 4. Disaster Early Warning
- `GET /api/disasters/historical`: Returns historical disaster database (1999 Odisha Super Cyclone, Phailin, Fani).
- `GET /api/disasters/alerts`: Returns active storm and monsoon alerts.
- `POST /api/disasters/compare`: Compares active wind and pressure parameters against historical benchmarks.

### 5. Smart Waste Management
- `GET /api/waste/reports`: Lists all reported incidents.
- `POST /api/waste/report`: Submits a new report (marks location RED).
- `POST /api/waste/reports/{id}/complete`: Marks an incident as cleaned (turns location GREEN).
- `GET /api/waste/analytics`: Returns counters and resolution metrics.
- `GET /api/waste/routes`: Returns Dijkstra optimized compactor truck route.

### 6. Environmental Intelligence
- `GET /api/environment/air-quality`: Returns Bhubaneswar AQI, PM2.5, PM10, and vehicle idle emission correlation.

### 7. Central AI Intelligence
- `POST /api/ai/chat`: Queries the central urban systems analyst with context awareness.

### 8. Analytics & Reports
- `GET /api/analytics/overview`: Returns aggregate performance trends and department health scores.
