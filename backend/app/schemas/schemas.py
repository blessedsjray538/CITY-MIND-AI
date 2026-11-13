from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class WasteIncidentCreate(BaseModel):
    title: str = Field(..., example="Illegal plastic dumping near Jaydev Vihar flyover")
    location_name: str = Field(..., example="Jaydev Vihar Square")
    latitude: float = Field(..., example=20.2974)
    longitude: float = Field(..., example=85.8249)
    category: str = Field("plastic", example="plastic")
    priority: str = Field("high", example="high")
    notes: Optional[str] = None
    photo_url: Optional[str] = None

class WasteIncidentResponse(BaseModel):
    id: int
    title: str
    location_name: str
    latitude: float
    longitude: float
    category: str
    priority: str
    status: str
    reported_by: str
    reported_at: datetime
    cleaned_at: Optional[datetime] = None
    notes: Optional[str] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True

class RoadStatus(BaseModel):
    id: int
    road_id: str
    name: str
    corridor: str
    length_m: float
    lanes: int
    max_speed_kmh: float
    current_speed_kmh: float
    congestion_level: str
    is_closed: bool
    vehicle_count: int
    last_updated: datetime

    class Config:
        from_attributes = True

class RoadToggleRequest(BaseModel):
    road_id: str
    is_closed: bool

class SignalOptimizeRequest(BaseModel):
    intersection_name: str
    current_green_time: int
    vehicle_queue_length: int

class AIChatRequest(BaseModel):
    query: str
    department_context: Optional[str] = "Overview"
    selected_entity_id: Optional[str] = None
    map_coordinates: Optional[List[float]] = None
    api_key: Optional[str] = None

class AIChatResponse(BaseModel):
    answer: str
    confidence: float
    source: str
    data_classification: str # VERIFIED_REAL, LIVE_SIMULATION, AI_ESTIMATE, HISTORICAL_RECORD
    subsystem_used: str
    context_tags: List[str]
    suggested_actions: Optional[List[str]] = None
