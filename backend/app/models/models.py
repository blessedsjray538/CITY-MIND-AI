from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime
from backend.app.database.connection import Base

class WasteIncident(Base):
    __tablename__ = "waste_incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    location_name = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    category = Column(String(50), default="household") # household, plastic, illegal_dumping, etc.
    priority = Column(String(20), default="medium") # low, medium, high, critical
    status = Column(String(20), default="REPORTED") # REPORTED (RED) or CLEANED (GREEN)
    reported_by = Column(String(100), default="City Sanitation Worker")
    reported_at = Column(DateTime, default=datetime.utcnow)
    cleaned_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)

class TrafficRoad(Base):
    __tablename__ = "traffic_roads"

    id = Column(Integer, primary_key=True, index=True)
    road_id = Column(String(50), unique=True, index=True)
    name = Column(String(200), nullable=False)
    corridor = Column(String(100), default="Jaydev Vihar - Vani Vihar")
    length_m = Column(Float, default=1200.0)
    lanes = Column(Integer, default=3)
    max_speed_kmh = Column(Float, default=60.0)
    current_speed_kmh = Column(Float, default=45.0)
    congestion_level = Column(String(20), default="low") # low, moderate, high, severe
    is_closed = Column(Boolean, default=False)
    vehicle_count = Column(Integer, default=45)
    last_updated = Column(DateTime, default=datetime.utcnow)

class HistoricalDisaster(Base):
    __tablename__ = "historical_disasters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    year = Column(Integer, nullable=False)
    disaster_type = Column(String(50), default="Cyclone")
    max_wind_kmh = Column(Float, nullable=True)
    central_pressure_hpa = Column(Float, nullable=True)
    landfall_location = Column(String(200), nullable=True)
    affected_districts = Column(Text, nullable=True)
    casualties = Column(String(100), nullable=True)
    source = Column(String(200), default="IMD / OSDMA Official Records")
    description = Column(Text, nullable=False)
    lessons_learned = Column(Text, nullable=True)

class WeatherAlertRecord(Base):
    __tablename__ = "weather_alerts"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(200), nullable=False)
    severity = Column(String(50), default="Advisory") # Advisory, Watch, Warning, Severe
    disaster_type = Column(String(50), default="Cyclone")
    affected_areas = Column(String(300), default="Bhubaneswar, Khordha, Cuttack")
    wind_speed_kmh = Column(Float, default=0.0)
    rainfall_forecast_mm = Column(Float, default=0.0)
    source = Column(String(200), default="India Meteorological Department (IMD)")
    description = Column(Text, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
