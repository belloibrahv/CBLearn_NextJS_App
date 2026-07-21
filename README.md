# CBLearn — Computer-Based Learning System

A full-stack Next.js application built for the final year project "Development and
Evaluation of a Computer-Based Learning System for Enhancing the Academic Performance
of University Students."

## Tech Stack

- Framework: Next.js 16 (App Router, React Server Components)
- Database: SQLite for local development, PostgreSQL for production (Render) — same
  code, switched automatically by the DATABASE_URL environment variable
- Auth: bcrypt password hashing + JWT session cookies (httpOnly)
- UI: Material Design 3 tokens (color, elevation, shape, typography), Google
  Material Symbols icons, Google Fonts (Roboto, Roboto Serif), loaded via Google's CDN
- Deployment target: Render (render.yaml blueprint included)

## Local Development

```bash
npm install
npm run db:seed    # creates data/cblearn.db and seeds course content + an admin account
npm run dev
```

Open http://localhost:3000. Register a new student account, or sign in as the seeded
administrator:

- Matric number: ADMIN/0001
- Password: admin123

## Project Structure

```
src/
  app/
    api/            -> REST API routes (auth, modules, lessons, quiz, progress, admin)
    login/  register/            -> auth pages (client components)
    dashboard/  modules/[id]/  lessons/[id]/  progress/  admin/
                -> app pages (server components, query the DB directly)
  components/       -> TopNav, QuizPanel (client components)
  db/               -> schema.sqlite.sql, schema.postgres.sql, index.js (query layer), seed.js
  lib/              -> auth.js (hashing/JWT), session.js (getCurrentUser)
```

## Deploying to Render

1. Push this project to a GitHub repository.

2. Create a PostgreSQL database on Render:
   - Render Dashboard -> New -> PostgreSQL -> give it a name (e.g. cblearn-db) -> Create.
   - Copy the Internal Database URL once it's provisioned.

3. Create a Web Service on Render:
   - Render Dashboard -> New -> Web Service -> connect your GitHub repo.
   - Runtime: Node
   - Build Command: npm install && npm run build
   - Start Command: npm run start
   - Add environment variables:
     - DATABASE_URL = the Internal Database URL from step 2
     - JWT_SECRET = any long random string
     - NODE_VERSION = 22.22.2

   Alternatively, if you keep render.yaml at the project root, Render can create both
   the database and the web service together via New -> Blueprint.

4. Seed the production database (one-time, after first successful deploy):
   - Render Dashboard -> your web service -> Shell tab -> run:
     ```bash
     npm run db:seed
     ```
   This creates the tables and inserts the course modules, lessons, quizzes and the
   admin account in your Render Postgres database.

5. Visit the live URL Render gives you. The app should behave identically to the local
   version, now backed by PostgreSQL instead of SQLite.

## Notes and Honest Limitations

- The PostgreSQL code path (src/db/index.js, src/db/seed.js) was written and
  reviewed carefully to mirror the SQLite path exactly, but it has not been tested
  against a live PostgreSQL server in development, because a PostgreSQL server could
  not be installed in the development sandbox used to build this project. Test it
  thoroughly against your Render Postgres instance after the first deploy, and treat
  step 4 above as the actual first real test of that code path.
- The SQLite path has been fully tested end-to-end: registration, login, session
  cookies, lesson/quiz retrieval, server-side quiz scoring, progress tracking, and the
  admin overview were all verified against a running local server.
- Passwords are hashed with bcrypt; quiz answers and scoring happen entirely server-side
  so a student cannot see correct answers before submitting or forge a score from the
  browser.
