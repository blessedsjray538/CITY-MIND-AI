from fastapi import APIRouter
import datetime

router = APIRouter(prefix="/analytics", tags=["City Analytics & Reports"])

@router.get("/overview")
def get_analytics_overview():
    return {
        "city": "Bhubaneswar",
        "focus_corridor": "Jaydev Vihar – Acharya Vihar – Vani Vihar",
        "system_status": "OPTIMAL",
        "overall_health_score": 94.2,
        "departments": {
            "traffic": {"status": "ACTIVE", "score": 88, "metric": "36.4 km/h avg speed", "incidents": 1},
            "weather": {"status": "LIVE_FEED", "score": 96, "metric": "Open-Meteo Synced (30.2°C)", "incidents": 0},
            "disasters": {"status": "MONITORING", "score": 95, "metric": "1 Advisory Alert (Monsoon)", "incidents": 0},
            "waste": {"status": "DISPATCHING", "score": 91, "metric": "75% Cleaned (Green)", "incidents": 2},
            "environment": {"status": "STABLE", "score": 89, "metric": "AQI 92 (Moderate)", "incidents": 0}
        },
        "trends": {
            "traffic_hourly": [
                {"hour": "06:00", "speed": 48.0, "congestion": 20},
                {"hour": "08:00", "speed": 32.0, "congestion": 65},
                {"hour": "10:00", "speed": 26.5, "congestion": 82},
                {"hour": "12:00", "speed": 38.0, "congestion": 45},
                {"hour": "14:00", "speed": 42.0, "congestion": 38},
                {"hour": "16:00", "speed": 34.0, "congestion": 60},
                {"hour": "18:00", "speed": 24.0, "congestion": 88},
                {"hour": "20:00", "speed": 31.0, "congestion": 70},
                {"hour": "22:00", "speed": 46.0, "congestion": 25}
            ],
            "waste_weekly_resolution": [
                {"day": "Mon", "reported": 14, "cleaned": 12},
                {"day": "Tue", "reported": 18, "cleaned": 17},
                {"day": "Wed", "reported": 11, "cleaned": 11},
                {"day": "Thu", "reported": 16, "cleaned": 15},
                {"day": "Fri", "reported": 22, "cleaned": 20},
                {"day": "Sat", "reported": 25, "cleaned": 22},
                {"day": "Sun", "reported": 13, "cleaned": 13}
            ],
            "aqi_weekly": [
                {"day": "Mon", "aqi": 88, "pm25": 38},
                {"day": "Tue", "aqi": 94, "pm25": 42},
                {"day": "Wed", "aqi": 105, "pm25": 48},
                {"day": "Thu", "aqi": 92, "pm25": 41},
                {"day": "Fri", "aqi": 98, "pm25": 44},
                {"day": "Sat", "aqi": 85, "pm25": 36},
                {"day": "Sun", "aqi": 79, "pm25": 32}
            ]
        }
    }
