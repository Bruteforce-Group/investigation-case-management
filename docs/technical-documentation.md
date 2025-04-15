# Case Management System - Technical Documentation

## System Architecture

The Case Management System is built using a modern web application architecture with the following components:

### Frontend
- **Framework**: React.js with React Router for navigation
- **UI Components**: Material-UI (MUI) for consistent design
- **State Management**: React Context API for global state
- **Real-time Updates**: Socket.io for live updates
- **HTTP Client**: Axios for API communication

### Backend
- **Server**: Node.js with Express.js
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL with pgvector extension via Neon.tech
- **File Storage**: Organized file system with compression
- **AI Integration**: OpenAI API for evidence analysis

### Deployment
- **Hosting**: Vercel for both frontend and backend
- **Database**: Neon.tech PostgreSQL
- **Domain**: Subdomain of bozza.au

## Database Schema

### Users
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Cases
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `title`: String
- `description`: Text
- `type`: String
- `priority`: String
- `status`: String
- `tags`: Array of Strings
- `summary`: Text (AI-generated)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Evidence
- `id`: UUID (Primary Key)
- `caseId`: UUID (Foreign Key)
- `title`: String
- `description`: Text
- `type`: String
- `fileType`: String
- `filePath`: String
- `fileSize`: Number
- `dateTime`: Timestamp (When evidence was created/collected)
- `location`: Object (latitude, longitude, address)
- `metadata`: JSON
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### TimelineEvents
- `id`: UUID (Primary Key)
- `caseId`: UUID (Foreign Key)
- `evidenceId`: UUID (Foreign Key, nullable)
- `title`: String
- `description`: Text
- `dateTime`: Timestamp
- `importance`: Number
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Analysis
- `id`: UUID (Primary Key)
- `caseId`: UUID (Foreign Key)
- `type`: String (summary, connection, lead, timeline)
- `content`: Text
- `relatedEvidenceIds`: Array of UUIDs
- `confidence`: Number
- `vector`: Vector (for similarity search)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Reports
- `id`: UUID (Primary Key)
- `caseId`: UUID (Foreign Key)
- `userId`: UUID (Foreign Key)
- `title`: String
- `type`: String
- `content`: Text
- `filePath`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Cases
- `GET /api/cases` - Get all cases for current user
- `POST /api/cases` - Create a new case
- `GET /api/cases/:id` - Get case by ID
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/cases/:id/summary` - Get AI-generated case summary

### Evidence
- `GET /api/cases/:caseId/evidence` - Get all evidence for a case
- `POST /api/cases/:caseId/evidence` - Add evidence to a case
- `GET /api/evidence/:id` - Get evidence by ID
- `PUT /api/evidence/:id` - Update evidence
- `DELETE /api/evidence/:id` - Delete evidence
- `GET /api/evidence/:id/file` - Download evidence file

### Timeline
- `GET /api/cases/:caseId/timeline` - Get timeline for a case
- `POST /api/cases/:caseId/timeline` - Add manual timeline event
- `GET /api/timeline/:id` - Get timeline event by ID
- `PUT /api/timeline/:id` - Update timeline event
- `DELETE /api/timeline/:id` - Delete timeline event
- `GET /api/cases/:caseId/timeline/analysis` - Get timeline analysis

### Analysis
- `GET /api/cases/:caseId/analysis` - Get all analysis for a case
- `GET /api/cases/:caseId/analysis/connections` - Get evidence connections
- `GET /api/cases/:caseId/analysis/leads` - Get investigative leads
- `POST /api/cases/:caseId/analysis/refresh` - Refresh AI analysis

### Reports
- `GET /api/cases/:caseId/reports` - Get all reports for a case
- `POST /api/cases/:caseId/reports` - Generate a new report
- `GET /api/reports/:id` - Get report by ID
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/:id/download` - Download report file

## AI Integration

The system integrates with OpenAI's API to provide the following AI-powered features:

### Case Summary Generation
- Automatically generates a comprehensive summary of the case
- Updates in real-time as new evidence is added
- Identifies key facts and important details

### Evidence Connection Analysis
- Identifies potential connections between different pieces of evidence
- Assigns confidence scores to connections
- Provides explanations for identified connections

### Investigative Lead Generation
- Suggests potential leads based on evidence analysis
- Prioritizes leads based on relevance and importance
- Recommends specific actions for each lead

### Timeline Analysis
- Identifies gaps and inconsistencies in the timeline
- Suggests potential explanations for timeline issues
- Highlights important events and patterns

## Real-time Updates

The system uses Socket.io to provide real-time updates for:

- New evidence additions
- Timeline changes
- AI analysis updates
- Case status changes
- Notifications

## File Storage System

Evidence files are stored in an organized directory structure:

```
/uploads
  /documents
    /{caseId}
      /{timestamp}-{filename}
  /images
    /{caseId}
      /{timestamp}-{filename}
  /videos
    /{caseId}
      /{timestamp}-{filename}
  /audio
    /{caseId}
      /{timestamp}-{filename}
  /other
    /{caseId}
      /{timestamp}-{filename}
```

Text-based files are automatically compressed using gzip to save storage space.

## Security Features

### Authentication
- JWT-based authentication with token expiration
- Secure password hashing using bcrypt
- Role-based access control

### API Security
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration

### Data Protection
- HTTPS for all communications
- Secure headers configuration
- Database connection encryption

## Performance Optimizations

### Database Optimizations
- Indexes on frequently queried fields
- Efficient query patterns
- Connection pooling

### API Response Optimizations
- Response compression
- Pagination for list endpoints
- Field selection to reduce response size

### Frontend Optimizations
- React.memo for pure components
- Service worker for offline capabilities
- Optimized image loading

## Deployment Configuration

See the deployment documentation for detailed information on:
- Vercel configuration
- Database setup
- Environment variables
- Domain configuration

## Extending the System

### Adding New Evidence Types
1. Update the Evidence model to include the new type
2. Add appropriate validation in the evidence controller
3. Create a new file handler in the fileManager utility
4. Update the frontend to support the new evidence type

### Creating Custom Reports
1. Add a new report type in the Report model
2. Create a report template in the reportTemplates directory
3. Implement the report generation logic in the reports controller
4. Add the new report option to the frontend

### Integrating Additional AI Features
1. Create a new service in the backend/services directory
2. Add the necessary API endpoints in the appropriate controller
3. Update the frontend to display the new AI features
4. Add documentation for the new features

## Troubleshooting

### Common Backend Issues
- Database connection errors: Check DATABASE_URL environment variable
- File upload issues: Verify upload directory permissions
- AI analysis failures: Check OPENAI_API_KEY and API quotas

### Common Frontend Issues
- API connection errors: Check API_URL environment variable
- Authentication issues: Clear browser storage and retry
- Real-time update problems: Check socket connection

## Development Guidelines

### Coding Standards
- Use ESLint for code linting
- Follow the Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow
- Use feature branches for new features
- Create pull requests for code review
- Write descriptive commit messages
- Tag releases with semantic versioning

### Testing
- Write unit tests for critical functions
- Perform integration testing for API endpoints
- Test across different browsers and devices
- Conduct security testing regularly
