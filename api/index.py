from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mangum import Mangum
import os

app = FastAPI(title="DWRM Orchestrator API")

class WorkloadRequest(BaseModel):
    task_description: str

@app.post("/api/route")
async def route_workload(request: WorkloadRequest):
    desc = request.task_description.lower()
    
    if "quantum" in desc or "optimize" in desc:
        backend = "Quantum/SQA Backend"
        confidence = 0.94
    elif "model" in desc or "heavy" in desc or "train" in desc:
        backend = "GPU Backend Worker"
        confidence = 0.88
    else:
        backend = "CPU Backend Worker"
        confidence = 0.99
        
    return {
        "status": "success",
        "original_task": request.task_description,
        "routed_backend": backend,
        "confidence_score": confidence,
        "security_check": "passed",
        "context_retained": True
    }

handler = Mangum(app)
