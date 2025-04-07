#!/bin/bash
# Installation script for Investigation Case Management Application
# This script installs the application and sets up required dependencies

set -e

# Configuration
APP_NAME="Investigation Case Manager"
APP_VERSION="1.0.0"
INSTALL_DIR="/Applications"
DB_NAME="investigation_db"
DB_USER="investigation_user"
DB_PASSWORD="secure_password" # In production, this should be generated or requested

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}Installing ${APP_NAME} v${APP_VERSION}${NC}"
echo -e "${BLUE}======================================================${NC}"

# Check for admin privileges
if [ "$(id -u)" != "0" ]; then
   echo -e "${RED}This script must be run with administrator privileges${NC}" 1>&2
   echo -e "${YELLOW}Please run with: sudo $0${NC}" 1>&2
   exit 1
fi

# Check system requirements
echo -e "${YELLOW}Checking system requirements...${NC}"
SW_VERS=$(sw_vers -productVersion)
if [[ $(echo "${SW_VERS}" | cut -d. -f1) -lt 12 ]]; then
    echo -e "${RED}macOS 12.0 or later is required. You have ${SW_VERS}${NC}" 1>&2
    exit 1
fi

# Check for Apple Silicon
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    echo -e "${GREEN}Apple Silicon detected: $ARCH${NC}"
else
    echo -e "${YELLOW}Intel Mac detected: $ARCH${NC}"
    echo -e "${YELLOW}Note: Performance is optimized for Apple Silicon Macs${NC}"
fi

# Check for PostgreSQL
echo -e "${YELLOW}Checking for PostgreSQL...${NC}"
if ! command -v postgres &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL not found. Installing...${NC}"
    
    # Check for Homebrew
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}Homebrew not found. Installing...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install PostgreSQL
    brew install postgresql@14
    brew services start postgresql@14
    
    echo -e "${GREEN}PostgreSQL installed successfully${NC}"
else
    echo -e "${GREEN}PostgreSQL is already installed${NC}"
fi

# Check for pgvector extension
echo -e "${YELLOW}Checking for pgvector extension...${NC}"
if ! psql -U postgres -c "SELECT * FROM pg_available_extensions WHERE name = 'vector'" &> /dev/null; then
    echo -e "${YELLOW}pgvector extension not found. Installing...${NC}"
    
    # Install pgvector
    brew install pgvector
    
    echo -e "${GREEN}pgvector installed successfully${NC}"
else
    echo -e "${GREEN}pgvector extension is already available${NC}"
fi

# Create database and user
echo -e "${YELLOW}Setting up database...${NC}"
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    # Create user
    psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    
    # Create database
    psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    
    # Connect to database and create extensions
    psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS vector;"
    
    echo -e "${GREEN}Database setup completed successfully${NC}"
else
    echo -e "${GREEN}Database already exists${NC}"
fi

# Install application
echo -e "${YELLOW}Installing application...${NC}"
APP_BUNDLE="$INSTALL_DIR/$APP_NAME.app"

# Remove previous installation if exists
if [ -d "$APP_BUNDLE" ]; then
    echo -e "${YELLOW}Removing previous installation...${NC}"
    rm -rf "$APP_BUNDLE"
fi

# Copy application bundle
echo -e "${YELLOW}Copying application files...${NC}"
cp -R "./build/$APP_NAME.app" "$INSTALL_DIR/"

# Set permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chmod -R 755 "$APP_BUNDLE"
chown -R root:wheel "$APP_BUNDLE"

# Create configuration file
echo -e "${YELLOW}Creating configuration file...${NC}"
CONFIG_DIR="$HOME/Library/Application Support/$APP_NAME"
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/config.json" << EOF
{
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "$DB_NAME",
        "user": "$DB_USER",
        "password": "$DB_PASSWORD"
    },
    "application": {
        "version": "$APP_VERSION",
        "log_level": "info",
        "data_dir": "$HOME/Library/Application Support/$APP_NAME/Data",
        "backup_dir": "$HOME/Library/Application Support/$APP_NAME/Backups",
        "temp_dir": "$HOME/Library/Application Support/$APP_NAME/Temp"
    },
    "cloud": {
        "enabled": false,
        "provider": "none",
        "sync_interval": 3600
    },
    "ai": {
        "enabled": true,
        "api_key": "",
        "model": "claude-3-opus-20240229",
        "max_tokens": 100000
    }
}
EOF

# Create data directories
mkdir -p "$HOME/Library/Application Support/$APP_NAME/Data"
mkdir -p "$HOME/Library/Application Support/$APP_NAME/Backups"
mkdir -p "$HOME/Library/Application Support/$APP_NAME/Temp"

# Set permissions for configuration
chown -R $(logname):staff "$CONFIG_DIR"
chmod -R 700 "$CONFIG_DIR"

# Create desktop shortcut
echo -e "${YELLOW}Creating desktop shortcut...${NC}"
ln -sf "$APP_BUNDLE" "/Users/$(logname)/Desktop/"

# Register file types
echo -e "${YELLOW}Registering file types...${NC}"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP_BUNDLE"

# Print summary
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}Installation completed successfully!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}Application installed to: ${APP_BUNDLE}${NC}"
echo -e "${GREEN}Configuration directory: ${CONFIG_DIR}${NC}"
echo -e "${GREEN}Database name: ${DB_NAME}${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${YELLOW}Important: Please set your Claude API key in the configuration file:${NC}"
echo -e "${YELLOW}${CONFIG_DIR}/config.json${NC}"
echo -e "${GREEN}======================================================${NC}"

exit 0
