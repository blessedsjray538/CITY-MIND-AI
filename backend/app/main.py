from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.connection import engine, Base
import asyncio
from dotenv import load_dotenv
load_dotenv()
from .routes import (
    map as map_routes,
    traffic as traffic_routes,
    weather as weather_routes,
    disasters as disaster_routes,
    waste as waste_routes,
    environment as env_routes,
    ai as ai_routes,
    analytics as analytics_routes,
    orchestrator as orchestrator_routes
)
from .orchestrator.engine import run_periodic_orchestrator_scheduler

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CITYMIND AI Backend Engine",
    description="Intelligent Digital Twin & Smart City Intelligence Platform for Bhubaneswar, Odisha",
    version="1.0.0"
)

# Start Autonomous In-House Orchestrator Background Scheduler
@app.on_event("startup")
async def start_orchestrator_background_worker():
    asyncio.create_task(run_periodic_orchestrator_scheduler())

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all modular department endpoints under /api
app.include_router(map_routes.router, prefix="/api")
app.include_router(traffic_routes.router, prefix="/api")
app.include_router(weather_routes.router, prefix="/api")
app.include_router(disaster_routes.router, prefix="/api")
app.include_router(waste_routes.router, prefix="/api")
app.include_router(env_routes.router, prefix="/api")
app.include_router(ai_routes.router, prefix="/api")
app.include_router(analytics_routes.router, prefix="/api")
app.include_router(orchestrator_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "platform": "CITYMIND AI",
        "tagline": "Your City. Your Simulation. Smarter Decisions.",
        "primary_location": "Bhubaneswar, Odisha, India",
        "corridor": "Jaydev Vihar – Acharya Vihar – Vani Vihar",
        "status": "ONLINE",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "subsystems": {
            "traffic_engine": "operational",
            "weather_feed": "operational",
            "disaster_intelligence": "operational",
            "waste_management": "operational",
            "environmental_feed": "operational",
            "central_ai_assistant": "operational"
        }
    }
