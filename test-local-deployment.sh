#!/bin/bash
# Script to test the local deployment of the Case Management System

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting local deployment test...${NC}"

# Check if Docker is installed
echo -e "\n${YELLOW}Checking if Docker is installed...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker is installed.${NC}"
    docker --version
fi

# Check if Docker Compose is installed
echo -e "\n${YELLOW}Checking if Docker Compose is installed...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker Compose is installed.${NC}"
    docker-compose --version
fi

# Check if .env file exists, if not create from example
echo -e "\n${YELLOW}Checking for .env file...${NC}"
if [ ! -f ./.env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp ./docker/.env.example ./.env
    echo -e "${GREEN}.env file created. Please review and update the values as needed.${NC}"
else
    echo -e "${GREEN}.env file already exists.${NC}"
fi

# Setup volume directories
echo -e "\n${YELLOW}Setting up volume directories...${NC}"
if [ -f ./docker/setup-volumes.sh ]; then
    chmod +x ./docker/setup-volumes.sh
    ./docker/setup-volumes.sh
else
    echo -e "${RED}Volume setup script not found.${NC}"
    exit 1
fi

# Check if Ollama is available locally (for GPU passthrough)
echo -e "\n${YELLOW}Checking if Ollama is installed locally...${NC}"
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}Ollama is installed locally. Will use GPU passthrough if available.${NC}"
    
    # Check if the required model is available
    echo -e "\n${YELLOW}Checking if llama2 model is available...${NC}"
    if ollama list | grep -q "llama2"; then
        echo -e "${GREEN}llama2 model is available.${NC}"
    else
        echo -e "${YELLOW}llama2 model not found. Will be downloaded during container startup.${NC}"
    fi
else
    echo -e "${YELLOW}Ollama is not installed locally. Will use container version.${NC}"
fi

# Check for GPU support
echo -e "\n${YELLOW}Checking for GPU support...${NC}"
if command -v nvidia-smi &> /dev/null; then
    echo -e "${GREEN}NVIDIA GPU detected.${NC}"
    nvidia-smi
    
    # Check if nvidia-docker is installed
    if docker info | grep -q "nvidia"; then
        echo -e "${GREEN}NVIDIA Docker runtime is available.${NC}"
    else
        echo -e "${YELLOW}NVIDIA Docker runtime not detected. GPU acceleration may not work.${NC}"
        echo -e "${YELLOW}Consider installing nvidia-docker: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html${NC}"
    fi
else
    echo -e "${YELLOW}No NVIDIA GPU detected. Will run in CPU-only mode.${NC}"
    
    # Modify docker-compose.yml to remove GPU requirements
    echo -e "${YELLOW}Modifying docker-compose.yml to remove GPU requirements...${NC}"
    sed -i.bak '/driver: nvidia/,+3d' docker-compose.yml
    echo -e "${GREEN}docker-compose.yml modified for CPU-only mode.${NC}"
fi

# Start the containers
echo -e "\n${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d

# Check if containers are running
echo -e "\n${YELLOW}Checking container status...${NC}"
sleep 10
if docker-compose ps | grep -q "Exit"; then
    echo -e "${RED}Some containers failed to start. Checking logs...${NC}"
    docker-compose logs
    exit 1
else
    echo -e "${GREEN}All containers are running.${NC}"
    docker-compose ps
fi

# Test backend API
echo -e "\n${YELLOW}Testing backend API...${NC}"
sleep 5
if curl -s http://localhost/api/health | grep -q "ok"; then
    echo -e "${GREEN}Backend API is responding.${NC}"
else
    echo -e "${RED}Backend API is not responding. Checking logs...${NC}"
    docker-compose logs backend
fi

# Test Ollama API
echo -e "\n${YELLOW}Testing Ollama API...${NC}"
sleep 5
if curl -s http://localhost:11434/api/version | grep -q "version"; then
    echo -e "${GREEN}Ollama API is responding.${NC}"
else
    echo -e "${YELLOW}Ollama API is not directly accessible. This is expected if using internal Docker network.${NC}"
    echo -e "${YELLOW}Testing through backend proxy...${NC}"
    if curl -s http://localhost/api/llm/local/status | grep -q "available"; then
        echo -e "${GREEN}Ollama is accessible through backend proxy.${NC}"
    else
        echo -e "${RED}Ollama is not accessible. Checking logs...${NC}"
        docker-compose logs ollama
    fi
fi

# Test frontend
echo -e "\n${YELLOW}Testing frontend...${NC}"
if curl -s -I http://localhost | grep -q "200 OK"; then
    echo -e "${GREEN}Frontend is accessible.${NC}"
else
    echo -e "${RED}Frontend is not accessible. Checking logs...${NC}"
    docker-compose logs frontend
    docker-compose logs nginx
fi

echo -e "\n${GREEN}Local deployment test completed.${NC}"
echo -e "${GREEN}The Case Management System should be accessible at: http://localhost${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for all services to fully initialize.${NC}"
echo -e "${YELLOW}If you encounter any issues, check the logs with: docker-compose logs${NC}"
