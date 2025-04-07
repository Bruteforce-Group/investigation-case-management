#!/bin/bash
# Build script for Investigation Case Management Application
# This script builds and packages the application for macOS deployment

set -e

# Configuration
APP_NAME="Investigation Case Manager"
APP_VERSION="1.0.0"
BUILD_DIR="./build"
DIST_DIR="./dist"
SOURCE_DIR="./Sources"
RESOURCES_DIR="./Resources"
SCRIPTS_DIR="./Scripts"
FRAMEWORKS_DIR="./Frameworks"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}Building ${APP_NAME} v${APP_VERSION}${NC}"
echo -e "${BLUE}======================================================${NC}"

# Create necessary directories
echo -e "${YELLOW}Creating build directories...${NC}"
mkdir -p "${BUILD_DIR}"
mkdir -p "${DIST_DIR}"

# Check for required tools
echo -e "${YELLOW}Checking for required tools...${NC}"
command -v swift >/dev/null 2>&1 || { echo -e "${RED}Swift is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v xcodebuild >/dev/null 2>&1 || { echo -e "${RED}Xcode command line tools are required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v postgres >/dev/null 2>&1 || { echo -e "${YELLOW}PostgreSQL is not installed. Database functionality will be limited.${NC}" >&2; }

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf "${BUILD_DIR:?}"/*
rm -rf "${DIST_DIR:?}"/*

# Resolve dependencies
echo -e "${YELLOW}Resolving dependencies...${NC}"
swift package resolve

# Build the application
echo -e "${YELLOW}Building application...${NC}"
swift build -c release --arch arm64 --arch x86_64

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
swift test

# Create application bundle
echo -e "${YELLOW}Creating application bundle...${NC}"
APP_BUNDLE="${BUILD_DIR}/${APP_NAME}.app"
mkdir -p "${APP_BUNDLE}/Contents/MacOS"
mkdir -p "${APP_BUNDLE}/Contents/Resources"
mkdir -p "${APP_BUNDLE}/Contents/Frameworks"

# Copy binary
echo -e "${YELLOW}Copying binary...${NC}"
cp "./.build/release/InvestigationCaseManager" "${APP_BUNDLE}/Contents/MacOS/"

# Copy resources
echo -e "${YELLOW}Copying resources...${NC}"
if [ -d "${RESOURCES_DIR}" ]; then
    cp -R "${RESOURCES_DIR}"/* "${APP_BUNDLE}/Contents/Resources/"
fi

# Copy frameworks
echo -e "${YELLOW}Copying frameworks...${NC}"
if [ -d "${FRAMEWORKS_DIR}" ]; then
    cp -R "${FRAMEWORKS_DIR}"/* "${APP_BUNDLE}/Contents/Frameworks/"
fi

# Create Info.plist
echo -e "${YELLOW}Creating Info.plist...${NC}"
cat > "${APP_BUNDLE}/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>InvestigationCaseManager</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.investigationsolutions.casemanager</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${APP_NAME}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${APP_VERSION}</string>
    <key>CFBundleVersion</key>
    <string>${APP_VERSION}</string>
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.productivity</string>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2025 Investigation Solutions. All rights reserved.</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
    <key>NSMainStoryboardFile</key>
    <string>Main</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
    <key>NSCameraUsageDescription</key>
    <string>This app requires camera access to scan documents and capture evidence photos.</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>This app requires microphone access to record audio evidence.</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>This app requires photo library access to import evidence photos.</string>
</dict>
</plist>
EOF

# Create PkgInfo
echo -e "${YELLOW}Creating PkgInfo...${NC}"
echo "APPL????" > "${APP_BUNDLE}/Contents/PkgInfo"

# Sign the application
echo -e "${YELLOW}Signing application...${NC}"
# Uncomment the following line and replace with your developer ID when ready for distribution
# codesign --force --options runtime --sign "Developer ID Application: Your Name (XXXXXXXXXX)" "${APP_BUNDLE}"

# Create DMG
echo -e "${YELLOW}Creating DMG...${NC}"
DMG_FILE="${DIST_DIR}/${APP_NAME}-${APP_VERSION}.dmg"
hdiutil create -volname "${APP_NAME}" -srcfolder "${BUILD_DIR}" -ov -format UDZO "${DMG_FILE}"

# Create ZIP archive
echo -e "${YELLOW}Creating ZIP archive...${NC}"
ZIP_FILE="${DIST_DIR}/${APP_NAME}-${APP_VERSION}.zip"
ditto -c -k --keepParent "${APP_BUNDLE}" "${ZIP_FILE}"

# Copy documentation
echo -e "${YELLOW}Copying documentation...${NC}"
cp -R "./docs" "${DIST_DIR}/Documentation"

# Print summary
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}Application bundle: ${APP_BUNDLE}${NC}"
echo -e "${GREEN}DMG installer: ${DMG_FILE}${NC}"
echo -e "${GREEN}ZIP archive: ${ZIP_FILE}${NC}"
echo -e "${GREEN}Documentation: ${DIST_DIR}/Documentation${NC}"
echo -e "${GREEN}======================================================${NC}"

exit 0
