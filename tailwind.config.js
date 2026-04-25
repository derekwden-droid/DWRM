"""
DWRM — Dynamic Workload Routing Middleware
Vercel serverless entry point (Mangum ASGI adapter)
"""

import json
import os
import uuid
from datetime import datetime, timezone
from typing import Optional

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="DWRM", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory store  (resets on cold start — fine for demo)
# ---------------------------------------------------------------------------

audit_trail: list[dict] = []

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class WorkloadRequest(BaseModel):
    description: str
    problem_type: Optional[str] = None
    data_size_gb: Optional[float] = None
    time_budget_seconds: Optional[float] = None
    cost_budget_usd: Optional[float] = None
    priority: Optional[str] = "normal"


class FeedbackRequest(BaseModel):
    decision_id: str
    actual_backend: str
    execution_time_seconds: float
    success: bool
    notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Cost model  (simulated)
# ---------------------------------------------------------------------------

COSTS = {
    "quantum": 0.00075,   # per shot
    "gpu":     2.80,      # per hour
    "cpu":     0.096,     # per hour
}

QUANTUM_TYPES = {
    "factoring", "optimization", "quantum_simulation",
    "combinatorics", "cryptography", "monte_carlo", "sampling",
}

GPU_TYPES = {
    "ml_training", "deep_learning", "computer_vision",
    "nlp", "matrix_multiplication", "signal_processing",
}


# ---------------------------------------------------------------------------
# Classification  (Claude)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are a compute workload classifier. Analyze the workload
and return ONLY a valid JSON object — no prose, no markdown.

Schema:
{
  "problem_type": string,
  "quantum_advantage_score": integer (0-100),
  "parallelism_score": integer (0-100),
  "data_intensity_score": integer (0-100),
  "classical_complexity": string,
  "estimated_speedup_x": number,
  "recommended_backend": "cpu" | "gpu" | "quantum",
  "confidence": integer (0-100),
  "reasoning": string
}

Quantum advantage is HIGH for: factoring, unstructured search, quantum chemistry,
combinatorial optimisation, sampling problems.
GPU advantage is HIGH for: matrix ops, ML training, parallel simulation.
CPU is best for: sequential logic, small data, I/O-bound tasks."""


def classify(workload: WorkloadRequest) -> dict:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_msg = (
        f"Description: {workload.description}\n"
        f"Problem type hint: {workload.problem_type or 'not specified'}\n"
        f"Data size: {workload.data_size_gb or 'not specified'} GB\n"
        f"Time budget: {workload.time_budget_seconds or 'not specified'} s\n"
        f"Cost budget: ${workload.cost_budget_usd or 'not specified'}\n"
        f"Priority: {workload.priority}"
    )

    msg = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )

    text = msg.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


# ---------------------------------------------------------------------------
# Routing logic
# ---------------------------------------------------------------------------

def route(classification: dict, workload: WorkloadRequest) -> tuple[str, float, bool, str]:
    """Returns (backend, estimated_cost, fallback_applied, fallback_reason)."""
    qa   = classification.get("quantum_advantage_score", 0)
    par  = classification.get("parallelism_score", 0)
    ptype = classification.get("problem_type", "").lower()
    gb   = workload.data_size_gb or 1.0
    budget = workload.cost_budget_usd

    # Quantum path
    if qa >= 65 and (ptype in QUANTUM_TYPES or qa >= 80):
        shots = 1024 * max(1.0, gb)
        cost  = round(shots * COSTS["quantum"], 5)
        if budget and cost > budget:
            fallback_cost = round(max(gb / 8, 0.1) * COSTS["gpu"], 5)
            return "gpu", fallback_cost, True, (
                f"Quantum cost ${cost:.4f} exceeded budget ${budget:.2f}"
            )
        return "quantum", cost, False, ""

    # GPU path
    if par >= 55 or gb >= 4 or ptype in GPU_TYPES:
        cost = round(max(gb / 8, 0.1) * COSTS["gpu"], 5)
        if budget and cost > budget:
            fallback_cost = round(max(gb / 2, 0.05) * COSTS["cpu"], 5)
            return "cpu", fallback_cost, True, (
                f"GPU cost ${cost:.4f} exceeded budget ${budget:.2f}"
            )
        return "gpu", cost, False, ""

    # CPU path
    cost = round(max(gb / 2, 0.05) * COSTS["cpu"], 5)
    return "cpu", cost, False, ""


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "version": "1.0.0",
        "decisions": len(audit_trail),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/route")
def route_workload(workload: WorkloadRequest):
    if not workload.description or len(workload.description.strip()) < 5:
        raise HTTPException(status_code=422, detail="Description too short.")

    try:
        classification = classify(workload)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f"Parse error: {exc}") from exc
    except anthropic.APIError as exc:
        raise HTTPException(status_code=502, detail=f"AI error: {exc}") from exc

    backend, cost, fallback, fallback_reason = route(classification, workload)

    decision = {
        "id": str(uuid.uuid4())[:8].upper(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "workload": workload.model_dump(),
        "classification": classification,
        "routing_decision": backend,
        "quantum_advantage_score": classification.get("quantum_advantage_score", 0),
        "parallelism_score": classification.get("parallelism_score", 0),
        "estimated_cost_usd": cost,
        "reasoning": classification.get("reasoning", ""),
        "fallback_applied": fallback,
        "fallback_reason": fallback_reason,
        "confidence": classification.get("confidence", 0),
    }

    audit_trail.append(decision)
    if len(audit_trail) > 200:
        audit_trail.pop(0)

    return decision


@app.get("/api/history")
def history(limit: int = 50):
    return {
        "decisions": list(reversed(audit_trail[-limit:])),
        "total": len(audit_trail),
    }


@app.get("/api/metrics")
def metrics():
    if not audit_trail:
        return {
            "total": 0,
            "distribution": {"cpu": {"count": 0, "pct": 0}, "gpu": {"count": 0, "pct": 0}, "quantum": {"count": 0, "pct": 0}},
            "avg_qa_score": 0,
            "avg_cost": 0,
            "fallback_rate": 0,
        }

    total = len(audit_trail)
    counts = {"cpu": 0, "gpu": 0, "quantum": 0}
    fallbacks = 0
    qa_total = 0
    cost_total = 0.0

    for d in audit_trail:
        b = d.get("routing_decision", "cpu")
        counts[b] = counts.get(b, 0) + 1
        if d.get("fallback_applied"):
            fallbacks += 1
        qa_total += d.get("quantum_advantage_score", 0)
        cost_total += d.get("estimated_cost_usd", 0)

    return {
        "total": total,
        "distribution": {
            k: {"count": v, "pct": round(v / total * 100, 1)}
            for k, v in counts.items()
        },
        "avg_qa_score": round(qa_total / total, 1),
        "avg_cost": round(cost_total / total, 6),
        "fallback_rate": round(fallbacks / total * 100, 1),
    }


@app.post("/api/feedback")
def feedback(body: FeedbackRequest):
    return {"status": "recorded", "id": str(uuid.uuid4())[:8].upper()}


# ---------------------------------------------------------------------------
# Vercel handler
# ---------------------------------------------------------------------------

handler = Mangum(app, lifespan="off")
