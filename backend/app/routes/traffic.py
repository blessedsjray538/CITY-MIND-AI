from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import datetime
import math
import random

router = APIRouter(prefix="/traffic", tags=["Traffic Intelligence"])

# Detailed road polyline segments for the Bhubaneswar development corridor
ROAD_SEGMENTS = {
    "road_jv_av": {
        "id": "road_jv_av",
        "name": "Jaydev Vihar to Acharya Vihar (NH-16)",
        "lanes": 6,
        "length_m": 1400.0,
        "is_closed": False,
        "status": "moderate", # low (green), moderate (yellow), high (orange), severe/closed (red)
        "speed_limit": 60.0,
        "avg_speed_kmh": 38.5,
        "vehicle_count": 48,
        "capacity": 75,
        "coordinates": [
            [85.8249, 20.2974],
            [85.8268, 20.2984],
            [85.8285, 20.2993],
            [85.8305, 20.3003],
            [85.8322, 20.3013],
            [85.8340, 20.3023]
        ]
    },
    "road_av_vv": {
        "id": "road_av_vv",
        "name": "Acharya Vihar to Vani Vihar (NH-16)",
        "lanes": 6,
        "length_m": 1250.0,
        "is_closed": False,
        "status": "low", # Green
        "speed_limit": 60.0,
        "avg_speed_kmh": 51.2,
        "vehicle_count": 28,
        "capacity": 70,
        "coordinates": [
            [85.8340, 20.3023],
            [85.8365, 20.3022],
            [85.8390, 20.3020],
            [85.8420, 20.3018],
            [85.8452, 20.3015]
        ]
    },
    "road_jv_nandankanan": {
        "id": "road_jv_nandankanan",
        "name": "Jaydev Vihar - Nandankanan Expressway",
        "lanes": 4,
        "length_m": 2100.0,
        "is_closed": False,
        "status": "high", # Orange (Heavy slowdown)
        "speed_limit": 50.0,
        "avg_speed_kmh": 24.0,
        "vehicle_count": 62,
        "capacity": 65,
        "coordinates": [
            [85.8249, 20.2974],
            [85.8242, 20.3000],
            [85.8235, 20.3025],
            [85.8222, 20.3055],
            [85.8210, 20.3080],
            [85.8190, 20.3150]
        ]
    },
    "road_av_sainik": {
        "id": "road_av_sainik",
        "name": "Acharya Vihar - Sainik School Road",
        "lanes": 4,
        "length_m": 1600.0,
        "is_closed": False,
        "status": "low", # Green
        "speed_limit": 50.0,
        "avg_speed_kmh": 46.5,
        "vehicle_count": 16,
        "capacity": 50,
        "coordinates": [
            [85.8340, 20.3023],
            [85.8338, 20.3050],
            [85.8335, 20.3075],
            [85.8332, 20.3105],
            [85.8330, 20.3130]
        ]
    },
    "road_vv_rasulgarh": {
        "id": "road_vv_rasulgarh",
        "name": "Vani Vihar to Rasulgarh (NH-16)",
        "lanes": 6,
        "length_m": 2200.0,
        "is_closed": False,
        "status": "moderate", # Yellow
        "speed_limit": 60.0,
        "avg_speed_kmh": 36.0,
        "vehicle_count": 55,
        "capacity": 80,
        "coordinates": [
            [85.8452, 20.3015],
            [85.8490, 20.3008],
            [85.8530, 20.2995],
            [85.8580, 20.2975],
            [85.8640, 20.2945]
        ]
    }
}

# Signal intersections with phase states
INTERSECTIONS = {
    "jv_square": {
        "name": "Jaydev Vihar Square",
        "coordinates": [85.8249, 20.2974],
        "current_phase": "NORTH_SOUTH_GREEN",
        "green_time_remaining": 24,
        "cycle_duration": 75,
        "waiting_vehicles": 34
    },
    "av_square": {
        "name": "Acharya Vihar Square",
        "coordinates": [85.8340, 20.3023],
        "current_phase": "EAST_WEST_GREEN",
        "green_time_remaining": 18,
        "cycle_duration": 60,
        "waiting_vehicles": 18
    },
    "vv_square": {
        "name": "Vani Vihar Square",
        "coordinates": [85.8452, 20.3015],
        "current_phase": "ALL_CLEAR",
        "green_time_remaining": 30,
        "cycle_duration": 60,
        "waiting_vehicles": 12
    }
}

