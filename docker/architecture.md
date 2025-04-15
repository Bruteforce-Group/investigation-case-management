# Docker Compose Architecture for Case Management System

## Overview

This document outlines the Docker Compose architecture for the Case Management System with local LLM integration. The system is designed to run entirely on a local machine using Docker containers, with options to use either a local LLM or cloud-based providers (OpenAI/Anthropic) when API keys are provided.

## Container Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Network                           │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │   Frontend  │     │   Backend   │     │  Database   │        │
│  │  Container  │     │  Container  │     │  Container  │        │
│  │   (React)   │     │  (Node.js)  │     │ (PostgreSQL)│        │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘        │
│         │                   │                   │               │
│         │                   │                   │               │
│  ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐        │
│  │    Nginx    │     │  Local LLM  │     │   Volume    │        │
│  │  Container  │     │  Container  │     │   Storage   │        │
│  │             │     │  (Ollama)   │     │             │        │
│  └──────┬──────┘     └─────────────┘     └─────────────┘        │
│         │                                                       │
└─────────┼───────────────────────────────────────────────────────┘
          │
    ┌─────┴─────┐
    │   User    │
    │  Access   │
    └───────────┘
```

## Container Specifications

### 1. Frontend Container

- **Base Image**: `node:18-alpine`
- **Exposed Ports**: Internal only
- **Dependencies**: None (served through Nginx)
- **Environment Variables**:
  - `REACT_APP_API_URL`
  - `REACT_APP_SOCKET_URL`
  - `NODE_ENV`
- **Build Process**:
  - Install dependencies
  - Build static files
  - Serve through Nginx

### 2. Backend Container

- **Base Image**: `node:18-alpine`
- **Exposed Ports**: 5000 (internal)
- **Dependencies**: PostgreSQL, Local LLM
- **Environment Variables**:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRE`
  - `LOCAL_LLM_URL`
  - `OPENAI_API_KEY` (optional)
  - `ANTHROPIC_API_KEY` (optional)
  - `NODE_ENV`
  - `PORT`
- **Volumes**:
  - Evidence file storage

### 3. PostgreSQL Container

- **Base Image**: `postgres:15-alpine`
- **Exposed Ports**: 5432 (internal)
- **Extensions**: pgvector
- **Environment Variables**:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
- **Volumes**:
  - PostgreSQL data
  - Initialization scripts

### 4. Local LLM Container

- **Base Image**: `ollama/ollama:latest`
- **Exposed Ports**: 11434 (internal)
- **Models**:
  - Default: `llama2` (or similar lightweight model)
  - Optional: Additional models based on user hardware
- **Volumes**:
  - Model storage
- **Resource Limits**:
  - Configurable based on host capabilities

### 5. Nginx Container

- **Base Image**: `nginx:alpine`
- **Exposed Ports**: 80, 443 (external)
- **Configuration**:
  - Reverse proxy to frontend and backend
  - Static file serving
  - Compression
  - Optional SSL
- **Volumes**:
  - Nginx configuration
  - SSL certificates (optional)

## Network Configuration

- **Internal Network**: All containers communicate on a private Docker network
- **External Access**: Only Nginx container exposes ports to the host
- **Hostname Resolution**: Containers reference each other by service name

## Volume Configuration

### Persistent Volumes

1. **Database Volume**:
   - Path: `./volumes/postgres-data`
   - Purpose: Store PostgreSQL data
   - Backup Strategy: Regular database dumps

2. **Evidence Files Volume**:
   - Path: `./volumes/evidence-files`
   - Purpose: Store uploaded evidence files
   - Organization: Structured by case ID and file type

3. **LLM Models Volume**:
   - Path: `./volumes/llm-models`
   - Purpose: Store downloaded LLM models
   - Persistence: Prevents re-downloading models on restart

### Configuration Volumes

1. **Nginx Configuration**:
   - Path: `./config/nginx`
   - Purpose: Store Nginx configuration files

2. **Database Initialization**:
   - Path: `./config/postgres/init`
   - Purpose: Store database initialization scripts

## Environment Configuration

### Development Environment

- Debug logging enabled
- Hot-reloading for frontend and backend
- Lightweight LLM model

### Production Environment

- Optimized builds
- Minimal logging
- More capable LLM model (if hardware supports)

### Environment Variables Management

- `.env` file for common variables
- Docker Compose environment file for container-specific variables
- Secrets management for sensitive information

## LLM Integration Architecture

### Local LLM Service

- Ollama serving a lightweight model (llama2, mistral, etc.)
- REST API compatible with OpenAI format
- Embedding generation capability

### LLM Provider Selection Logic

```
┌─────────────────┐
│ LLM Request     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ OpenAI API Key  │ Yes │ Use OpenAI API  │
│ Provided?       ├────►│                 │
└────────┬────────┘     └─────────────────┘
         │ No
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Anthropic API   │ Yes │ Use Anthropic   │
│ Key Provided?   ├────►│ API             │
└────────┬────────┘     └─────────────────┘
         │ No
         ▼
┌─────────────────┐
│ Use Local LLM   │
│ (Ollama)        │
└─────────────────┘
```

## Scaling Considerations

### Resource Adaptation

- LLM container configured based on available hardware
- Option to disable local LLM and use only cloud providers on low-resource machines
- Database connection pooling for efficient resource usage

### Performance Optimization

- Frontend static file caching
- Backend response compression
- Database query optimization
- LLM response caching for similar queries

## Security Architecture

### Authentication Flow

- JWT-based authentication
- Secure token storage
- HTTPS for external access (optional for local deployment)

### API Key Management

- Encrypted storage of API keys
- Keys never exposed to frontend
- Option to input keys temporarily (not stored)

## Deployment Workflow

### Initial Setup

1. Clone repository
2. Configure environment variables
3. Run `docker-compose up`
4. Access system through browser

### Updates

1. Pull latest changes
2. Rebuild containers: `docker-compose build`
3. Restart: `docker-compose up -d`

### Backup and Restore

1. Database backup: `docker-compose exec postgres pg_dump`
2. Evidence files backup: Copy volume directory
3. Restore from backups using provided scripts

## Monitoring and Maintenance

### Logs

- Centralized logging
- Log rotation
- Optional log aggregation

### Health Checks

- Container health monitoring
- Database connection verification
- LLM service availability check

## Failure Recovery

### Automatic Restarts

- Containers configured to restart on failure
- Dependent services wait for prerequisites

### Fallback Mechanisms

- LLM service falls back to cloud providers if local service fails
- Database reconnection logic
- File operation retry mechanisms
