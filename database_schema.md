# Investigation Case Management Application Database Schema

## Overview

This document outlines the database schema for the Investigation Case Management application designed for macOS on Apple Silicon. The schema is designed to support the following key requirements:

- Case management with dynamic timeline and storyline updates
- Evidence management with support for various file types (documents, images, audio, etc.)
- OCR recognition for document processing
- Vector database integration for semantic search
- Claude API integration for AI-powered analysis
- Collaboration capabilities
- Cloud integration

## Database Tables

### 1. Cases

The central entity that represents an investigation case.

```
Table: cases
- id: UUID (Primary Key)
- title: String
- description: Text
- status: Enum (Open, Closed, Pending, Archived)
- priority: Enum (Low, Medium, High, Critical)
- created_at: DateTime
- updated_at: DateTime
- created_by: UUID (Foreign Key to users)
- assigned_to: UUID (Foreign Key to users)
- case_number: String (Unique identifier for reference)
- classification: String (Type of case)
- location: String (Geographic location of the case)
- start_date: DateTime (When the incident occurred)
- end_date: DateTime (Optional, when the incident ended if applicable)
- tags: Array of Strings (For categorization and filtering)
```

### 2. Persons

Individuals related to a case, including suspects, witnesses, victims, and investigators.

```
Table: persons
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- name: String
- role: Enum (Suspect, Witness, Victim, Investigator, Other)
- contact_info: JSON (Phone, email, address)
- description: Text
- date_of_birth: Date
- identification: String (ID number, passport, etc.)
- notes: Text
- created_at: DateTime
- updated_at: DateTime
- created_by: UUID (Foreign Key to users)
- vector_embedding: Vector (For AI-powered relationship analysis)
```

### 3. Evidence

Physical or digital items collected as evidence in a case.

```
Table: evidence
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- title: String
- description: Text
- type: Enum (Document, Image, Audio, Video, Physical, Other)
- file_path: String (Path to the file if digital)
- file_hash: String (For integrity verification)
- file_size: Integer
- mime_type: String
- original_filename: String
- custody_chain: JSON (Chain of custody information)
- collection_date: DateTime
- collection_location: String
- collected_by: UUID (Foreign Key to users)
- status: Enum (Collected, Processed, Analyzed, Archived)
- tags: Array of Strings
- ocr_text: Text (Extracted text from documents/images)
- transcription: Text (For audio/video files)
- vector_embedding: Vector (For semantic search)
- created_at: DateTime
- updated_at: DateTime
- created_by: UUID (Foreign Key to users)
```

### 4. Timeline Events

Events that occurred during the case, used for timeline visualization.

```
Table: timeline_events
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- title: String
- description: Text
- event_type: String (Category of event)
- event_date: DateTime
- event_end_date: DateTime (Optional, for events with duration)
- location: String
- persons_involved: Array of UUIDs (Foreign Keys to persons)
- evidence_linked: Array of UUIDs (Foreign Keys to evidence)
- importance: Enum (Low, Medium, High, Critical)
- confidence: Float (0-1, confidence in the event's accuracy)
- source: String (Source of the event information)
- notes: Text
- created_at: DateTime
- updated_at: DateTime
- created_by: UUID (Foreign Key to users)
- is_ai_generated: Boolean (Whether the event was suggested by AI)
- vector_embedding: Vector (For semantic search and relationship analysis)
```

### 5. Notes

Investigator notes related to the case.

```
Table: notes
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- title: String
- content: Text
- category: String
- tags: Array of Strings
- related_evidence: Array of UUIDs (Foreign Keys to evidence)
- related_persons: Array of UUIDs (Foreign Keys to persons)
- related_events: Array of UUIDs (Foreign Keys to timeline_events)
- created_at: DateTime
- updated_at: DateTime
- created_by: UUID (Foreign Key to users)
- vector_embedding: Vector (For semantic search)
```

### 6. Users

Users of the system, including investigators and collaborators.

```
Table: users
- id: UUID (Primary Key)
- username: String (Unique)
- email: String (Unique)
- password_hash: String
- full_name: String
- role: Enum (Administrator, Investigator, Analyst, Viewer)
- department: String
- badge_number: String (Optional)
- contact_info: JSON (Phone, address)
- created_at: DateTime
- updated_at: DateTime
- last_login: DateTime
- is_active: Boolean
```

