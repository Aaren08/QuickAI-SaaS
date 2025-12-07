# QuickAI (QuickAI-SaaS)

Comprehensive documentation for the QuickAI full-stack project (PERN-style + React/Vite frontend). This README explains the architecture, required environment variables, how to run the app locally, the available API endpoints, file upload handling, deployment notes, and troubleshooting tips.

## Table of contents

- Project overview
- Architecture & key technologies
- Quick start (Windows PowerShell)
- Environment variables
- Backend — design & API reference
- Frontend — structure & runtime
- Database / schema notes
- Files/uploads & limits
- Security, billing & quota notes
- Troubleshooting & common errors
- Next steps and suggestions

## Project overview

QuickAI is a small AI-powered SaaS that provides multiple AI features:

- Article generation
- Blog title generation
- Image generation (via a paid service)
- Background removal and object removal (Cloudinary + transformations)
- Resume review (PDF/DOCX/TXT -> AI analysis)

The backend is an Express (ESM) server using Clerk for authentication, Neon (@neondatabase/serverless) for PostgreSQL access, Cloudinary for image hosting/processing, and OpenAI/Google Gemini/ClipDrop APIs for AI features. The frontend is built with React + Vite and Clerk React for auth on the client.

## Architecture & key technologies

- Backend: Node 18+ (ESM), Express 5, Clerk (auth), Neon/Postgres, Cloudinary, OpenAI (Gemini), ClipDrop, Multer (file upload)
- Frontend: React 19, Vite, Clerk React, Tailwind (CSS is present in the repo), axios for API calls
- Hosting: Backend can run on any Node host (Heroku, Railway, Fly, Vercel Serverless functions with adaptation). Database: Neon/Postgres. Cloudinary for media.

## Quick start (Windows PowerShell)

1. Copy environment variables into backend and frontend (see the `Environment variables` section).
2. Install dependencies and run backend and frontend.

Run in two terminals (PowerShell):

```powershell
# Backend
cd "your_desired_path\backend"
npm install
npm run server

# Frontend (new terminal)
cd "your_desired_path\frontend"
npm install
npm run dev
```

Notes:

- Backend uses `nodemon` for `npm run server`. Use `npm start` to run once.
- Frontend expects `VITE_BASE_URL` and `VITE_CLERK_PUBLISHABLE_KEY` in `vite` environment variables (see below).

## Environment variables

Create a `.env` in `backend/` and a `.env` (or `.env.local`) in `frontend/` with the following keys.

Backend (.env)

- PORT (optional, default 5000)
- DATABASE_URL - Neon/Postgres connection string
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLIPDROP_API_KEY - (used for text-to-image service)
- GEMINI_API_KEY - API key used to call Gemini-style model via the `openai` client wrapper in code
- (Any Clerk server-side secret configuration if required by Clerk setup)

Frontend (Vite environment variables; put in `.env` or `.env.local` at `frontend/`)

- VITE_BASE_URL - e.g. `http://localhost:5000`
- VITE_CLERK_PUBLISHABLE_KEY - Clerk publishable key used by the client

Security note: Never commit API keys or secrets. Use CI/CD secret stores for deployment.

## Backend — design & API reference

Entry point: `backend/server.js`

- `server.js` mounts:
  - `clerkMiddleware()` globally
  - `requireAuth()` (from Clerk) globally — routes are protected
  - `/api/ai` -> AI feature routes (see below)
  - `/api/user` -> User and creation-related routes

Auth & plan handling:

- All routes require Clerk authentication. The code also uses an additional `auth` middleware (`middlewares/auth.js`) to determine whether the user has a premium plan and to manage a `free_usage` counter stored in Clerk user private metadata.

Routes (summary)

AI Routes (`/api/ai` in `backend/routes/aiRoutes.js`):

- POST /api/ai/generate-article

  - Auth: required
  - Body: { prompt: string, length?: number }
  - Notes: Free users are rate-limited by `free_usage` (max 10). Premium users have no limit in code.

- POST /api/ai/generate-blog-title

  - Auth: required
  - Body: { prompt: string }

- POST /api/ai/generate-image

  - Auth: required
  - Body: { prompt: string, publish?: boolean }
  - Notes: Only available to `premium` plan in controller. The controller calls ClipDrop text-to-image and uploads to Cloudinary.

- POST /api/ai/remove-image-background

  - Auth: required
  - Form-Data: `image` file
  - Notes: Uses Cloudinary background removal via upload transformation. Premium-only.

- POST /api/ai/remove-image-object

  - Auth: required
  - Form-Data: `image` file, Body: { object: string }
  - Notes: Uploads image and uses Cloudinary transformation `gen_remove:${object}`. Premium-only.

