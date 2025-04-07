# Investigation Case Management Web Application Documentation

## Overview

The Investigation Case Management Web Application is a comprehensive solution designed for investigators to manage cases, evidence, timelines, and analysis. This web-based application provides a modern, secure interface for organizing investigative data and leveraging AI-powered analysis to identify connections and generate insights.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [Features](#features)
5. [User Guide](#user-guide)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

## System Requirements

### Server Requirements
- Node.js 18.x or higher
- PostgreSQL 14.x or higher with pgvector extension
- 2GB RAM minimum (4GB recommended)
- 20GB storage minimum

### Client Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimum screen resolution: 1280x720

## Installation

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/investigation-case-management.git
   cd investigation-case-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and API keys.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Architecture

The Investigation Case Management Web Application follows a modern architecture:

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API
- **Database**: PostgreSQL with pgvector extension for vector search
- **ORM**: Prisma for database access
- **Authentication**: Custom JWT-based authentication
- **AI Integration**: Claude API for analysis and insights

### Component Structure

- `/src/app`: Next.js application routes
- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and services
- `/prisma`: Database schema and migrations

## Features

### Case Management
- Create, view, edit, and delete cases
- Assign priority levels and status
- Track case progress and deadlines
- Organize cases by type, status, and priority

### Evidence Management
- Upload and organize multiple types of evidence (documents, images, audio, video)
- OCR for text extraction from images and documents
- Transcription for audio files
- Tag and categorize evidence
- Search evidence by content, tags, or metadata

### Timeline Visualization
- Interactive timeline of case events
- Filter timeline by date ranges, event types, or importance
- Add, edit, and remove timeline events
- Visualize connections between events

### Dynamic Storyline Analysis
- AI-powered analysis of case evidence and timeline
- Generate potential storylines and scenarios
- Identify gaps in evidence or investigation
- Suggest next steps for investigation

### Relationship Analysis
- Track persons of interest and their relationships
- Visualize connections between people, places, and evidence
- AI-powered relationship analysis

### Vector Search
- Semantic search across all case data
- Find related evidence based on content similarity
- Discover hidden connections between evidence items

## User Guide

### Getting Started

1. **Registration and Login**
   - Navigate to the login page
   - Click "Register" to create a new account
   - Fill in your details and select your role
   - After registration, log in with your credentials

2. **Dashboard**
   - The dashboard provides an overview of your cases
   - Recent activity and important updates are displayed
   - Quick access to create new cases or view existing ones

3. **Creating a New Case**
   - Click "New Case" from the dashboard
   - Fill in the case details (title, description, priority, etc.)
   - Click "Create" to save the case

### Managing Evidence

1. **Adding Evidence**
   - Navigate to a case and select the "Evidence" tab
   - Click "Add Evidence" and select the evidence type
   - Upload files or enter details for physical evidence
   - Add metadata such as collection date, location, and tags

2. **Viewing Evidence**
   - All evidence is listed in the Evidence tab
   - Click on an evidence item to view details
   - Use filters to find specific evidence by type, date, or tags

3. **Analyzing Evidence**
   - Select evidence items and click "Analyze"
   - The system will process the evidence using Claude AI
   - View analysis results including extracted information and connections

### Working with Timelines

1. **Creating Timeline Events**
   - Navigate to the Timeline tab
   - Click "Add Event" and enter event details
   - Set the date, time, location, and importance level
   - Connect events to evidence or persons

2. **Visualizing the Timeline**
   - View events chronologically on the interactive timeline
   - Zoom in/out to focus on specific time periods
   - Filter events by type, importance, or connections
   - Click on events to view details

### Generating Analysis

1. **Storyline Analysis**
   - Navigate to the Analysis tab
   - Click "Generate Storyline Analysis"
   - The system will analyze all case data using Claude AI
   - Review the generated narrative, key findings, and potential scenarios

2. **Relationship Analysis**
   - In the Analysis tab, select "Relationship Analysis"
   - The system will analyze connections between persons of interest
   - View the relationship graph and analysis report

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- **User**: Stores user account information
- **Case**: Contains case metadata and status
- **Evidence**: Stores evidence items and metadata
- **TimelineEvent**: Records events in the case timeline
- **Person**: Tracks persons of interest
- **Location**: Stores location information
- **Relationship**: Records relationships between persons
- **Tag**: Provides categorization for evidence and events
- **StorylineAnalysis**: Stores AI-generated analysis results

For a complete schema, refer to the `prisma/schema.prisma` file.

## API Reference

The application provides a RESTful API for programmatic access:

### Authentication Endpoints

- `POST /api/auth/login`: Authenticate user and get JWT token
- `POST /api/auth/register`: Create a new user account
- `POST /api/auth/logout`: Invalidate current session
- `POST /api/auth/reset-password`: Request password reset

### Case Endpoints

- `GET /api/cases`: List all cases
- `GET /api/cases/:id`: Get case details
- `POST /api/cases`: Create a new case
- `PUT /api/cases/:id`: Update case details
- `DELETE /api/cases/:id`: Delete a case

### Evidence Endpoints

- `GET /api/evidence`: List all evidence
- `GET /api/evidence/:id`: Get evidence details
- `POST /api/evidence`: Add new evidence
- `PUT /api/evidence/:id`: Update evidence
- `DELETE /api/evidence/:id`: Delete evidence

### Timeline Endpoints

- `GET /api/timeline`: Get timeline events
- `POST /api/timeline`: Create timeline event
- `PUT /api/timeline/:id`: Update timeline event
- `DELETE /api/timeline/:id`: Delete timeline event

### Analysis Endpoints

- `POST /api/analysis/storyline`: Generate storyline analysis
- `POST /api/analysis/relationships`: Generate relationship analysis
- `GET /api/analysis/vector-search`: Perform vector similarity search

## Security

### Authentication and Authorization

- JWT-based authentication
- Role-based access control (Admin, Investigator, Analyst, Viewer)
- Session timeout and refresh tokens
- Password policies enforced (complexity, expiration)

### Data Protection

- All data encrypted in transit (HTTPS)
- Sensitive data encrypted at rest
- Database access restricted by user role
- Input validation and sanitization

### Audit and Compliance

- Comprehensive audit logging
- User action tracking
- Evidence chain of custody maintenance
- Compliance with law enforcement data handling requirements

## Troubleshooting

### Common Issues

1. **Login Problems**
   - Ensure your email and password are correct
   - Check if your account is locked after multiple failed attempts
   - Clear browser cookies and try again

2. **File Upload Issues**
   - Check file size limits (max 50MB per file)
   - Ensure file type is supported
   - Check your internet connection

3. **Performance Issues**
   - Large cases with many evidence items may load slowly
   - Consider archiving old or irrelevant evidence
   - Use filters to limit the data being displayed

### Error Messages

- **"Unauthorized Access"**: You don't have permission for this action
- **"Invalid Token"**: Your session has expired, please log in again
- **"Database Connection Error"**: Contact system administrator
- **"API Rate Limit Exceeded"**: Too many requests, try again later

## FAQ

**Q: Can I export case data for court proceedings?**
A: Yes, you can export case data, timeline, and analysis reports in PDF format from the case details page.

**Q: How secure is the evidence storage?**
A: All evidence is encrypted at rest and in transit. Access is restricted based on user roles and permissions.

**Q: Can multiple investigators work on the same case?**
A: Yes, the system supports collaborative investigation with appropriate access controls.

**Q: How does the AI analysis work?**
A: The system uses Claude AI to analyze evidence, timeline events, and relationships to generate insights, identify patterns, and suggest possible scenarios.

**Q: Is there a mobile version of the application?**
A: The web application is responsive and works on mobile devices. A dedicated mobile app is planned for future releases.

**Q: How often is the database backed up?**
A: The database is backed up daily, with point-in-time recovery available for the last 30 days.

---

For additional support, please contact the system administrator or refer to the training materials.