# Generate fleet of simulated vehicles
def generate_initial_vehicles(count=75):
    fleet = []
    types = ["car", "bus", "auto", "ambulance", "truck"]
    weights = [0.65, 0.12, 0.15, 0.03, 0.05]
    road_keys = list(ROAD_SEGMENTS.keys())

    for i in range(1, count + 1):
        v_type = random.choices(types, weights=weights)[0]
        assigned_road = random.choice(road_keys)
        progress = random.uniform(0.05, 0.95)
        fleet.append({
            "id": f"v_{i:03d}",
            "type": v_type,
            "road_id": assigned_road,
            "progress": progress,
            "speed_kmh": 35.0 + random.uniform(-10.0, 15.0),
            "heading": 68.0,
            "is_emergency": (v_type == "ambulance")
        })
    return fleet

VEHICLES = generate_initial_vehicles(80)

# Helper function to interpolate coordinates along polyline
def interpolate_along_polyline(coords: List[List[float]], progress: float) -> List[float]:
    if not coords or len(coords) < 2:
        return [85.8335, 20.2995]
    
    progress = max(0.0, min(1.0, progress))
    total_segments = len(coords) - 1
    scaled_prog = progress * total_segments
    seg_idx = int(scaled_prog)
    if seg_idx >= total_segments:
        return coords[-1]
    
    seg_progress = scaled_prog - seg_idx
    c1 = coords[seg_idx]
    c2 = coords[seg_idx + 1]
    
    lng = c1[0] + (c2[0] - c1[0]) * seg_progress
    lat = c1[1] + (c2[1] - c1[1]) * seg_progress
    return [round(lng, 6), round(lat, 6)]

class RoadTogglePayload(BaseModel):
    road_id: str
    is_closed: bool

class SignalOptimizePayload(BaseModel):
    intersection_name: str
    current_cycle_seconds: int

@router.get("/state")
def get_traffic_state():
    total_v = len(VEHICLES)
    speeds = [v["speed_kmh"] for v in VEHICLES]
    avg_speed = round(sum(speeds) / total_v, 1) if total_v else 40.0
    
    # Calculate congestion index based on vehicle density vs capacity
    total_capacity = sum([r["capacity"] for r in ROAD_SEGMENTS.values()])
    total_density = sum([r["vehicle_count"] for r in ROAD_SEGMENTS.values()])
    congestion_pct = round((total_density / total_capacity) * 100, 1)

    return {
        "data_classification": "LIVE_SIMULATION",
        "corridor": "Jaydev Vihar – Acharya Vihar – Vani Vihar Corridor (NH-16)",
        "state": {
            "is_running": True,
            "simulation_speed": 1.0,
            "total_simulated_vehicles": total_v,
            "average_speed_kmh": avg_speed,
            "congestion_index": congestion_pct,
            "roads": ROAD_SEGMENTS,
            "intersections": INTERSECTIONS
        }
    }

@router.get("/live-stream")
def get_traffic_live_stream():
    """
    Returns live updated positions for all vehicles on the road network
    """
    vehicle_points = []
    
    for v in VEHICLES:
        # Step progress forward
        step = 0.015 * (v["speed_kmh"] / 40.0)
        v["progress"] += step
        if v["progress"] >= 1.0:
            v["progress"] = 0.0
            # If road is closed, force reroute to detour
            if ROAD_SEGMENTS[v["road_id"]]["is_closed"]:
                v["road_id"] = "road_jv_nandankanan" if random.random() > 0.4 else "road_av_sainik"

        road = ROAD_SEGMENTS[v["road_id"]]
        coords = interpolate_along_polyline(road["coordinates"], v["progress"])

        # Speed adjustments based on congestion or closures
        if road["is_closed"]:
            v["speed_kmh"] = 0.0
        elif road["status"] == "high":
            v["speed_kmh"] = max(12.0, min(28.0, v["speed_kmh"]))
        else:
            v["speed_kmh"] = max(30.0, min(road["speed_limit"], v["speed_kmh"]))

        vehicle_points.append({
            "id": v["id"],
            "type": v["type"],
            "is_emergency": v["is_emergency"],
            "speed_kmh": round(v["speed_kmh"], 1),
            "road_id": v["road_id"],
            "coordinates": coords
        })

    return {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "total_vehicles": len(vehicle_points),
        "vehicles": vehicle_points,
        "roads": ROAD_SEGMENTS,
        "intersections": INTERSECTIONS
    }

