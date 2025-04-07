# Web Architecture for Investigation Case Management Application

## System Architecture Overview

The Investigation Case Management web application follows a modern, cloud-native architecture designed for security, scalability, and performance. The architecture is built around the following key principles:

1. **Separation of Concerns**: Clear separation between frontend, backend, and data layers
2. **API-First Design**: All functionality exposed through well-defined APIs
3. **Serverless Architecture**: Leveraging serverless computing for scalability and reduced maintenance
4. **Edge Computing**: Utilizing edge computing for improved performance and global reach
5. **Security by Design**: Security integrated at all levels of the architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐  │
│  │ React       │    │ State       │    │ Data        │    │ UI       │  │
│  │ Components  │◄───┤ Management  │◄───┤ Fetching    │◄───┤ Services │  │
│  │ (Next.js)   │    │ (Zustand)   │    │ (React      │    │          │  │
│  └─────────────┘    └─────────────┘    │  Query)     │    └──────────┘  │
│                                         └─────────────┘                  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DELIVERY LAYER                                   │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐  │
│  │ Cloudflare  │    │ CDN         │    │ Edge        │    │ Security │  │
│  │ Pages       │────┤ Caching     │────┤ Functions   │────┤ Headers  │  │
│  │             │    │             │    │             │    │          │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────────┘  │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                                │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐  │
│  │ API Routes  │    │ Auth        │    │ Business    │    │ Error    │  │
│  │ (Next.js/   │────┤ Services    │────┤ Logic       │────┤ Handling │  │
│  │  Workers)   │    │ (NextAuth)  │    │ Services    │    │          │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────────┘  │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATION LAYER                                │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐  │
│  │ Database    │    │ Claude API  │    │ File        │    │ External │  │
│  │ Access      │────┤ Integration │────┤ Storage     │────┤ Services │  │
│  │ (Prisma)    │    │             │    │ (R2)        │    │          │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────────┘  │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │ PostgreSQL  │    │ Cloudflare  │    │ Cloudflare  │                  │
│  │ with        │    │ D1          │    │ R2          │                  │
│  │ pgVector    │    │ (SQLite)    │    │ (Storage)   │                  │
│  └─────────────┘    └─────────────┘    └─────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Client Layer

The client layer is responsible for the user interface and client-side functionality.

**Components:**
- **React Components**: UI components built with Next.js and React
- **State Management**: Client-side state managed with Zustand
- **Data Fetching**: Server state managed with React Query
- **UI Services**: Reusable UI services and utilities

**Key Responsibilities:**
- Rendering the user interface
- Managing client-side state
- Handling user interactions
- Communicating with the backend via API
- Client-side validation
- Responsive design adaptation

### 2. Delivery Layer

The delivery layer handles the serving of the application to end users.

**Components:**
- **Cloudflare Pages**: Hosting and delivery of the Next.js application
- **CDN Caching**: Content delivery network for static assets
- **Edge Functions**: Serverless functions running at the edge
- **Security Headers**: HTTP security headers and policies

**Key Responsibilities:**
- Global content delivery
- Static asset optimization
- Edge computing for improved performance
- Security policy enforcement
- DDoS protection
- SSL/TLS termination

### 3. Application Layer

The application layer contains the core business logic and API endpoints.

**Components:**
- **API Routes**: RESTful API endpoints built with Next.js API routes and/or Cloudflare Workers
- **Auth Services**: Authentication and authorization services using NextAuth.js
- **Business Logic Services**: Core application functionality
- **Error Handling**: Centralized error handling and logging

**Key Responsibilities:**
- Processing API requests
- Implementing business rules
- User authentication and authorization
- Input validation
- Error handling and reporting
- Audit logging

### 4. Integration Layer

The integration layer connects the application to databases, external APIs, and other services.

**Components:**
- **Database Access**: Database operations via Prisma ORM
- **Claude API Integration**: Integration with Claude AI services
- **File Storage**: File operations with Cloudflare R2
- **External Services**: Integration with other external services

**Key Responsibilities:**
- Database CRUD operations
- AI analysis requests and processing
- File upload, download, and management
- External API communication
- Data transformation and mapping

### 5. Data Layer

The data layer is responsible for data storage and retrieval.

**Components:**
- **PostgreSQL with pgVector**: Primary database with vector search capabilities
- **Cloudflare D1**: Edge database for global data access
- **Cloudflare R2**: Object storage for files and evidence

**Key Responsibilities:**
- Persistent data storage
- Data integrity and consistency
- Vector similarity search
- File storage
- Backup and recovery

