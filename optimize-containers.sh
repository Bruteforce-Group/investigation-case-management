#!/bin/bash
# Script to optimize container performance for the Case Management System

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting container performance optimization...${NC}"

# Create optimized Docker Compose override file
echo -e "\n${YELLOW}Creating Docker Compose override file for performance optimization...${NC}"

cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  # Frontend optimizations
  frontend:
    # Use multi-stage build with production optimization
    build:
      args:
        - NODE_ENV=production
    # Add healthcheck
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Backend optimizations
  backend:
    # Add resource limits
    deploy:
      resources:
        limits:
          cpus: '0.75'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 512M
    # Add healthcheck
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    # Add environment variables for Node.js optimization
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=768

  # PostgreSQL optimizations
  postgres:
    command: postgres -c shared_buffers=256MB -c effective_cache_size=768MB -c work_mem=16MB -c maintenance_work_mem=64MB
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.1'
          memory: 256M

  # Ollama optimizations
  ollama:
    # Resource allocation depends on model size and available hardware
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '0.5'
          memory: 1G
      # GPU configuration is preserved from main docker-compose.yml

  # Nginx optimizations
  nginx:
    # Add custom nginx.conf with performance optimizations
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./docker/nginx/nginx-performance.conf:/etc/nginx/nginx.conf
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 128M
        reservations:
          cpus: '0.1'
          memory: 64M
EOF

echo -e "${GREEN}Created docker-compose.override.yml with performance optimizations.${NC}"

# Create optimized Nginx configuration
echo -e "\n${YELLOW}Creating optimized Nginx configuration...${NC}"