- POST /api/ai/resume-review
  - Auth: required
  - Form-Data: `resume` file (pdf/docx/txt)
  - Notes: File size must be <= 5MB (controller check). Premium-only. Extracts text using `pdf-parse`, `mammoth`, or plain text, classifies and then asks Gemini to review.

User Routes (`/api/user` in `backend/routes/userRoutes.js`):

- GET /api/user/get-user-creations

  - Auth: required
  - Response: list of creations for the authenticated user

- GET /api/user/get-publish-creations

  - Auth: required
  - Response: published creations from all users

- POST /api/user/toggle-like-and-unlike
  - Auth: required
  - Body: { id: creationId }
  - Notes: The `likes` column is stored as a Postgres text array and updated via database query.

Response format

- Most endpoints respond with JSON: { success: boolean, content?: any, message?: string }

Error handling

- Controllers log `error.message` and return a 500 with the message. Authentication errors from Clerk return 401 from `middlewares/auth.js`.

## Frontend — structure & runtime

Entry: `frontend/src/main.jsx` -> `App.jsx`

Important pages/components:

- `GenerateImages.jsx` — calls `/api/ai/generate-image` using `axios` with Authorization header from Clerk's `getToken()`.
- `RemoveBackground.jsx` — posts image file as FormData to `/api/ai/remove-image-background`.
- `ReviewResume.jsx` — posts resume files to `/api/ai/resume-review` and renders returned markdown with `react-markdown`.

Axios base URL

- The frontend sets `axios.defaults.baseURL = import.meta.env.VITE_BASE_URL` in several files. Ensure `VITE_BASE_URL` points to the running backend.

Auth on client

- `ClerkProvider` is configured in `main.jsx` with the publishable key from `VITE_CLERK_PUBLISHABLE_KEY`.

## Database / schema notes

The app uses Neon/Postgres via `@neondatabase/serverless`. The code expects a `creations` table. A minimal suggested schema (run in your Postgres/Neon console) to match controller usage:

```sql
CREATE TABLE creations (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  prompt text,
  content text,
  type text,
  publish boolean DEFAULT false,
  likes text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);
```

Adjust types/constraints to your needs (e.g., use uuid for ids if desired).

## File uploads and multer

- Backend uses `multer.diskStorage({})` with no destination, so files are stored in a temporary path (default behavior creates a `path` on the file object). The controllers read files synchronously (fs.readFileSync) and upload to Cloudinary or parse them.
- Resume constraints: controller enforces `resume.size <= 5 * 1024 * 1024` (5 MB).
- Accepted resume formats: `.pdf`, `.docx`, `.txt`. If a different extension is uploaded, the controller rejects it.

Security & hygiene:

- Remove or rotate any files written to disk if you enable persistent storage. Consider streaming uploads straight to Cloudinary or to a temporary container in production.

## Security, billing & quota notes

- The project relies on third-party paid APIs (Cloudinary transformations, ClipDrop, Gemini/OpenAI). Ensure billing and quotas are active for premium features.
- The code gates premium-only features in several controllers (image generation, background removal, resume review). The `auth` middleware reads Clerk metadata to determine plan and `free_usage` counts.
- `free_usage` default limit (as enforced in controllers) is 10 uses for non-premium users. The middleware attempts to store `privateMetadata.free_usage` in Clerk for free users.

## Troubleshooting & common errors

- Missing publishable key in frontend: `main.jsx` throws if `VITE_CLERK_PUBLISHABLE_KEY` is not set. Ensure it is configured.
- Backend errors calling ClipDrop/Cloudinary/Gemini: check env keys and that your network can reach the external APIs. Look at server logs (console) for `error.message`.
- Database connection errors: verify `DATABASE_URL` and that Neon/Postgres accepts connections from your host.
- Large file upload failures: ensure client sends FormData correctly and Content-Type is set by the browser (do not override `Content-Type` when sending FormData).

Example curl (developer/testing) — NOTE: requires a valid Clerk-issued token. The frontend uses `getToken()` to obtain one. This curl shows structure only:

```bash
curl -X POST "http://localhost:5000/api/ai/generate-article" \
  -H "Authorization: Bearer <CLERK_JWT_OR_SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a 300-word article about climate tech","length":300}'
```

If you need to test APIs without Clerk tokens during development, temporarily comment out `app.use(requireAuth());` in `backend/server.js` and add route-specific checks. Do not do this in production.

## Next steps & suggestions

- Add automated tests for controllers (supertest + jest) to verify key endpoints and file handling.
- Add CI/CD deployment pipeline with secret management for the keys.
- Improve rate-limiting and add usage analytics for billing and cost protections.
- Add a Postgres migration tool (e.g., `node-pg-migrate` or `knex`) and include schema migrations rather than relying on hand-run SQL.

---
