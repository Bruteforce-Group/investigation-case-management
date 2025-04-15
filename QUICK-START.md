# Case Management System - Quick Start Guide

This guide provides the fastest way to get the Case Management System up and running with Docker and local LLM support.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- 8GB+ RAM recommended (4GB minimum)
- NVIDIA GPU (optional but recommended for better LLM performance)

## Quick Installation (5 Minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/case-management-system.git
cd case-management-system
```

### 2. One-Command Setup

Run the all-in-one setup script:

```bash
./quick-setup.sh
```

This script will:
- Create the necessary environment file
- Set up volume directories
- Build and start all containers
- Run basic tests to verify the deployment

### 3. Access the System

Open your browser and navigate to:
```
http://localhost
```

Default login credentials:
- Email: admin@example.com
- Password: admin123

## LLM Configuration

The system comes pre-configured to use the local Ollama LLM service with the `llama2` model.

To switch to a cloud provider:
1. Go to Settings > LLM Configuration
2. Select your preferred provider (OpenAI or Anthropic)
3. Enter your API key
4. Save settings

## Basic Usage

### Creating a Case
1. Click "Create New Case" on the dashboard
2. Enter case details and description
3. Click "Create"

### Adding Evidence
1. Open a case
2. Click "Add Evidence"
3. Select evidence type and upload files
4. Fill in details and click "Add"

### Viewing Timeline
1. Open a case
2. Click the "Timeline" tab
3. View evidence organized chronologically

### Using AI Analysis
1. Open a case
2. Click the "Analysis" tab
3. View AI-generated insights about your case

## Common Commands

```bash
# Start the system
docker-compose up -d

# Stop the system
docker-compose down

# View logs
docker-compose logs

# Monitor performance
./monitor-performance.sh

# Optimize containers
./optimize-containers.sh
```

## Troubleshooting

### System Not Starting
Check if Docker is running and you have sufficient resources:
```bash
docker info
./test-local-deployment.sh
```

### LLM Not Working
Verify Ollama is running and the model is available:
```bash
docker-compose logs ollama
docker-compose exec ollama ollama list
```

### Performance Issues
Run the optimization script:
```bash
./optimize-containers.sh
```

## Next Steps

For more detailed information, refer to:
- [Docker Deployment Guide](./docs/docker-deployment-guide.md)
- [User Guide](./docs/user-guide.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Getting Help

If you encounter any issues, check the troubleshooting section in the full documentation or run the test script:
```bash
./test-local-deployment.sh
```
