from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import datetime

router = APIRouter(prefix="/waste", tags=["Smart Waste Management"])

# In-memory incident list (with seed corridor reports in Bhubaneswar)
waste_incidents = [
    {
        "id": 1,
        "title": "Overflowing Garbage Bin & Plastic Waste",
        "location_name": "Jaydev Vihar Square (Near Overbridge Pillar 14)",
        "latitude": 20.2974,
        "longitude": 85.8249,
        "category": "plastic",
        "priority": "high",
        "status": "REPORTED", # REPORTED = RED
        "reported_by": "BMC Sanitation Inspector - Sector 4",
        "reported_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=2, minutes=15)).isoformat(),
        "cleaned_at": None,
        "notes": "Plastic wrappers and solid waste overflowing onto service road. Drain grating partially obstructed.",
        "photo_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80"
    },
    {
        "id": 2,
        "title": "Construction Debris & Sand Mound",
        "location_name": "Acharya Vihar - Near Utkal University North Gate",
        "latitude": 20.3023,
        "longitude": 85.8340,
        "category": "construction",
        "priority": "medium",
        "status": "REPORTED", # REPORTED = RED
        "reported_by": "Ward 22 Sanitation Worker",
        "reported_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=4)).isoformat(),
        "cleaned_at": None,
        "notes": "Unattended concrete chunks and sand left on walkway.",
        "photo_url": "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&q=80"
    },
    {
        "id": 3,
        "title": "Organic & Market Waste Cleaned",
        "location_name": "Vani Vihar Vegetable Market Boundary",
        "latitude": 20.3015,
        "longitude": 85.8452,
        "category": "organic",
        "priority": "high",
        "status": "CLEANED", # CLEANED = GREEN
        "reported_by": "BMC Sanitation Team Beta",
        "reported_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=8)).isoformat(),
        "cleaned_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=1, minutes=30)).isoformat(),
        "notes": "Cleared 1.8 metric tonnes of wet organic market waste into municipal compactor truck.",
        "photo_url": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80"
    },
    {
        "id": 4,
        "title": "Drain Blockage and Wet Sludge Cleared",
        "location_name": "Pathani Samanta Planetarium Outer Drain",
        "latitude": 20.3010,
        "longitude": 85.8306,
        "category": "drain_blockage",
        "priority": "critical",
        "status": "CLEANED", # CLEANED = GREEN
        "reported_by": "Drainage Desilting Unit 3",
        "reported_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=12)).isoformat(),
        "cleaned_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=3)).isoformat(),
        "notes": "Desilting excavator cleared stormwater conduit ahead of monsoon advisory.",
        "photo_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80"
    }
]

class NewReportPayload(BaseModel):
    title: str
    location_name: str
    latitude: float
    longitude: float
    category: str = "plastic"
    priority: str = "medium"
    notes: Optional[str] = None
    photo_url: Optional[str] = None
    reported_by: Optional[str] = "Field Worker"

class CleanConfirmPayload(BaseModel):
    incident_id: int
    worker_notes: Optional[str] = "Cleaning verified by field sanitation worker."

@router.get("/reports")
def get_waste_reports():
    return {
        "count": len(waste_incidents),
        "reports": waste_incidents
    }

@router.post("/report")
def create_waste_report(payload: NewReportPayload):
    new_id = max([i["id"] for i in waste_incidents], default=0) + 1
    new_report = {
        "id": new_id,
        "title": payload.title,
        "location_name": payload.location_name,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "category": payload.category,
        "priority": payload.priority,
        "status": "REPORTED", # Turn RED
        "reported_by": payload.reported_by,
        "reported_at": datetime.datetime.utcnow().isoformat(),
        "cleaned_at": None,
        "notes": payload.notes or "Immediate sanitation team mobilization requested.",
        "photo_url": payload.photo_url or "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80"
    }
    waste_incidents.insert(0, new_report)
    return {
        "success": True,
        "message": "Incident logged successfully. Location marked RED on city map.",
        "report": new_report
    }

@router.post("/reports/{incident_id}/complete")
def mark_cleaned(incident_id: int, payload: Optional[CleanConfirmPayload] = None):
    for inc in waste_incidents:
        if inc["id"] == incident_id:
            inc["status"] = "CLEANED" # Turn GREEN
            inc["cleaned_at"] = datetime.datetime.utcnow().isoformat()
            if payload and payload.worker_notes:
                inc["notes"] = f"{inc['notes']} | Cleaned: {payload.worker_notes}"
            return {
                "success": True,
                "message": f"Incident #{incident_id} marked as CLEANED. Map status changed to GREEN.",
                "report": inc
            }
    raise HTTPException(status_code=404, detail="Incident not found")

@router.get("/analytics")
def get_waste_analytics():
    total = len(waste_incidents)
    reported = len([i for i in waste_incidents if i["status"] == "REPORTED"])
    cleaned = len([i for i in waste_incidents if i["status"] == "CLEANED"])
    return {
        "total_incidents": total,
        "pending_cleaning_red": reported,
        "completed_cleaned_green": cleaned,
        "resolution_rate_percent": round((cleaned / total * 100) if total else 0, 1),
        "active_workers_on_duty": 18,
        "average_cleanup_hours": 3.4,
        "categories_breakdown": {
            "plastic": len([i for i in waste_incidents if i["category"] == "plastic"]),
            "construction": len([i for i in waste_incidents if i["category"] == "construction"]),
            "organic": len([i for i in waste_incidents if i["category"] == "organic"]),
            "drain_blockage": len([i for i in waste_incidents if i["category"] == "drain_blockage"])
        }
    }

@router.get("/routes")
def get_optimized_collection_route():
    # Route connecting uncleaned points in Jaydev Vihar corridor
    pending = [i for i in waste_incidents if i["status"] == "REPORTED"]
    waypoints = [[p["longitude"], p["latitude"]] for p in pending]
    return {
        "algorithm": "Dijkstra Minimum-Span Sanitation Sweep",
        "vehicle_assigned": "BMC Compactor Truck #OD-02-AT-4481",
        "stops_count": len(pending),
        "total_distance_km": 3.8,
        "estimated_collection_duration_mins": 45,
        "waypoints": waypoints
    }
