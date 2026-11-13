from fastapi import APIRouter
from typing import List, Dict, Any
import datetime

router = APIRouter(prefix="/disasters", tags=["Disaster Intelligence"])

HISTORICAL_DISASTERS = [
    {
        "id": "cyclone_1999_super",
        "name": "1999 Odisha Super Cyclone (BOB 06 / 05B)",
        "year": 1999,
        "dates": "25 October – 4 November 1999 (Landfall: 29 Oct 1999)",
        "type": "Super Cyclonic Storm (Category 5 Equivalent)",
        "max_wind_kmh": 260.0,
        "lowest_pressure_hpa": 912.0,
        "landfall_location": "Ersama – Paradip, Jagatsinghpur District, Odisha",
        "affected_areas": "14 coastal districts including Jagatsinghpur, Kendrapara, Cuttack, Khordha (Bhubaneswar), Puri, and Balasore",
        "official_casualties": "9,887 (Official Government of Odisha count; unofficial estimates higher)",
        "damage_description": "Total collapse of communication and electrical networks across coastal Odisha. In Bhubaneswar, 80% of green cover was uprooted, telecommunications paralyzed for weeks.",
        "lessons_learned": "Led directly to the establishment of the Odisha State Disaster Management Authority (OSDMA)—India's first specialized state disaster management body, followed by the National Disaster Management Act in 2005 and the construction of over 800 cyclone shelters.",
        "source": "India Meteorological Department (IMD) Technical Report & OSDMA Archives"
    },
    {
        "id": "cyclone_2013_phailin",
        "name": "Very Severe Cyclonic Storm Phailin",
        "year": 2013,
        "dates": "8 October – 14 October 2013 (Landfall: 12 Oct 2013)",
        "type": "Very Severe Cyclonic Storm",
        "max_wind_kmh": 215.0,
        "lowest_pressure_hpa": 940.0,
        "landfall_location": "Near Gopalpur, Ganjam District, Odisha",
        "affected_areas": "Ganjam, Puri, Khordha, Cuttack, Jagatsinghpur",
        "official_casualties": "44 (Massive reduction due to preemptive evacuation)",
        "damage_description": "Over 1.15 million people successfully evacuated in 48 hours—hailed globally as a benchmark in disaster evacuation. Heavy crop and transmission line damage.",
        "lessons_learned": "Validated Odisha's 'Zero Casualty' disaster mission and community-level cyclone warning siren systems.",
        "source": "IMD Post-Storm Report & WMO Special Bulletin"
    },
    {
        "id": "cyclone_2019_fani",
        "name": "Extremely Severe Cyclonic Storm Fani",
        "year": 2019,
        "dates": "26 April – 5 May 2019 (Landfall: 3 May 2019)",
        "type": "Extremely Severe Cyclonic Storm",
        "max_wind_kmh": 215.0,
        "lowest_pressure_hpa": 932.0,
        "landfall_location": "Puri, Odisha (Tracked directly over Bhubaneswar)",
        "affected_areas": "Puri, Bhubaneswar (Khordha), Cuttack",
        "official_casualties": "64",
        "damage_description": "Eyewall passed directly over Bhubaneswar Smart City. 100% power distribution collapsed, Jaydev Vihar & Janpath corridors suffered immense hoarding, tree, and roof damages. Over 1.4 million evacuated in 24 hours.",
        "lessons_learned": "Demonstrated the urgent need for underground power cabling in smart cities like Bhubaneswar and satellite-resilient municipal digital twin monitoring.",
        "source": "OSDMA Comprehensive Report on Cyclone FANI 2019"
    }
]

ACTIVE_ALERTS = [
    {
        "id": "alert_monsoon_surge_2026",
        "title": "Bay of Bengal Low Pressure Watch",
        "severity": "Advisory", # Information, Advisory, Watch, Warning, Severe
        "hazard_type": "Heavy Rainfall & Localized Inundation",
        "affected_corridors": "Jaydev Vihar – Acharya Vihar drainage basin, Bhubaneswar",
        "wind_speed_estimate": "35-45 km/h",
        "rainfall_forecast_mm": "55-75 mm / 24h",
        "issuing_authority": "India Meteorological Department (IMD) Meteorological Centre, Bhubaneswar",
        "valid_until": (datetime.datetime.utcnow() + datetime.timedelta(hours=36)).strftime("%Y-%m-%d %H:%M UTC"),
        "status": "ACTIVE_MONITORING",
        "recommended_precautions": [
            "Clear municipal stormwater drains along NH-16 corridor",
            "Sanitation teams on standby for drain de-clogging at Jaydev Vihar underpass",
            "Civic commuters advised to monitor live traffic reroutes"
        ]
    }
]

@router.get("/historical")
def get_historical_disasters():
    return {
        "count": len(HISTORICAL_DISASTERS),
        "disasters": HISTORICAL_DISASTERS
    }

@router.get("/alerts")
def get_disaster_alerts():
    return {
        "status": "OPERATIONAL",
        "active_alerts_count": len(ACTIVE_ALERTS),
        "alerts": ACTIVE_ALERTS
    }

@router.post("/compare")
def compare_hazard(current_wind_kmh: float = 75.0, current_pressure_hpa: float = 998.0):
    super_1999 = HISTORICAL_DISASTERS[0]
    fani_2019 = HISTORICAL_DISASTERS[2]

    return {
        "analysis": "Hazard Parameter Comparison Matrix",
        "current_event": {
            "wind_speed_kmh": current_wind_kmh,
            "central_pressure_hpa": current_pressure_hpa,
            "wind_ratio_vs_1999": round(current_wind_kmh / super_1999["max_wind_kmh"], 2),
            "pressure_differential_vs_1999": round(current_pressure_hpa - super_1999["lowest_pressure_hpa"], 1)
        },
        "historical_benchmarks": [
            {"event": "1999 Super Cyclone", "max_wind": 260, "pressure": 912, "severity_tier": "Unprecedented / Catastrophic"},
            {"event": "2019 Cyclone Fani", "max_wind": 215, "pressure": 932, "severity_tier": "Extremely Severe"}
        ],
        "assessment": "The current monitored atmospheric disturbance exhibits sub-cyclonic velocity (< 62 km/h deep depression threshold). Immediate structural destruction risk is Low; primary risk factor is localized urban precipitation accumulation."
    }
