# CITYMIND AI — System Architecture

## 1. System Vision
CITYMIND AI is engineered as an intelligent, modular digital twin of a real city, anchored in the capital city of Odisha: **Bhubaneswar** (focus corridor: Jaydev Vihar – Acharya Vihar – Vani Vihar).

## 2. Architectural Layers

### A. Presentation Layer (Frontend)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Custom Cyberpunk / Dark Glassmorphism Command Center
- **GIS / Mapping:** MapLibre GL JS with custom dark raster and GeoJSON vector overlays
- **Data Visualizations:** Recharts for multi-variate time-series telemetry
- **Iconography:** Lucide React
- **Dual Navigation Engine:** 
  1. *Method A (Direct Page Mode):* Dedicated departmental viewport switching.
  2. *Method B (Continuous Mode):* Vertical scrolling with `IntersectionObserver` auto-detecting the active section and synchronizing with the persistent sidebar.

### B. Application & API Engine Layer (Backend)
- **Framework:** FastAPI (Python 3.11) with ASGI Uvicorn
- **Validation:** Pydantic V2 Schemas
- **Database ORM:** SQLAlchemy with SQLite persistence (PostgreSQL / PostGIS ready)
- **Routing & Graph Computation:** NetworkX with A* and Dijkstra shortest-path algorithms
- **Machine Learning:** Scikit-learn (Random Forest Regressor for 15-30 minute congestion prediction)

### C. Data Ingestion & Integration Layer
- **Live Meteorological Feed:** Open-Meteo REST API (synced to WMO Station 42971, Bhubaneswar)
- **Ambient Air Quality:** Open-Meteo Air Quality & CPCB Standard model
- **Disaster Archives:** Historical benchmarks from IMD and OSDMA Technical Monographs (1999 Odisha Super Cyclone, Cyclone Phailin 2013, Cyclone Fani 2019)
- **Municipal Sanitation Workflow:** Real-time Red/Green incident status tracking and compactor route calculation

### D. Central AI Intelligence Layer
- **Role:** Autonomous Urban Systems Analyst
- **Architecture:** Tool-augmented synthesis across subsystems
- **Integrity Rule:** Clear classification of data sources:
  - `VERIFIED_REAL`
  - `LIVE_SIMULATION`
  - `HISTORICAL_RECORD`
  - `AI_ESTIMATE`
