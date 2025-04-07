# Investigation Case Management Web Application

A comprehensive web-based solution for investigators to manage cases, evidence, timelines, and analysis.

## Features

- Modern user interface with responsive design
- Comprehensive case management
- Advanced evidence management with OCR capabilities
- Dynamic timeline visualization
- AI-powered storyline analysis using Claude API
- Vector database integration for semantic search
- Robust error handling and validation
- Secure user authentication and authorization

## Technology Stack

- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Prisma
- **Authentication**: Custom JWT-based authentication
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher with pgvector extension
- Claude API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bruteforce-group/investigation-case-management.git
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

## Documentation

- [User Manual](docs/user_manual.md)
- [Developer Guide](docs/developer_guide.md)
- [Deployment Guide](docs/deployment_guide.md)
- [Test Plan](docs/test_plan.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
