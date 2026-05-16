# DWRM (Dynamic Workload Routing Middleware)

**An AI-driven orchestration layer that safely classifies and routes compute workloads to CPU, GPU, or quantum backends at runtime.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

### The Business Problem: Tool Space Interference
As enterprises scale autonomous agents, they hit a critical bottleneck: packing too many tools (CRM, billing, DB access) into a single LLM context window drastically reduces routing accuracy and causes silent failures during handoffs. 

**DWRM solves this.** It acts as the zero-trust traffic cop. Instead of building monolithic agents, DWRM allows developers to build hyper-narrow micro-agents. The middleware sits at the edge, ingests the workload, manages the state, and routes the request to the correct localized compute backend without dropping context.

> 🛡️ **IP Notice:** The core hybrid routing methodology demonstrated in this repository is currently under a 10-claim USPTO patent application.

---

### System Architecture

```mermaid
graph TD
    A[Client Request / React Frontend] -->|Stateful Handoff| B(FastAPI Orchestrator)
    B --> C{Workload Classifier}
    C -->|Standard Logic| D[CPU Backend Worker]
    C -->|Heavy Compute/LLM| E[GPU Backend Worker]
    C -->|Optimization| F[Quantum/SQA Backend]
    D --> G[Response Verification]
    E --> G
    F --> G
    G -->|Context Retained| B
    B -->|Verified Output| A
