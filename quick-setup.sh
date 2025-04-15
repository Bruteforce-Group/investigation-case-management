#!/bin/bash
# Quick setup script for Case Management System

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}    Case Management System - Quick Setup Script    ${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Check if Docker is installed
echo -e "\n${YELLOW}Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Docker is installed${NC}"
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
fi

# Create .env file if it doesn't exist
echo -e "\n${YELLOW}Setting up environment...${NC}"
if [ ! -f ./.env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp ./docker/.env.example ./.env
    echo -e "${GREEN}✓ Environment file created${NC}"
else
    echo -e "${GREEN}✓ Environment file already exists${NC}"
fi

# Set up volume directories
echo -e "\n${YELLOW}Setting up storage volumes...${NC}"
if [ -f ./docker/setup-volumes.sh ]; then
    chmod +x ./docker/setup-volumes.sh
    ./docker/setup-volumes.sh
    echo -e "${GREEN}✓ Storage volumes configured${NC}"
else
    echo -e "${RED}Volume setup script not found. Creating directories manually...${NC}"
    mkdir -p ./volumes/postgres-data
    mkdir -p ./volumes/evidence-files/{documents,images,videos,audio,other}
    mkdir -p ./volumes/llm-cache
    mkdir -p ./volumes/ollama-models
    chmod -R 755 ./volumes
    echo -e "${GREEN}✓ Storage directories created manually${NC}"
fi

# Check for GPU support
echo -e "\n${YELLOW}Checking for GPU support...${NC}"
if command -v nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✓ NVIDIA GPU detected - will use for LLM acceleration${NC}"
    
    # Check if nvidia-docker is installed
    if docker info | grep -q "nvidia"; then
        echo -e "${GREEN}✓ NVIDIA Docker runtime is available${NC}"
    else
        echo -e "${YELLOW}⚠ NVIDIA Docker runtime not detected. GPU acceleration may not work.${NC}"
        echo -e "${YELLOW}  Consider installing nvidia-docker for better performance.${NC}"
        
        # Modify docker-compose.yml to remove GPU requirements
        if [ -f docker-compose.yml ]; then
            sed -i.bak '/driver: nvidia/,+3d' docker-compose.yml
            echo -e "${YELLOW}  Modified docker-compose.yml for CPU-only mode${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ No NVIDIA GPU detected - will run in CPU-only mode${NC}"
    echo -e "${YELLOW}  LLM performance may be limited. Consider using a machine with GPU support.${NC}"
    
    # Modify docker-compose.yml to remove GPU requirements
    if [ -f docker-compose.yml ]; then
        sed -i.bak '/driver: nvidia/,+3d' docker-compose.yml
        echo -e "${YELLOW}  Modified docker-compose.yml for CPU-only mode${NC}"
    fi
fi

# Build and start containers
echo -e "\n${YELLOW}Building and starting containers...${NC}"
echo -e "${YELLOW}This may take several minutes on first run...${NC}"
docker-compose up -d

# Wait for services to start
echo -e "\n${YELLOW}Waiting for services to start...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"
sleep 20

# Check if containers are running
echo -e "\n${YELLOW}Checking container status...${NC}"
if docker-compose ps | grep -q "Exit"; then
    echo -e "${RED}Some containers failed to start. Checking logs...${NC}"
    docker-compose logs
    echo -e "\n${RED}Please check the logs above for errors.${NC}"
    echo -e "${YELLOW}You can try running the test script for more details:${NC}"
    echo -e "  ./test-local-deployment.sh"
else
    echo -e "${GREEN}✓ All containers are running${NC}"
    docker-compose ps
    
    # Test backend API
    echo -e "\n${YELLOW}Testing backend API...${NC}"
    if curl -s http://localhost/api/health | grep -q "ok"; then
        echo -e "${GREEN}✓ Backend API is responding${NC}"
    else
        echo -e "${YELLOW}⚠ Backend API is not responding yet. It may need more time to initialize.${NC}"
    fi
    
    # Test frontend
    echo -e "\n${YELLOW}Testing frontend...${NC}"
    if curl -s -I http://localhost | grep -q "200 OK"; then
        echo -e "${GREEN}✓ Frontend is accessible${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend is not accessible yet. It may need more time to initialize.${NC}"
    fi
    
    # Pull default LLM model if needed
    echo -e "\n${YELLOW}Ensuring default LLM model is available...${NC}"
    docker-compose exec -T ollama ollama list | grep -q "llama2" || docker-compose exec -T ollama ollama pull llama2
    echo -e "${GREEN}✓ Default LLM model is available${NC}"
    
    echo -e "\n${GREEN}✅ Setup completed successfully!${NC}"
    echo -e "\n${BLUE}=========================================================${NC}"
    echo -e "${GREEN}Case Management System is now running!${NC}"
    echo -e "${BLUE}=========================================================${NC}"
    echo -e "\n${YELLOW}Access the system at:${NC} http://localhost"
    echo -e "\n${YELLOW}Default login:${NC}"
    echo -e "  Email: ${GREEN}admin@example.com${NC}"
    echo -e "  Password: ${GREEN}admin123${NC}"
    echo -e "\n${RED}IMPORTANT: Change the default password after first login!${NC}"
    echo -e "\n${YELLOW}For more information, see:${NC}"
    echo -e "  - QUICK-START.md"
    echo -e "  - docs/docker-deployment-guide.md"
    echo -e "  - docs/user-guide.md"
    echo -e "\n${YELLOW}Common commands:${NC}"
    echo -e "  - Start: ${GREEN}docker-compose up -d${NC}"
    echo -e "  - Stop: ${GREEN}docker-compose down${NC}"
    echo -e "  - Logs: ${GREEN}docker-compose logs${NC}"
    echo -e "  - Monitor: ${GREEN}./monitor-performance.sh${NC}"
fi
