from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/map", tags=["Map"])

# Real coordinates for the Bhubaneswar primary development corridor:
# Jaydev Vihar (20.2974, 85.8249) -> Acharya Vihar (20.3023, 85.8340) -> Vani Vihar (20.3015, 85.8452)
CORRIDOR_CENTER = {"lat": 20.2995, "lng": 85.8335, "zoom": 14.5}

CORRIDOR_LANDMARKS = [
    {"id": "jv_sq", "name": "Jaydev Vihar Square", "type": "major_intersection", "coordinates": [85.8249, 20.2974]},
    {"id": "av_sq", "name": "Acharya Vihar Square", "type": "major_intersection", "coordinates": [85.8340, 20.3023]},
    {"id": "vv_sq", "name": "Vani Vihar Square", "type": "major_intersection", "coordinates": [85.8452, 20.3015]},
    {"id": "pathani_planetarium", "name": "Pathani Samanta Planetarium", "type": "landmark", "coordinates": [85.8306, 20.3010]},
    {"id": "utkal_univ", "name": "Utkal University Campus", "type": "education", "coordinates": [85.8430, 20.3040]},
    {"id": "apollo_hosp", "name": "Apollo Hospitals Bhubaneswar", "type": "healthcare", "coordinates": [85.8205, 20.3075]},
    {"id": "rprc_park", "name": "Regional Plant Resource Centre (Ekamra Kanan)", "type": "park", "coordinates": [85.8150, 20.3020]},
    {"id": "nicco_park", "name": "BDA City Centre / Nicco Park", "type": "civic", "coordinates": [85.8360, 20.2950]},
]

CORRIDOR_ROADS_GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "road_jv_av",
                "name": "Jaydev Vihar to Acharya Vihar (NH-16)",
                "lanes": 6,
                "length_km": 1.4,
                "speed_limit": 60,
                "congestion": "moderate"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [85.8249, 20.2974],
                    [85.8285, 20.2993],
                    [85.8315, 20.3010],
                    [85.8340, 20.3023]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "road_av_vv",
                "name": "Acharya Vihar to Vani Vihar (NH-16)",
                "lanes": 6,
                "length_km": 1.2,
                "speed_limit": 60,
                "congestion": "low"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [85.8340, 20.3023],
                    [85.8385, 20.3020],
                    [85.8420, 20.3018],
                    [85.8452, 20.3015]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "road_jv_nandankanan",
                "name": "Jaydev Vihar - Nandankanan Road (Expressway)",
                "lanes": 4,
                "length_km": 2.1,
                "speed_limit": 50,
                "congestion": "high"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [85.8249, 20.2974],
                    [85.8235, 20.3025],
                    [85.8210, 20.3080],
                    [85.8190, 20.3150]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "road_av_sainik",
                "name": "Acharya Vihar - Sainik School Road",
                "lanes": 4,
                "length_km": 1.8,
                "speed_limit": 50,
                "congestion": "low"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [85.8340, 20.3023],
                    [85.8335, 20.3075],
                    [85.8330, 20.3130]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "road_vv_rasulgarh",
                "name": "Vani Vihar to Rasulgarh (NH-16)",
                "lanes": 6,
                "length_km": 2.4,
                "speed_limit": 60,
                "congestion": "high"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [85.8452, 20.3015],
                    [85.8510, 20.3000],
                    [85.8590, 20.2970],
                    [85.8670, 20.2930]
                ]
            }
        }
    ]
}

@router.get("/corridor")
def get_corridor_info():
    return {
        "city": "Bhubaneswar",
        "state": "Odisha",
        "country": "India",
        "corridor": "Jaydev Vihar – Acharya Vihar – Vani Vihar corridor",
        "center": CORRIDOR_CENTER,
        "landmarks": CORRIDOR_LANDMARKS
    }

@router.get("/network")
def get_corridor_network():
    return CORRIDOR_ROADS_GEOJSON