mkdir -p ./docker/nginx
cat > ./docker/nginx/nginx-performance.conf << 'EOF'
user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main buffer=16k;
    error_log /var/log/nginx/error.log warn;

    # Optimization settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # File descriptor cache
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Client settings
    client_max_body_size 50M;
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Include configuration files
    include /etc/nginx/conf.d/*.conf;
}
EOF

echo -e "${GREEN}Created optimized Nginx configuration.${NC}"

# Create Node.js optimization script
echo -e "\n${YELLOW}Creating Node.js optimization script...${NC}"

cat > ./backend/optimize-node.js << 'EOF'
// Node.js optimization script to be run before starting the server

// Optimize garbage collection
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '';
process.env.NODE_OPTIONS += ' --max-old-space-size=768';

// Optimize event loop
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '4';

// Log optimization settings
console.log('Node.js optimization settings:');
console.log('- NODE_OPTIONS:', process.env.NODE_OPTIONS);
console.log('- UV_THREADPOOL_SIZE:', process.env.UV_THREADPOOL_SIZE);

// Continue with normal server startup
require('./server.js');
EOF

echo -e "${GREEN}Created Node.js optimization script.${NC}"

# Update backend Dockerfile to use optimization script
echo -e "\n${YELLOW}Updating backend Dockerfile to use optimization script...${NC}"

# Create a backup of the original Dockerfile
cp ./backend/Dockerfile ./backend/Dockerfile.bak

# Update the CMD line in the Dockerfile
sed -i 's/CMD \["node", "server.js"\]/CMD \["node", "optimize-node.js"\]/' ./backend/Dockerfile

echo -e "${GREEN}Updated backend Dockerfile.${NC}"

# Create PostgreSQL optimization script
echo -e "\n${YELLOW}Creating PostgreSQL optimization script...${NC}"

mkdir -p ./docker/postgres
cat > ./docker/postgres/optimize-postgres.sh << 'EOF'
#!/bin/bash

# This script runs after PostgreSQL initialization to optimize performance

# Calculate memory settings based on container limits
CONTAINER_MEM_BYTES=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes)
CONTAINER_MEM_MB=$((CONTAINER_MEM_BYTES / 1024 / 1024))

# Set reasonable defaults
SHARED_BUFFERS="128MB"
EFFECTIVE_CACHE_SIZE="384MB"
WORK_MEM="8MB"
MAINTENANCE_WORK_MEM="32MB"
MAX_CONNECTIONS=100

# Scale settings based on available memory
if [ $CONTAINER_MEM_MB -gt 1024 ]; then
    # More than 1GB memory
    SHARED_BUFFERS="256MB"
    EFFECTIVE_CACHE_SIZE="768MB"
    WORK_MEM="16MB"
    MAINTENANCE_WORK_MEM="64MB"
fi

if [ $CONTAINER_MEM_MB -gt 2048 ]; then
    # More than 2GB memory
    SHARED_BUFFERS="512MB"
    EFFECTIVE_CACHE_SIZE="1536MB"
    WORK_MEM="32MB"
    MAINTENANCE_WORK_MEM="128MB"
fi

if [ $CONTAINER_MEM_MB -gt 4096 ]; then
    # More than 4GB memory
    SHARED_BUFFERS="1GB"
    EFFECTIVE_CACHE_SIZE="3GB"
    WORK_MEM="64MB"
    MAINTENANCE_WORK_MEM="256MB"
fi

# Apply settings
psql -U postgres -c "ALTER SYSTEM SET shared_buffers = '$SHARED_BUFFERS';"
psql -U postgres -c "ALTER SYSTEM SET effective_cache_size = '$EFFECTIVE_CACHE_SIZE';"
psql -U postgres -c "ALTER SYSTEM SET work_mem = '$WORK_MEM';"
psql -U postgres -c "ALTER SYSTEM SET maintenance_work_mem = '$MAINTENANCE_WORK_MEM';"
psql -U postgres -c "ALTER SYSTEM SET max_connections = '$MAX_CONNECTIONS';"
psql -U postgres -c "ALTER SYSTEM SET random_page_cost = 1.1;"
psql -U postgres -c "ALTER SYSTEM SET effective_io_concurrency = 200;"
psql -U postgres -c "ALTER SYSTEM SET checkpoint_completion_target = 0.9;"
psql -U postgres -c "ALTER SYSTEM SET wal_buffers = '16MB';"
psql -U postgres -c "ALTER SYSTEM SET default_statistics_target = 100;"

# Reload configuration
psql -U postgres -c "SELECT pg_reload_conf();"

echo "PostgreSQL optimization complete with the following settings:"
echo "- shared_buffers = $SHARED_BUFFERS"
echo "- effective_cache_size = $EFFECTIVE_CACHE_SIZE"
echo "- work_mem = $WORK_MEM"
echo "- maintenance_work_mem = $MAINTENANCE_WORK_MEM"
echo "- max_connections = $MAX_CONNECTIONS"
EOF

chmod +x ./docker/postgres/optimize-postgres.sh
echo -e "${GREEN}Created PostgreSQL optimization script.${NC}"

# Create Ollama optimization script
echo -e "\n${YELLOW}Creating Ollama optimization script...${NC}"

mkdir -p ./docker/ollama
cat > ./docker/ollama/optimize-ollama.sh << 'EOF'
#!/bin/bash

# This script optimizes Ollama configuration based on available resources

# Check for GPU
if [ -e /dev/nvidia0 ]; then
    echo "NVIDIA GPU detected, optimizing for GPU usage"
    # Set environment variables for GPU optimization
    export CUDA_VISIBLE_DEVICES=0
    export GPU_DEVICE_ORDINAL=0
else
    echo "No GPU detected, optimizing for CPU usage"
    # Set environment variables for CPU optimization
    export OLLAMA_NUM_THREADS=$(nproc)
fi

# Set Ollama environment variables
export OLLAMA_HOST=0.0.0.0
export OLLAMA_MODELS=/root/.ollama/models

# Start Ollama with optimized settings
ollama serve
EOF

chmod +x ./docker/ollama/optimize-ollama.sh
echo -e "${GREEN}Created Ollama optimization script.${NC}"

# Update Ollama service in docker-compose.override.yml
echo -e "\n${YELLOW}Updating Ollama service in docker-compose.override.yml...${NC}"

# Append to the existing docker-compose.override.yml
cat >> docker-compose.override.yml << 'EOF'
  # Additional Ollama optimizations
  ollama:
    command: /opt/ollama/optimize-ollama.sh
    volumes:
      - ./docker/ollama/optimize-ollama.sh:/opt/ollama/optimize-ollama.sh
EOF

echo -e "${GREEN}Updated Ollama service in docker-compose.override.yml.${NC}"

# Create a script to monitor container performance
echo -e "\n${YELLOW}Creating container performance monitoring script...${NC}"

cat > ./monitor-performance.sh << 'EOF'
#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting container performance monitoring...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "Containers are not running. Please start them with 'docker-compose up -d' first."
    exit 1
fi

# Monitor CPU, memory, and I/O usage
echo -e "${BLUE}Container resource usage:${NC}"
docker stats --no-stream $(docker-compose ps -q)

# Show container logs with resource usage
echo -e "\n${BLUE}Checking for performance issues in logs:${NC}"
for container in $(docker-compose ps -q); do
    container_name=$(docker inspect --format '{{.Name}}' $container | sed 's/\///')
    echo -e "${YELLOW}$container_name logs:${NC}"
    docker logs --tail 20 $container | grep -i -E 'warn|error|critical|memory|cpu|timeout|slow'
done

# Check database performance
echo -e "\n${BLUE}Database performance:${NC}"
docker-compose exec postgres psql -U postgres -c "SELECT pg_database_size('case_management')/1024/1024 as size_mb;"
docker-compose exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check Ollama performance
echo -e "\n${BLUE}Ollama performance:${NC}"
docker-compose exec ollama curl -s http://localhost:11434/api/version

echo -e "\n${GREEN}Performance monitoring complete.${NC}"
echo -e "${YELLOW}For continuous monitoring, consider using:${NC}"
echo -e "  - docker stats"
echo -e "  - docker-compose logs -f"
EOF

chmod +x ./monitor-performance.sh
echo -e "${GREEN}Created container performance monitoring script.${NC}"

echo -e "\n${GREEN}Container performance optimization complete.${NC}"
echo -e "${YELLOW}To apply these optimizations:${NC}"
echo -e "1. Restart your containers with: docker-compose down && docker-compose up -d"
echo -e "2. Monitor performance with: ./monitor-performance.sh"
echo -e "${YELLOW}Note: Adjust resource limits in docker-compose.override.yml based on your hardware capabilities.${NC}"
