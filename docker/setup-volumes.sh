#!/bin/bash
# Script to create and configure volume directories for Docker persistence

# Create base directories
mkdir -p ./volumes/postgres-data
mkdir -p ./volumes/evidence-files
mkdir -p ./volumes/llm-cache
mkdir -p ./volumes/ollama-models

# Create evidence subdirectories
mkdir -p ./volumes/evidence-files/documents
mkdir -p ./volumes/evidence-files/images
mkdir -p ./volumes/evidence-files/videos
mkdir -p ./volumes/evidence-files/audio
mkdir -p ./volumes/evidence-files/other

# Create LLM cache directory
mkdir -p ./volumes/llm-cache

# Set permissions
chmod -R 755 ./volumes

echo "Volume directories created successfully:"
echo "- PostgreSQL data: ./volumes/postgres-data"
echo "- Evidence files: ./volumes/evidence-files"
echo "- LLM cache: ./volumes/llm-cache"
echo "- Ollama models: ./volumes/ollama-models"
echo ""
echo "These directories will be mounted as Docker volumes for data persistence."
