# Docker Deployment Guide for Case Management System

This guide provides detailed instructions for deploying the Case Management System using Docker containers with local LLM integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Starting the System](#starting-the-system)
6. [Accessing the Application](#accessing-the-application)
7. [LLM Configuration](#llm-configuration)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Backup and Restore](#backup-and-restore)

## Prerequisites

Before deploying the Case Management System, ensure you have the following prerequisites installed:

- **Docker Engine**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher
- **Git**: For cloning the repository
- **Bash**: For running the setup scripts
- **curl**: For testing API endpoints

For GPU acceleration (optional but recommended for LLM performance):
- **NVIDIA GPU**: With CUDA support
- **NVIDIA Container Toolkit**: For GPU passthrough to containers

## System Requirements

Minimum requirements:
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 20GB free space
- **Network**: Internet connection for initial setup

Recommended requirements:
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 50GB+ SSD
- **GPU**: NVIDIA GPU with 8GB+ VRAM
- **Network**: Stable internet connection

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/case-management-system.git
cd case-management-system
```

### 2. Set Up Environment

Create the environment file from the example:

```bash
cp docker/.env.example .env
```

Edit the `.env` file to configure your environment variables:

```bash
# Use your favorite text editor
nano .env
```

### 3. Set Up Volumes

Run the volume setup script to create the necessary directories:

```bash
chmod +x docker/setup-volumes.sh
./docker/setup-volumes.sh
```

### 4. Build and Start Containers

Build and start the Docker containers:

```bash
docker-compose up -d
```

This will start all the required services:
- Frontend (React)
- Backend (Node.js)
- PostgreSQL with pgvector
- Ollama (Local LLM)
- Nginx (Routing)

### 5. Test the Deployment

Run the test script to verify the deployment:

```bash
chmod +x test-local-deployment.sh
./test-local-deployment.sh
```

### 6. Optimize Performance (Optional)

For better performance, run the optimization script:

```bash
chmod +x optimize-containers.sh
./optimize-containers.sh
```

Then restart the containers to apply the optimizations:

```bash
docker-compose down
docker-compose up -d
```

## Configuration

### Environment Variables

The main configuration is done through the `.env` file. Here are the key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/case_management` |
| `JWT_SECRET` | Secret for JWT tokens | `your_secure_jwt_secret_change_in_production` |
| `LOCAL_LLM_URL` | URL for local LLM service | `http://ollama:11434` |
| `DEFAULT_LOCAL_MODEL` | Default model for local LLM | `llama2` |

### Nginx Configuration

The Nginx configuration is located at `docker/nginx/nginx.conf`. You can modify this file to change routing rules, SSL settings, or other web server configurations.

### PostgreSQL Configuration

PostgreSQL is initialized with the script at `docker/postgres/init.sql`. This script creates the database schema and enables the pgvector extension.

## Starting the System

### Starting All Services

```bash
docker-compose up -d
```

### Stopping All Services

```bash
docker-compose down
```

### Restarting a Specific Service

```bash
docker-compose restart [service_name]
```

Where `[service_name]` can be one of: `frontend`, `backend`, `postgres`, `ollama`, or `nginx`.

### Viewing Logs

```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs [service_name]

# Follow logs in real-time
docker-compose logs -f [service_name]
```

## Accessing the Application

Once the system is running, you can access it through your web browser:

- **Web Interface**: http://localhost
- **API Endpoint**: http://localhost/api
- **Health Check**: http://localhost/health

Default admin credentials:
- **Email**: admin@example.com
- **Password**: admin123

**Important**: Change the default admin password immediately after first login.

## LLM Configuration

### Configuring LLM Providers

The system supports three LLM providers:

1. **Local LLM** (Ollama): Runs locally within the Docker environment
2. **OpenAI**: Requires an API key
3. **Anthropic**: Requires an API key

You can configure these providers through the web interface:

1. Log in to the system
2. Navigate to Settings > LLM Configuration
3. Select your preferred provider
4. Enter API keys if using OpenAI or Anthropic
5. Save settings

### Managing Local LLM Models

By default, the system uses the `llama2` model with Ollama. You can manage models through the Ollama API:

```bash
# List available models
docker-compose exec ollama ollama list

# Pull a new model
docker-compose exec ollama ollama pull [model_name]

# Remove a model
docker-compose exec ollama ollama rm [model_name]
```

Popular models to consider:
- `llama2`: Good balance of performance and resource usage
- `mistral`: Excellent performance for lower resource usage
- `orca-mini`: Very lightweight option for limited hardware

## Maintenance

### Monitoring Performance

Use the monitoring script to check system performance:

```bash
chmod +x monitor-performance.sh
./monitor-performance.sh
```

### Updating the System

To update the system to the latest version:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Clearing Cache

To clear the LLM cache:

```bash
rm -rf ./volumes/llm-cache/*
```

## Troubleshooting

### Common Issues

#### Container Fails to Start

Check the logs for the specific container:

```bash
docker-compose logs [service_name]
```

#### Database Connection Issues

Verify the PostgreSQL container is running:

```bash
docker-compose ps postgres
```

Check the database logs:

```bash
docker-compose logs postgres
```

#### Local LLM Not Working

Check if Ollama is running:

```bash
docker-compose ps ollama
```

Verify the model is available:

```bash
docker-compose exec ollama ollama list
```

Try pulling the model again:

```bash
docker-compose exec ollama ollama pull llama2
```

#### Out of Memory Errors

If you encounter out of memory errors, adjust the resource limits in `docker-compose.override.yml`:

```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 4G  # Reduce this value
```

### Resetting the System

To completely reset the system:

```bash
# Stop all containers
docker-compose down

# Remove volumes
docker volume rm case-management-system_postgres-data case-management-system_evidence-files case-management-system_llm-cache case-management-system_ollama-models

# Set up volumes again
./docker/setup-volumes.sh

# Start containers
docker-compose up -d
```

## Backup and Restore

### Backing Up Data

To back up the system data:

```bash
# Create backup directory
mkdir -p backups

# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U postgres case_management > backups/database_backup_$(date +%Y%m%d).sql

# Backup evidence files
tar -czf backups/evidence_backup_$(date +%Y%m%d).tar.gz ./volumes/evidence-files

# Backup LLM models (optional, these can be re-downloaded)
tar -czf backups/models_backup_$(date +%Y%m%d).tar.gz ./volumes/ollama-models
```

### Restoring Data

To restore from backup:

```bash
# Restore PostgreSQL database
cat backups/database_backup_YYYYMMDD.sql | docker-compose exec -T postgres psql -U postgres case_management

# Restore evidence files
tar -xzf backups/evidence_backup_YYYYMMDD.tar.gz -C ./

# Restart containers
docker-compose restart
```
