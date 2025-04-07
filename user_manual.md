# Investigation Case Management Application
## User Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Getting Started](#getting-started)
5. [Case Management](#case-management)
6. [Evidence Management](#evidence-management)
7. [Timeline Visualization](#timeline-visualization)
8. [Storyline Analysis](#storyline-analysis)
9. [Search and Filtering](#search-and-filtering)
10. [AI Integration](#ai-integration)
11. [Cloud Integration](#cloud-integration)
12. [Troubleshooting](#troubleshooting)
13. [Keyboard Shortcuts](#keyboard-shortcuts)
14. [Privacy and Security](#privacy-and-security)
15. [Support](#support)

## Introduction

The Investigation Case Management Application is a comprehensive tool designed specifically for investigators to manage case information, evidence, timelines, and analysis in a single, integrated platform. This application helps you organize your investigative work, visualize connections between evidence, and generate insights using advanced AI capabilities.

### Key Features

- **Case Management**: Create and manage investigation cases with detailed information
- **Evidence Management**: Upload, organize, and analyze various types of evidence
- **Timeline Visualization**: Create and visualize event timelines with interactive features
- **Dynamic Storyline Analysis**: AI-powered analysis of case data to generate storylines and scenarios
- **OCR and Transcription**: Automatic text extraction from images and transcription of audio files
- **Vector Search**: Find connections between evidence using semantic search
- **Claude AI Integration**: Advanced analysis of evidence and case information
- **Cloud Integration**: Sync and backup your case data securely
- **Comprehensive Security**: End-to-end encryption and secure access controls

## System Requirements

### Minimum Requirements
- macOS 12.0 (Monterey) or later
- Apple Silicon Mac (M1 or later)
- 8GB RAM
- 256GB storage (SSD recommended)
- Internet connection for cloud features and AI analysis

### Recommended Requirements
- macOS 13.0 (Ventura) or later
- Apple Silicon Mac (M2 or later)
- 16GB RAM or more
- 512GB storage or more (SSD)
- High-speed internet connection

## Installation

1. Download the application installer from the provided secure link
2. Open the downloaded .dmg file
3. Drag the application icon to your Applications folder
4. Launch the application from your Applications folder or Launchpad
5. On first launch, you'll be prompted to:
   - Create an account or sign in
   - Set up database preferences
   - Configure cloud integration (optional)
   - Set up Claude API access (API key required)

## Getting Started

### Creating Your First Case

1. Launch the application
2. Click the "+" button in the top navigation bar or select "File > New Case"
3. Enter the case details:
   - Case title
   - Case number
   - Description
   - Start date
   - Status
   - Priority
   - Tags (optional)
4. Click "Create Case"

### Application Interface Overview

The application interface is divided into several main sections:

- **Navigation Sidebar**: Access different cases and main features
- **Case Dashboard**: Overview of case status, recent activities, and key metrics
- **Evidence Management**: Upload, view, and analyze evidence
- **Timeline View**: Visualize and manage case events chronologically
- **Storyline Analysis**: AI-generated narratives and alternative scenarios
- **Search**: Find information across all cases and evidence
- **Settings**: Configure application preferences and integrations

## Case Management

### Creating a New Case

1. Click "File > New Case" or the "+" button in the navigation sidebar
2. Fill in the required case information
3. Click "Create Case"

### Editing Case Details

1. Open the case you want to edit
2. Click the "Edit" button in the case header
3. Modify the case details
4. Click "Save Changes"

### Case Dashboard

The case dashboard provides an overview of your case, including:

- Case summary and status
- Recent activities
- Evidence statistics
- Timeline highlights
- Key persons of interest
- Important locations
- Upcoming tasks and deadlines

### Case Export and Sharing

1. Open the case you want to export
2. Click "File > Export Case" or the "Export" button in the case header
3. Choose the export format:
   - PDF Report
   - Case Package (for sharing with other application users)
   - Evidence Collection
4. Select the elements to include in the export
5. Choose the export location
6. Click "Export"

## Evidence Management

### Adding Evidence

1. Open the case where you want to add evidence
2. Navigate to the "Evidence" tab
3. Click the "Add Evidence" button
4. Choose the method:
   - "Add Manually" for creating evidence records without files
   - "Import Evidence" for uploading files

#### Importing Evidence Files

1. Click "Import Evidence"
2. Select the file(s) to import
3. Fill in the evidence details:
   - Title
   - Description
   - Type
   - Collection date
   - Collection location
   - Tags
4. Click "Import"

### Evidence Types

The application supports various types of evidence:

- **Documents**: PDF, Word, text files, etc.
- **Images**: Photos, scanned documents, diagrams
- **Audio**: Recordings, interviews, phone calls
- **Video**: Surveillance footage, recorded interviews
- **Physical Items**: Photos and descriptions of physical evidence
- **Other**: Custom evidence types

### Evidence Processing

When you import evidence, the application automatically:

1. Creates a secure copy of the original file
2. Generates a cryptographic hash for integrity verification
3. Extracts metadata from the file
4. Performs OCR on images and documents (when applicable)
5. Transcribes audio files (when applicable)
6. Creates vector embeddings for semantic search
7. Analyzes the content using Claude AI (when enabled)

### Evidence Details View

The evidence details view provides comprehensive information about each piece of evidence:

- Basic information (title, description, type)
- File details (size, format, hash)
- Collection information (date, location, collector)
- Chain of custody
- Content preview
- OCR text or transcription
- AI analysis
- Related evidence
- Timeline events

### Evidence Analysis

1. Open the evidence you want to analyze
2. Navigate to the "Analysis" tab
3. Click "Generate Analysis"
4. The AI will analyze the evidence and provide:
   - Key entities identified
   - Important dates
   - Potential connections to other evidence
   - Relevance assessment
   - Reliability assessment
   - Suggested follow-up actions

## Timeline Visualization

### Creating Timeline Events

1. Navigate to the "Timeline" tab
2. Click the "Add Event" button
3. Enter the event details:
   - Title
   - Description
   - Date and time
   - Duration (if applicable)
   - Location
   - Associated evidence
   - Associated persons
   - Confidence level
4. Click "Add Event"

### Timeline Navigation

- Use the zoom controls to adjust the timeline scale
- Drag the timeline left or right to navigate through time
- Click on events to view details
- Use the filter controls to show/hide specific event types
- Toggle between different timeline views:
  - Chronological view
  - Grouped by location
  - Grouped by person
  - Grouped by evidence

### Timeline Analysis

1. In the Timeline view, click the "Analyze" button
2. The AI will analyze the timeline and identify:
   - Patterns and sequences
   - Gaps in the timeline
   - Inconsistencies
   - Key decision points
   - Causal relationships

## Storyline Analysis

### Generating a Storyline Analysis

1. Navigate to the "Storyline" tab
2. Click "Generate Analysis"
3. Wait while the AI analyzes all case data
4. Review the generated analysis

### Storyline Components

The storyline analysis includes several components:

- **Main Narrative**: The most likely sequence of events based on the evidence
- **Alternative Scenarios**: Other possible explanations for the evidence
- **Key Elements**: Important factors, unexplained elements, and motivations
- **Relationship Network**: Visual representation of connections between people, evidence, and events
- **Timeline Inconsistencies**: Potential problems or gaps in the timeline

### Working with Alternative Scenarios

1. In the Storyline view, scroll to the "Alternative Scenarios" section
2. Click on a scenario to view details
3. Review the supporting and contradicting evidence
4. Consider the implications for your investigation
5. Add notes or follow-up tasks based on the scenario

### Relationship Network

The relationship network provides a visual representation of connections between:

- People
- Evidence
- Events
- Locations

You can:
- Click on nodes to view details
- Drag nodes to rearrange the network
- Zoom in/out for different levels of detail
- Filter the network by node type
- Export the network as an image

## Search and Filtering

### Basic Search

1. Use the search bar in the top navigation
2. Enter your search terms
3. Press Enter or click the search icon
4. Review the results across all categories

### Advanced Search

1. Click the "Advanced" button next to the search bar
2. Specify search parameters:
   - Case(s) to search
   - Content types (evidence, events, persons, etc.)
   - Date ranges
   - Keywords or phrases
   - Tags
3. Click "Search"

### Vector Search

Vector search uses AI to find semantically similar content, even when exact keywords don't match.

1. Navigate to "Search > Vector Search"
2. Enter a descriptive query about what you're looking for
3. Click "Search"
4. Review results ranked by semantic relevance

### Filtering Evidence

In the Evidence view:

1. Click the "Filters" button
2. Select filter criteria:
   - Evidence type
   - Date range
   - Status
   - Tags
   - Content type
3. Click "Apply Filters"

## AI Integration

### Setting Up Claude API

1. Navigate to "Settings > Integrations"
2. Click "Configure" next to Claude API
3. Enter your API key
4. Test the connection
5. Click "Save"

### AI Analysis Features

The application uses Claude AI for various analysis tasks:

- **Evidence Analysis**: Extract key information and insights from evidence
- **Timeline Analysis**: Identify patterns, gaps, and inconsistencies
- **Relationship Analysis**: Discover connections between case elements
- **Storyline Generation**: Create coherent narratives based on evidence
- **Alternative Scenario Generation**: Explore different explanations for the evidence

### Customizing AI Analysis

1. Navigate to "Settings > AI Settings"
2. Configure analysis preferences:
   - Confidence threshold
   - Analysis depth
   - Include/exclude specific analysis types
   - Language and formatting preferences
3. Click "Save"

## Cloud Integration

### Setting Up Cloud Sync

1. Navigate to "Settings > Cloud"
2. Choose your cloud provider
3. Sign in to your cloud account
4. Configure sync settings:
   - Automatic or manual sync
   - Items to sync
   - Bandwidth limits
5. Click "Enable Sync"

### Backup and Restore

#### Creating a Backup

1. Navigate to "File > Backup"
2. Choose backup location (local or cloud)
3. Select backup contents
4. Set encryption password (recommended)
5. Click "Create Backup"

#### Restoring from Backup

1. Navigate to "File > Restore"
2. Select the backup file
3. Enter the encryption password (if applicable)
4. Choose restore options
5. Click "Restore"

## Troubleshooting

### Common Issues

#### Application Won't Start

1. Verify system requirements
2. Check for macOS updates
3. Restart your computer
4. Reinstall the application

#### Database Connection Issues

1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database port is not blocked
4. Restart the database service

#### Cloud Sync Problems

1. Check internet connection
2. Verify cloud credentials
3. Check available cloud storage
4. Try manual sync

### Error Logs

1. Navigate to "Help > View Logs"
2. Review the log entries for error messages
3. Use the filter options to focus on specific log levels
4. Export logs for support if needed

## Keyboard Shortcuts

### General

- **⌘N**: New case
- **⌘O**: Open case
- **⌘S**: Save
- **⌘F**: Search
- **⌘,**: Preferences
- **⌘Q**: Quit

### Navigation

- **⌘1**: Dashboard
- **⌘2**: Evidence
- **⌘3**: Timeline
- **⌘4**: Storyline
- **⌘5**: Persons
- **⌘6**: Locations
- **⌘7**: Reports

### Evidence Management

- **⌘E**: Add evidence
- **⌘I**: Import evidence
- **⌘D**: Duplicate evidence
- **⌘⌫**: Delete evidence
- **Space**: Preview evidence

### Timeline

- **+**: Zoom in
- **-**: Zoom out
- **←→**: Navigate timeline
- **⌘T**: Add timeline event

## Privacy and Security

### Data Encryption

- All data is encrypted at rest using AES-256 encryption
- Database connections use TLS encryption
- Cloud sync uses end-to-end encryption

### Access Control

1. Navigate to "Settings > Security"
2. Configure access controls:
   - User accounts and permissions
   - Two-factor authentication
   - Session timeout settings
   - Login history

### Audit Logging

The application maintains detailed audit logs of all actions:

1. Navigate to "Settings > Audit Logs"
2. Review all actions taken in the application
3. Filter by user, date, or action type
4. Export audit logs for compliance purposes

## Support

### Getting Help

- **In-App Help**: Click "Help > Documentation" or press F1
- **Email Support**: support@investigationapp.com
- **Knowledge Base**: https://support.investigationapp.com
- **Training Videos**: https://training.investigationapp.com

### Reporting Issues

1. Navigate to "Help > Report Issue"
2. Describe the problem in detail
3. Attach screenshots if applicable
4. Include logs (automatically attached)
5. Submit the report

### Feature Requests

1. Navigate to "Help > Feature Request"
2. Describe the desired feature
3. Explain how it would benefit your workflow
4. Submit the request
