# Backend - Secure Content Workspace

This is the API server for the Secure Content Workspace, built with Node.js, Express, and Prisma.

## Tech Stack
- Node.js & Express
- Prisma ORM
- PostgreSQL (Neon DB)
- JWT for authentication
- Bcrypt for password hashing
- Zod for request validation
- Multer for image uploads

## Project Structure
- prisma/ : Database schema and migrations.
- src/controllers/ : Entry points for API requests.
- src/services/ : Core business logic and database interactions.
- src/middlewares/ : Authentication, role-based authorization, and error handling.
- src/routes/ : API path mapping and middleware integration.
- src/validators/ : Zod schemas for input validation.

## Roles and Permissions
The API enforces three role levels:
1. Admin: Full access to create, update, and delete all content.
2. Editor: Can create articles and edit their own authored articles only.
3. Viewer: Read-only access to published articles.

Permissions are verified through the `authenticate` and `authorize` middlewares before reaching the controller.

## Local Setup

1. Database
- Ensure you have a PostgreSQL instance.
- Create a `.env` file in this directory and set:
  `DATABASE_URL="your_postgres_connection_string"`
- Run `npx prisma db push` to synchronize the database schema.

2. Server
- Run `npm install` to install dependencies.
- Ensure your `.env` also includes:
  `JWT_SECRET="your_secret_key"`
  `PORT=5000`
- Start the development server with `npm run dev`.

## Decisions and Trade-offs

- Image Storage: Images are currently stored in a local folder (`/uploads`). For Vercel deployments, the system defaults to `/tmp` as a temporary buffer. For a permanent production solution, external storage like Cloudinary or S3 is recommended.
- Schema Validation: Zod is used to strictly validate incoming data. This protects the database from malformed inputs even if frontend checks are bypassed.
- Role Enforcement: Permissions are checked at both the service and middleware levels to provide a double layer of security.
