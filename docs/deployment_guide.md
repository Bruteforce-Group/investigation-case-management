# Deployment Guide for Investigation Case Management Web Application

This document outlines the steps to deploy the Investigation Case Management Web Application to a production environment using Vercel.

## Prerequisites

- GitHub account
- Vercel account (can sign up with GitHub)
- PostgreSQL database with pgvector extension (we'll use Neon.tech)

## Step 1: Prepare the Database

1. Create a PostgreSQL database with pgvector extension:
   - Sign up for an account at [Neon.tech](https://neon.tech)
   - Create a new project
   - Create a new database
   - Enable the pgvector extension

2. Get your database connection string:
   - In your Neon dashboard, go to the "Connection Details" section
   - Copy the connection string (it should look like `postgresql://user:password@host:port/database`)

## Step 2: Configure Environment Variables

Create a `.env.production` file with the following variables:

```
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
NEXTAUTH_SECRET="your-secure-nextauth-secret"
NEXTAUTH_URL="https://your-production-domain.com"

# Claude API
CLAUDE_API_KEY="your-claude-api-key"

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket-name"
```

## Step 3: Prepare for Deployment

1. Update the `next.config.js` file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-s3-bucket-name.s3.amazonaws.com'],
  },
  // Add any other production-specific configurations
};

module.exports = nextConfig;
```

2. Create a `vercel.json` file in the root directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Step 4: Push to GitHub

1. Initialize a Git repository (if not already done):
   ```bash
   git init
   ```

2. Create a `.gitignore` file:
   ```
   # dependencies
   /node_modules
   /.pnp
   .pnp.js

   # testing
   /coverage

   # next.js
   /.next/
   /out/

   # production
   /build

   # misc
   .DS_Store
   *.pem

   # debug
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   # local env files
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local

   # vercel
   .vercel
   ```

3. Add, commit, and push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/investigation-case-management.git
   git push -u origin main
   ```

## Step 5: Deploy to Vercel

1. Sign in to [Vercel](https://vercel.com) with your GitHub account

2. Click "New Project"

3. Import your GitHub repository

4. Configure the project:
   - Set the Framework Preset to "Next.js"
   - Add all environment variables from your `.env.production` file
   - Configure any additional settings as needed

5. Click "Deploy"

6. Wait for the deployment to complete

7. Once deployed, Vercel will provide you with a production URL (e.g., `https://investigation-case-management.vercel.app`)

## Step 6: Run Database Migrations

After deployment, you need to run the database migrations:

1. From your local development environment, run:
   ```bash
   npx prisma migrate deploy
   ```

   Make sure your `DATABASE_URL` is set to your production database.

2. Alternatively, you can run migrations through Vercel CLI:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

## Step 7: Verify Deployment

1. Visit your production URL
2. Test key functionality:
   - User registration and login
   - Case creation and management
   - Evidence upload and management
   - Timeline visualization
   - Analysis generation

## Step 8: Set Up Monitoring and Analytics

1. Set up Vercel Analytics to monitor performance and usage

2. Configure error tracking with a service like Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

   Then follow Sentry's setup instructions for Next.js

3. Set up regular database backups for your PostgreSQL database

## Step 9: Configure Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Step 10: Set Up CI/CD (Optional)

Vercel automatically deploys when you push to your GitHub repository, but you can enhance the CI/CD pipeline:

1. Create a `.github/workflows/ci.yml` file for GitHub Actions:
   ```yaml
   name: CI

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - name: Install dependencies
           run: npm ci
         - name: Run linter
           run: npm run lint
         - name: Run tests
           run: npm test
   ```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible from Vercel's servers
- Check that the pgvector extension is enabled

### Deployment Failures

- Check Vercel build logs for errors
- Verify all environment variables are set correctly
- Ensure your Next.js configuration is compatible with Vercel

### Performance Issues

- Enable Vercel Edge Functions for improved performance
- Optimize database queries
- Implement caching strategies

## Maintenance

1. Regularly update dependencies:
   ```bash
   npm update
   ```

2. Monitor error logs in Vercel dashboard

3. Perform regular database maintenance

4. Set up automated backups

## Security Considerations

1. Regularly rotate API keys and secrets

2. Enable Two-Factor Authentication for your Vercel and GitHub accounts

3. Regularly audit user access and permissions

4. Keep all dependencies updated to patch security vulnerabilities

## Scaling

As your application grows, consider:

1. Upgrading your database plan for increased capacity

2. Implementing caching strategies

3. Using Vercel Edge Functions for improved global performance

4. Setting up a CDN for static assets

## Conclusion

Your Investigation Case Management Web Application is now deployed and accessible to users. Regular monitoring and maintenance will ensure it continues to perform optimally and securely.
