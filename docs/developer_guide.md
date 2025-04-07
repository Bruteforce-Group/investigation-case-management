# Developer Documentation for Investigation Case Management Web Application

## Technical Overview

This document provides technical details for developers working on the Investigation Case Management Web Application. It covers the architecture, code organization, development workflow, and deployment process.

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Context API
- **Form Handling**: Custom hooks with Zod validation
- **Database**: PostgreSQL 14 with pgvector extension
- **ORM**: Prisma
- **Authentication**: Custom JWT-based auth
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel (or self-hosted)

## Project Structure

```
investigation_web_app_nextjs/
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── cases/           # Case management pages
│   │   ├── evidence/        # Evidence management pages
│   │   ├── timeline/        # Timeline visualization pages
│   │   ├── analysis/        # Analysis pages
│   │   ├── login/           # Authentication pages
│   │   └── register/        # User registration
│   ├── components/          # Reusable React components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Common UI components
│   │   ├── evidence/        # Evidence-related components
│   │   ├── layout/          # Layout components
│   │   ├── storyline/       # Storyline analysis components
│   │   └── timeline/        # Timeline components
│   ├── contexts/            # React context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── hooks/               # Custom React hooks
│   │   └── useFormValidation.ts # Form validation hook
│   └── lib/                 # Utility functions and services
│       ├── db/              # Database access layer
│       └── validation.ts    # Validation schemas
├── docs/                    # Documentation
├── .env                     # Environment variables (gitignored)
├── .env.example             # Example environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## Core Components

### Database Layer

The database layer uses Prisma ORM to interact with PostgreSQL. The schema is defined in `prisma/schema.prisma` and includes models for cases, evidence, timeline events, persons, locations, and more.

Key database files:
- `src/lib/db/prisma.ts`: Prisma client singleton
- `src/lib/db/case.ts`: Case-related database operations
- `src/lib/db/evidence.ts`: Evidence-related database operations
- `src/lib/db/timeline.ts`: Timeline-related database operations
- `src/lib/db/vector.ts`: Vector search operations using pgvector
- `src/lib/db/claude.ts`: Claude API integration for analysis

### Authentication

Authentication is implemented using a custom JWT-based solution with the React Context API:

- `src/contexts/AuthContext.tsx`: Provides authentication state and methods
- `src/components/auth/AuthGuard.tsx`: Route protection component
- `src/app/login/page.tsx`: Login page
- `src/app/register/page.tsx`: Registration page
- `src/app/reset-password/page.tsx`: Password reset page

### Form Validation

Form validation uses Zod schemas with custom React hooks:

- `src/hooks/useFormValidation.ts`: Form validation hook
- `src/lib/validation.ts`: Zod validation schemas

### Error Handling

Error handling is implemented with several components:

- `src/components/common/ErrorBoundary.tsx`: React error boundary
- `src/components/common/Alert.tsx`: Alert component for notifications
- `src/components/common/ApiError.tsx`: API error display component

### UI Components

Key UI components include:

- `src/components/timeline/TimelineVisualization.tsx`: Interactive timeline
- `src/components/evidence/EvidenceManagement.tsx`: Evidence management
- `src/components/evidence/EvidenceUpload.tsx`: Evidence upload form
- `src/components/storyline/StorylineAnalysis.tsx`: AI-powered analysis
- `src/components/storyline/RelationshipAnalysis.tsx`: Relationship analysis

## Development Workflow

### Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/investigation_db"
   CLAUDE_API_KEY="your-claude-api-key"
   JWT_SECRET="your-jwt-secret"
   ```
4. Initialize the database: `npx prisma migrate dev`
5. Start the development server: `npm run dev`

### Adding a New Feature