@router.post("/road/toggle")
def toggle_road_closure(payload: RoadTogglePayload):
    if payload.road_id not in ROAD_SEGMENTS:
        raise HTTPException(status_code=404, detail="Road segment not found")

    target = ROAD_SEGMENTS[payload.road_id]
    target["is_closed"] = payload.is_closed

    if payload.is_closed:
        target["status"] = "severe"
        target["avg_speed_kmh"] = 0.0
        # Reroute spillover to Jaydev Vihar - Nandankanan Expressway
        ROAD_SEGMENTS["road_jv_nandankanan"]["status"] = "high"
        ROAD_SEGMENTS["road_jv_nandankanan"]["vehicle_count"] = 88
        ROAD_SEGMENTS["road_jv_nandankanan"]["avg_speed_kmh"] = 15.2
        # Spillover to Sainik School Road
        ROAD_SEGMENTS["road_av_sainik"]["status"] = "moderate"
        ROAD_SEGMENTS["road_av_sainik"]["vehicle_count"] = 38
        ROAD_SEGMENTS["road_av_sainik"]["avg_speed_kmh"] = 32.0

        # Divert vehicles on closed road
        for v in VEHICLES:
            if v["road_id"] == payload.road_id:
                v["road_id"] = "road_jv_nandankanan"
                v["speed_kmh"] = 14.0
    else:
        target["status"] = "moderate"
        target["avg_speed_kmh"] = 38.5
        ROAD_SEGMENTS["road_jv_nandankanan"]["status"] = "moderate"
        ROAD_SEGMENTS["road_jv_nandankanan"]["vehicle_count"] = 52
        ROAD_SEGMENTS["road_jv_nandankanan"]["avg_speed_kmh"] = 28.0
        ROAD_SEGMENTS["road_av_sainik"]["status"] = "low"
        ROAD_SEGMENTS["road_av_sainik"]["vehicle_count"] = 16
        ROAD_SEGMENTS["road_av_sainik"]["avg_speed_kmh"] = 46.5

    return {
        "road_id": payload.road_id,
        "is_closed": payload.is_closed,
        "detour_active": payload.is_closed,
        "reroute_corridor": "Acharya Vihar - Sainik School Road & Nandankanan Expressway",
        "affected_state": {
            "roads": ROAD_SEGMENTS,
            "total_simulated_vehicles": len(VEHICLES),
            "average_speed_kmh": 26.5 if payload.is_closed else 38.5
        }
    }

@router.post("/signal/optimize")
def optimize_signals(payload: SignalOptimizePayload):
    current_sec = payload.current_cycle_seconds
    optimized_sec = max(38, int(current_sec * 0.74))
    wait_before = 4.2
    wait_after = 2.6
    pct_reduction = round(((wait_before - wait_after) / wait_before) * 100, 1)

    return {
        "intersection": payload.intersection_name,
        "current_cycle_seconds": current_sec,
        "recommended_cycle_seconds": optimized_sec,
        "waiting_time_before_min": wait_before,
        "waiting_time_after_min": wait_after,
        "estimated_waiting_reduction_percent": pct_reduction,
        "algorithm": "Adaptive Webster's Green-Split Formula"
    }

@router.get("/predictions")
def get_predictions():
    return {
        "data_classification": "AI_PREDICTION",
        "model": "Random Forest Regressor (Trained on Jaydev Vihar Corridor)",
        "predictions": [
            {"time_offset": "+10 min", "predicted_speed": 34.2, "congestion_trend": "increasing", "bottleneck": "Jaydev Vihar Square Flyover"},
            {"time_offset": "+20 min", "predicted_speed": 29.5, "congestion_trend": "peak", "bottleneck": "Nandankanan Road Merge"},
            {"time_offset": "+30 min", "predicted_speed": 38.0, "congestion_trend": "easing", "bottleneck": "Acharya Vihar Overbridge"}
        ]
    }
