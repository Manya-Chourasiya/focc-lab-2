# Fundamentals of Cloud Computing - Lab Assignment 2
**Containerizing, Autoscaling and Monitoring a Two-Tier Web Application on Azure Kubernetes Service (AKS)**

## Architecture
- **Frontend**: Node.js (Express) application exposing `/and/api/visit`, `/work?ms=50`, `/healthz`, `/ready`, and `/metrics`.
- **Backend**: Redis (`redis:7-alpine`) deployed as a ClusterIP service.
- **Autoscaling**: Horizontal Pod Autoscaler (HPA) targeting 50% CPU, scaling frontend replicas from 1 to 5.
- **Monitoring**: Azure Monitor, Log Analytics workspace (`focc-law`), and Action Group (`focc-ag`) with metric alert `cpu-over-75`.

## Repository Structure
- `Dockerfile`: Multi-stage build for containerization.
- `server.js`: Application source code.
- `deployment.yaml`: Frontend deployment manifests with resource limits and probes.
- `redis.yaml` / `redis-service.yaml`: Redis deployment and service configuration.
- `hpa.yaml`: Horizontal Pod Autoscaler configuration.
- `loadtest.py`: Python-based concurrent load testing script.
