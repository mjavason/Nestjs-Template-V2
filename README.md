# Nestjs-Template-V2

An all new and improved NestJS template. Supports JWT auth, Swagger docs, Zod validation, Mongoose ORM, env handling, emails, structured logging, S3/Minio file uploads, and more.

## Features

- **JWT-based Authentication**: Secure, stateful authentication using JSON web tokens.
- **OAuth Integration (Google)**: OAuth 2.0 support for Google social login.
- **Swagger Documentation**: Automatically generated API documentation.
- **Validation**: Input validation using `zod`.
- **Logging**: Structured logging using `pino`, integrated with Sentry for error tracking.
- **Mongoose ORM**: MongoDB integration via Mongoose.
- **Environment Variables**: `.env`-based configuration.
- **File Handling**: File uploads with support for cloudinary and S3 storage.
- **Email Support**: Email service for notifications or transactional messages.
- **Telegram Bot Error Monitoring**: Integration with Telegram Monitor Bot for error notifications.

## Prerequisites

- Node.js
- npm
- GitHub CLI (`gh`)

## Installation

```bash
git clone https://github.com/mjavason/nest.js-template-app.git
cd nest.js-template-app
npm install
````

## Setup GitHub Secrets

To ensure GitHub Actions run successfully, you must upload environment variables as GitHub secrets.

1. Install the GitHub CLI: [https://cli.github.com/](https://cli.github.com/)
2. Authenticate with `gh auth login`
3. Run the script below from the project root:

```powershell
.\upload-env.ps1
```

This will read your local `.env` file and upload all variables as secrets to your GitHub repository.

## Running the app

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

Ensure your `.env` file is configured properly.

## Environment Variables

The app uses environment variables to configure various settings. Check the `.env.sample` file for some key variables you might need to set up.

## Test

```bash
# Unit tests
npm run test

# End-to-End tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Project Structure

```
src/
├── app/                      # Core modules and middleware
├── common/                   # Shared decorators, guards, interceptors, schemas
├── configs/                  # Logger, mail, swagger, sentry, firebase configs
├── modules/
│   ├── auth/                 # Authentication logic
│   ├── mail/                 # Email sending and templating
│   ├── user/                 # User and role management
│   ├── db/                   # Database connection
│   ├── seed/                 # Seeding logic
│   └── organizations/        # Organization-related schemas
├── utils/                    # Utility functions
├── main.ts                   # Entry point
test/                         # E2E and unit tests
.env.example                  # Sample env config
```

## Contributing
Open a pull request or submit an issue to suggest improvements or report problems.