### 7. Case Access

Tracks which users have access to which cases for collaboration.

```
Table: case_access
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- user_id: UUID (Foreign Key to users)
- access_level: Enum (Read, Write, Admin)
- granted_at: DateTime
- granted_by: UUID (Foreign Key to users)
- expires_at: DateTime (Optional)
- is_active: Boolean
```

### 8. AI Analysis

Stores AI-generated insights and analysis from Claude API.

```
Table: ai_analysis
- id: UUID (Primary Key)
- case_id: UUID (Foreign Key to cases)
- analysis_type: Enum (Timeline, Relationships, Evidence, Summary, Recommendation)
- content: Text (The AI-generated analysis)
- confidence_score: Float (0-1)
- generated_at: DateTime
- prompt_used: Text (The prompt sent to Claude API)
- model_version: String (Version of Claude used)
- related_evidence: Array of UUIDs (Foreign Keys to evidence)
- related_persons: Array of UUIDs (Foreign Keys to persons)
- related_events: Array of UUIDs (Foreign Keys to timeline_events)
- vector_embedding: Vector (For semantic search)
```

### 9. Search Queries

Stores user search queries for future reference and improvement.

```
Table: search_queries
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- case_id: UUID (Foreign Key to cases, optional)
- query_text: String
- query_vector: Vector (Vector representation of the query)
- results_count: Integer
- executed_at: DateTime
- execution_time_ms: Integer
- filters_applied: JSON
```

### 10. Audit Logs

Tracks all actions in the system for accountability and security.

```
Table: audit_logs
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- action: String (Create, Read, Update, Delete, Export, etc.)
- entity_type: String (Case, Evidence, Person, etc.)
- entity_id: UUID
- details: JSON (Additional details about the action)
- ip_address: String
- user_agent: String
- timestamp: DateTime
```

## Vector Database Integration

The schema includes vector embedding fields in several tables to support AI-powered features:

- `persons.vector_embedding`: For relationship analysis and finding connections between people
- `evidence.vector_embedding`: For semantic search across evidence items
- `timeline_events.vector_embedding`: For timeline analysis and event correlation
- `notes.vector_embedding`: For semantic search across investigator notes
- `ai_analysis.vector_embedding`: For retrieving relevant AI insights
- `search_queries.query_vector`: For improving search results over time

These vector embeddings will be generated using Claude API and stored in a vector database for efficient similarity search.

## Relationships

1. A Case has many Persons, Evidence items, Timeline Events, Notes, and AI Analyses
2. A Person belongs to a Case and can be linked to multiple Timeline Events
3. Evidence belongs to a Case and can be linked to multiple Timeline Events and Notes
4. Timeline Events belong to a Case and can be linked to multiple Persons and Evidence items
5. Notes belong to a Case and can reference Evidence, Persons, and Timeline Events
6. Users can have access to multiple Cases through Case Access
7. AI Analysis belongs to a Case and can reference Evidence, Persons, and Timeline Events

## Indexes

To optimize query performance, the following indexes should be created:

1. `cases`: `case_number`, `status`, `created_at`, `assigned_to`
2. `persons`: `case_id`, `role`, `name`
3. `evidence`: `case_id`, `type`, `status`, `collection_date`
4. `timeline_events`: `case_id`, `event_date`, `event_type`, `importance`
5. `notes`: `case_id`, `created_at`, `category`
6. `users`: `username`, `email`, `role`
7. `case_access`: `case_id`, `user_id`, `access_level`
8. `ai_analysis`: `case_id`, `analysis_type`, `generated_at`
9. `search_queries`: `user_id`, `case_id`, `executed_at`
10. `audit_logs`: `user_id`, `entity_type`, `entity_id`, `timestamp`

## Vector Indexes

For efficient similarity search, vector indexes should be created on:

1. `persons.vector_embedding`
2. `evidence.vector_embedding`
3. `timeline_events.vector_embedding`
4. `notes.vector_embedding`
5. `ai_analysis.vector_embedding`
6. `search_queries.query_vector`
