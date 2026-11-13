# CITYMIND AI — Intelligent Digital Twin of a City

> **Your City. Your Simulation. Smarter Decisions.**
> **Primary Location:** Bhubaneswar, Odisha, India
> **Core Corridor:** Jaydev Vihar – Acharya Vihar – Vani Vihar corridor (NH-16)

---

## 🏛️ System Overview

CITYMIND AI is an intelligent digital twin platform for urban management, meteorological observation, disaster early warning, and responsive civic operations. Rather than a compressed dashboard or static UI mockup, CITYMIND AI operates as a complete page-based urban command environment where each major city department functions independently while communicating through a central AI intelligence engine.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: 3.11+ (virtual environment configured in `backend/venv`)

### 2. Running the Backend (FastAPI)
```powershell
# In the project root:
.\backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### 3. Running the Frontend (Vite + React)
```powershell
# In another terminal:
cd frontend
npm run dev
```
- Frontend application runs at: `http://localhost:5173`

---

## 🏢 Department Environments

1. **Overview**: Executive city pulse, real-time alert banners, Jaydev Vihar corridor summary, and department health metrics.
2. **Digital Twin**: 3D GIS environment using MapLibre GL JS, featuring real Bhubaneswar road geometries and civic spatial anchors.
3. **Traffic Intelligence**: Real-time traffic simulation (A* flow model), dynamic road closure testing (Jaydev Vihar flyover closure & reroute recalculation), and signal timing optimization.
4. **Weather Intelligence**: Meteorological monitoring station pulling live telemetry from Open-Meteo synced with WMO Station 42971 (Bhubaneswar Airport) across wind, precipitation radar, thermal gradients, and barometric isobars.
5. **Disaster Intelligence**: Early warning station tracking Bay of Bengal storm systems with automated parameter comparison against historical benchmarks (including the **1999 Odisha Super Cyclone** and Cyclone Fani 2019).
6. **Smart Waste Management**: Red (Unattended) vs. Green (Cleaned) spatial workflow for municipal sanitation workers, featuring Dijkstra route optimization for collection compactor trucks.
7. **Environmental Intelligence**: Ambient air quality monitoring (CPCB standard AQI, PM2.5, PM10) correlated with traffic congestion idle emissions.
8. **Central AI Advisor**: Tool-based reasoning analyst accessible across every department with strict zero-hallucination source attribution.
9. **Analytics & Reports**: Longitudinal trend analysis, weekly SLA completion rates, and exportable corridor briefings.
10. **Settings**: Platform parameterization, telemetry cadence controls, and role-based permissions.

---

## 📜 Documentation Directory
- Architecture Specification: [`docs/architecture.md`](file:///c:/Users/absjr/Desktop/CITY%20AI/docs/architecture.md)
- Authorized Data Sources: [`docs/data_sources.md`](file:///c:/Users/absjr/Desktop/CITY%20AI/docs/data_sources.md)
- API Reference: [`docs/api_documentation.md`](file:///c:/Users/absjr/Desktop/CITY%20AI/docs/api_documentation.md)
- Demonstration Script: [`docs/demo_script.md`](file:///c:/Users/absjr/Desktop/CITY%20AI/docs/demo_script.md)