1. Create necessary database models in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name feature_name` to generate migrations
3. Implement database operations in `src/lib/db/`
4. Create UI components in `src/components/`
5. Add pages in `src/app/`
6. Update documentation

### Code Style and Best Practices

- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use Tailwind CSS for styling
- Implement proper error handling
- Write unit tests for critical functionality
- Document code with JSDoc comments

## API Reference

The application exposes a RESTful API through Next.js API routes:

### Authentication API

- `POST /api/auth/login`: Authenticate user
  - Request: `{ email: string, password: string }`
  - Response: `{ user: User, token: string }`

- `POST /api/auth/register`: Register new user
  - Request: `{ name: string, email: string, password: string, role: UserRole }`
  - Response: `{ user: User, token: string }`

- `POST /api/auth/reset-password`: Request password reset
  - Request: `{ email: string }`
  - Response: `{ success: boolean }`

### Case API

- `GET /api/cases`: Get all cases
  - Query params: `{ status?: CaseStatus, priority?: CasePriority, page?: number, limit?: number }`
  - Response: `{ cases: Case[], total: number, page: number, limit: number }`

- `GET /api/cases/:id`: Get case by ID
  - Response: `{ case: Case }`

- `POST /api/cases`: Create new case
  - Request: `{ title: string, description?: string, status: CaseStatus, priority: CasePriority, startDate: string, endDate?: string }`
  - Response: `{ case: Case }`

- `PUT /api/cases/:id`: Update case
  - Request: `{ title?: string, description?: string, status?: CaseStatus, priority?: CasePriority, startDate?: string, endDate?: string }`
  - Response: `{ case: Case }`

- `DELETE /api/cases/:id`: Delete case
  - Response: `{ success: boolean }`

### Evidence API

- `GET /api/evidence`: Get all evidence
  - Query params: `{ caseId?: string, type?: EvidenceType, page?: number, limit?: number }`
  - Response: `{ evidence: Evidence[], total: number, page: number, limit: number }`

- `GET /api/evidence/:id`: Get evidence by ID
  - Response: `{ evidence: Evidence }`

- `POST /api/evidence`: Add new evidence
  - Request: Multipart form data with evidence details and file
  - Response: `{ evidence: Evidence }`

- `PUT /api/evidence/:id`: Update evidence
  - Request: `{ title?: string, description?: string, evidenceType?: EvidenceType, collectionDate?: string, collectionLocation?: string }`
  - Response: `{ evidence: Evidence }`

- `DELETE /api/evidence/:id`: Delete evidence
  - Response: `{ success: boolean }`

### Timeline API

- `GET /api/timeline`: Get timeline events
  - Query params: `{ caseId: string, startDate?: string, endDate?: string, importance?: number }`
  - Response: `{ events: TimelineEvent[] }`

- `POST /api/timeline`: Create timeline event
  - Request: `{ title: string, description?: string, eventDate: string, endDate?: string, location?: string, importance: number, confidenceLevel: number, caseId: string }`
  - Response: `{ event: TimelineEvent }`

- `PUT /api/timeline/:id`: Update timeline event
  - Request: `{ title?: string, description?: string, eventDate?: string, endDate?: string, location?: string, importance?: number, confidenceLevel?: number }`
  - Response: `{ event: TimelineEvent }`

- `DELETE /api/timeline/:id`: Delete timeline event
  - Response: `{ success: boolean }`

### Analysis API

- `POST /api/analysis/storyline`: Generate storyline analysis
  - Request: `{ caseId: string }`
  - Response: `{ analysis: StorylineAnalysis }`

- `POST /api/analysis/relationships`: Generate relationship analysis
  - Request: `{ caseId: string }`
  - Response: `{ analysis: string }`

- `GET /api/analysis/vector-search`: Perform vector similarity search
  - Query params: `{ query: string, caseId?: string, limit?: number }`
  - Response: `{ results: Array<{ item: any, similarity: number, type: string }> }`

## Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from the Vercel dashboard or via GitHub integration

### Self-Hosted Deployment

1. Set up a server with Node.js and PostgreSQL
2. Install pgvector extension for PostgreSQL
3. Clone the repository and install dependencies
4. Configure environment variables
5. Build the application
6. Use PM2 or similar to manage the Node.js process:
   ```bash
   npm install -g pm2
   pm2 start npm --name "investigation-app" -- start
   ```

## Database Migrations

When changing the database schema:

1. Update `prisma/schema.prisma`
2. Generate a migration:
   ```bash
   npx prisma migrate dev --name migration_name
   ```
3. Apply migration to production:
   ```bash
   npx prisma migrate deploy
   ```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/components/auth/AuthGuard.test.tsx

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- Unit tests: Test individual components and functions
- Integration tests: Test interactions between components
- API tests: Test API endpoints
- End-to-end tests: Test complete user flows

## Troubleshooting

### Common Development Issues

1. **Prisma Client Generation Errors**
   - Run `npx prisma generate` to regenerate the Prisma client

2. **Database Connection Issues**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify database credentials

3. **Next.js Build Errors**
   - Check for TypeScript errors: `npm run type-check`
   - Clear Next.js cache: `rm -rf .next`

4. **API Route Errors**
   - Check API route implementation
   - Verify request/response formats
   - Check authentication middleware

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
