# CITYMIND AI — Authorized Data Sources & Provenance

In adherence to hackathon development integrity rules, CITYMIND AI strictly prohibits unauthorized scraping, unofficial iframe embeds, or fabricated data. All data sources are documented below:

| Subsystem | Data Provider / Source | Provenance & Licensing | Usage Mode |
| :--- | :--- | :--- | :--- |
| **Weather Intelligence** | [Open-Meteo](https://open-meteo.com) | Free, Open-Source, Non-commercial & Commercial CC-BY 4.0 | `VERIFIED_REAL` live API for Bhubaneswar (`20.2961° N, 85.8245° E`) |
| **Meteorological Station** | WMO Station 42971 (Bhubaneswar Airport) | World Meteorological Organization / IMD | Temperature, humidity, pressure, surface winds |
| **Environmental Telemetry**| Open-Meteo Air Quality & CPCB Standard | Open-Source European / CPCB standard model | PM2.5, PM10, NO2, CO, Ozone |
| **Historical Disasters** | India Meteorological Department (IMD) & OSDMA Archives | Official Government of Odisha Publications | 1999 Super Cyclone, Cyclone Phailin 2013, Cyclone Fani 2019 parameters |
| **Corridor Geospatial GIS**| OpenStreetMap & CartoDB Dark Matter | ODbL / Carto Attribution License | Jaydev Vihar – Acharya Vihar – Vani Vihar vector geometries |
| **Traffic Simulation** | Synthetic Micro-simulation Engine | Developed using NetworkX flow models | `LIVE_SIMULATION` with clear labeling |
| **Waste Management** | BMC Operational Workflow Model | Modeled on Bhubaneswar Municipal Corporation sanitation protocols | Red (uncleaned) vs Green (cleaned) workflow |
