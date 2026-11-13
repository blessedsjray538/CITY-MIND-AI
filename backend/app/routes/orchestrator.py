from fastapi import APIRouter, BackgroundTasks
from typing import Dict, Any, List
from backend.app.orchestrator.engine import (
    ORCHESTRATOR_STATE, 
    execute_web_cross_verification, 
    synthesize_orchestrator_decision
)

router = APIRouter(prefix="/orchestrator", tags=["Autonomous In-House Orchestrator"])

@router.get("/status")
def get_orchestrator_status():
    """
    Returns current health, verification cadence, and state of the in-house orchestrator.
    """
    synthesize_orchestrator_decision()
    return {
        "status": ORCHESTRATOR_STATE["engine_status"],
        "mode": ORCHESTRATOR_STATE["mode"],
        "verification_cadence_minutes": ORCHESTRATOR_STATE["verification_cadence_minutes"],
        "last_cross_verification": ORCHESTRATOR_STATE["last_cross_verification"],
        "next_cross_verification": ORCHESTRATOR_STATE["next_cross_verification"],
        "total_cycles_executed": ORCHESTRATOR_STATE["total_cycles_executed"],
        "verification_confidence": ORCHESTRATOR_STATE["verification_confidence"],
        "active_department_states": ORCHESTRATOR_STATE["active_department_states"],
        "latest_decisions": ORCHESTRATOR_STATE["latest_decisions"],
        "recent_verification_logs": ORCHESTRATOR_STATE["web_verification_log"][:5]
    }

@router.post("/verify-now")
async def trigger_immediate_web_cross_verification():
    """
    Triggers an immediate on-demand web cross-verification cycle against live web sources.
    """
    result = await execute_web_cross_verification()
    decisions = synthesize_orchestrator_decision()
    return {
        "message": "Web cross-verification cycle executed successfully.",
        "cycle_details": result,
        "decisions_synthesized": decisions,
        "updated_confidence": ORCHESTRATOR_STATE["verification_confidence"]
    }

@router.get("/decisions")
def get_orchestrator_decisions():
    """
    Returns real-time autonomous operational decisions across departments.
    """
    decisions = synthesize_orchestrator_decision()
    return {
        "count": len(decisions),
        "decisions": decisions
    }

@router.post("/cadence")
def update_cadence(cadence_minutes: int):
    """
    Configure verification cadence (e.g. 60 for 1 hour, 120 for 2 hours).
    """
    if cadence_minutes < 5:
        cadence_minutes = 5
    ORCHESTRATOR_STATE["verification_cadence_minutes"] = cadence_minutes
    return {
        "message": f"Verification cadence updated to every {cadence_minutes} minutes.",
        "cadence_minutes": cadence_minutes
    }