## Key Workflows

### 1. Authentication Flow

```
1. User submits login credentials
2. NextAuth.js validates credentials
3. JWT token is generated and stored in HTTP-only cookie
4. User session is established
5. Protected routes check JWT token for authorization
```

### 2. Case Management Flow

```
1. User creates/edits case via UI
2. React components update client state
3. API request is sent to application layer
4. Business logic validates the request
5. Database operations are performed via Prisma
6. Response is returned to client
7. UI is updated with React Query
```

### 3. Evidence Upload Flow

```
1. User selects file(s) for upload
2. Client validates file type and size
3. File is uploaded directly to R2 storage
4. Metadata is sent to API
5. Database is updated with file reference
6. For applicable files, processing jobs are triggered:
   a. OCR for documents/images
   b. Transcription for audio
   c. Vector embedding generation
7. Processing results are stored in database
8. UI is updated when processing completes
```

### 4. AI Analysis Flow

```
1. User requests analysis of case data
2. API endpoint receives request
3. Relevant case data is gathered from database
4. Data is formatted for Claude API
5. Request is sent to Claude API
6. Response is processed and structured
7. Results are stored in database
8. UI is updated with analysis results
```

### 5. Vector Search Flow

```
1. User enters search query
2. Query is sent to API
3. Text is converted to vector embedding
4. Vector similarity search is performed in pgVector
5. Results are ranked and filtered
6. Response is returned to client
7. UI displays search results
```

## Security Architecture

### Authentication and Authorization

- **JWT-based authentication** via NextAuth.js
- **Role-based access control** for different user types
- **Permission-based authorization** for fine-grained access control
- **Session management** with secure HTTP-only cookies
- **CSRF protection** built into NextAuth.js

### Data Protection

- **End-to-end encryption** for sensitive data
- **TLS/SSL** for all communications
- **Data encryption at rest** in database and file storage
- **Input validation** at multiple levels (client, API, database)
- **Output encoding** to prevent XSS attacks

### Infrastructure Security

- **DDoS protection** via Cloudflare
- **Web Application Firewall** (WAF) rules
- **Rate limiting** for API endpoints
- **Security headers** enforced via Helmet
- **Content Security Policy** (CSP) to prevent injection attacks

### Audit and Compliance

- **Comprehensive audit logging** of all actions
- **User activity tracking**
- **Login attempt monitoring**
- **Anomaly detection** for suspicious activities
- **Regular security scanning** and vulnerability assessment

## Scalability and Performance

### Horizontal Scalability

- **Serverless architecture** scales automatically with demand
- **Stateless API design** allows for easy scaling
- **Edge computing** distributes load globally
- **Connection pooling** for database connections

### Performance Optimization

- **CDN caching** for static assets
- **Edge caching** for API responses where appropriate
- **Optimized database queries** with proper indexing
- **Lazy loading** of components and data
- **Image optimization** via Next.js Image component
- **Code splitting** for reduced bundle sizes

### Database Scalability

- **Read replicas** for scaling read operations
- **Connection pooling** for efficient connection management
- **Indexing strategy** for optimized queries
- **Query optimization** for complex operations
- **Pagination** for large result sets

## Deployment Architecture

### CI/CD Pipeline

```
1. Code is pushed to GitHub repository
2. GitHub Actions workflow is triggered
3. Code is linted and tested
4. Build artifacts are generated
5. Deployment to staging environment
6. Automated tests run against staging
7. Manual approval for production deployment
8. Deployment to production environment
9. Post-deployment verification
```

### Environment Strategy

- **Development**: Local development environment
- **Testing**: Automated test environment
- **Staging**: Pre-production environment
- **Production**: Live environment

### Monitoring and Observability

- **Application monitoring** for performance and errors
- **Database monitoring** for query performance
- **Infrastructure monitoring** for resource utilization
- **User experience monitoring** for client-side performance
- **Alerting system** for critical issues

## Disaster Recovery

- **Regular database backups**
- **Point-in-time recovery** capabilities
- **Multi-region redundancy** for critical components
- **Failover mechanisms** for high availability
- **Incident response plan** for security breaches

## Conclusion

This architecture provides a robust, secure, and scalable foundation for the Investigation Case Management web application. By leveraging modern cloud technologies and following best practices for web application development, the architecture enables the application to meet its functional requirements while ensuring security, performance, and maintainability.

The serverless approach with Cloudflare's ecosystem minimizes operational overhead while providing global reach and excellent performance. The separation of concerns across well-defined layers makes the system easier to develop, test, and maintain over time.
