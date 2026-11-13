import sys
import os
sys.path.insert(0, os.path.abspath("."))
from fastapi.testclient import TestClient
from backend.app.main import app

def run_tests():
    client = TestClient(app)
    endpoints = [
        ("GET", "/"),
        ("GET", "/api/health"),
        ("GET", "/api/map/corridor"),
        ("GET", "/api/map/network"),
        ("GET", "/api/traffic/state"),
        ("GET", "/api/traffic/live-stream"),
        ("POST", "/api/traffic/road/toggle", {"road_id": "road_jv_av", "is_closed": True}),
        ("POST", "/api/traffic/road/toggle", {"road_id": "road_jv_av", "is_closed": False}),
        ("POST", "/api/traffic/signal/optimize", {"intersection_name": "Jaydev Vihar Square", "current_cycle_seconds": 75}),
        ("GET", "/api/traffic/predictions"),
        ("GET", "/api/weather/current"),
        ("GET", "/api/weather/layers"),
        ("GET", "/api/disasters/historical"),
        ("GET", "/api/disasters/alerts"),
        ("POST", "/api/disasters/compare?current_wind_kmh=85&current_pressure_hpa=992"),
        ("GET", "/api/waste/reports"),
        ("POST", "/api/waste/report", {
            "title": "Automated Test Plastic Waste",
            "location_name": "Jaydev Vihar Flyover Foot",
            "latitude": 20.2975,
            "longitude": 85.8250,
            "category": "plastic",
            "priority": "high"
        }),
        ("POST", "/api/waste/reports/1/complete", {"incident_id": 1, "worker_notes": "Unit 4 verified clean"}),
        ("GET", "/api/waste/analytics"),
        ("GET", "/api/waste/routes"),
        ("GET", "/api/environment/air-quality"),
        ("POST", "/api/ai/chat", {"query": "Tell me about the 1999 Odisha Super Cyclone", "department_context": "Disaster"}),
        ("POST", "/api/ai/chat", {"query": "What happens if Jaydev Vihar flyover is closed?", "department_context": "Traffic"}),
        ("POST", "/api/ai/chat", {"query": "Where are reported waste accumulation areas?", "department_context": "Waste"}),
        ("GET", "/api/analytics/overview")
    ]

    print("--- CITYMIND AI FULL ENDPOINT VERIFICATION SUITE ---")
    passed = 0
    for item in endpoints:
        method = item[0]
        path = item[1]
        payload = item[2] if len(item) > 2 else None
        print(f"Testing {method} {path}...", flush=True)

        if method == "GET":
            res = client.get(path)
        else:
            res = client.post(path, json=payload if payload else None)

        if res.status_code in [200, 201]:
            passed += 1
            print(f"[PASS] {method} {path} -> {res.status_code} OK", flush=True)
        else:
            print(f"[FAIL] {method} {path} -> {res.status_code} ERROR: {res.text}", flush=True)

    print(f"\nRESULT: {passed}/{len(endpoints)} endpoints successfully tested and functional!")
    assert passed == len(endpoints)

if __name__ == "__main__":
    run_tests()
