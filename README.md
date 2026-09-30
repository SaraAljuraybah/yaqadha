# Yaqadha Platform

Yaqadha is a React, Vite, TypeScript, Tailwind CSS, and Express platform for tender risk inspection, document governance, and proactive integrity review.

## Architecture

- Vercel serves the Vite build in `dist/` as static files.
- Vercel runs `api/index.ts` as the platform API function.
- `src/server/app.ts` exports `createApiApp()`, the shared Express API used by both local development and Vercel.
- `server.ts` is the local host only: it loads local `.env`, mounts `createApiApp()`, adds Vite middleware in development, serves `dist/` in production, and listens on `PORT`.
- Render hosts the private Yaqadha risk model API. The browser never calls Render directly; it only calls `/api/risk/*` through the platform API proxy.

## Local Development

Requirements:

- Node.js 22
- npm

Install dependencies:

```bash
npm install
```

Create `.env` locally. Do not commit it:

```bash
YAQADHA_API_BASE_URL=https://your-render-model-service.example.com
YAQADHA_API_KEY=your-private-model-api-key
GEMINI_API_KEY=optional-gemini-key
```

Run the development server:

```bash
npm run dev
```

Open <http://localhost:3000>.

Production-style local run:

```bash
npm run build
npm start
```

## Environment Variables

Server-only variables:

| Variable | Required | Description |
| --- | --- | --- |
| `YAQADHA_API_BASE_URL` | Yes | Base URL for the private Render risk model API. |
| `YAQADHA_API_KEY` | Yes | API key sent server-side to the private risk model. |
| `GEMINI_API_KEY` | No | Enables Gemini analysis for `/api/audit/ai-analyze`; without it, the local rule engine is used. |

Do not prefix secrets with `VITE_`. Vite exposes `VITE_*` values to the client bundle.

## Vercel Deployment

1. Import this repository into Vercel.
2. Keep the default project framework as Vite, or use the included `vercel.json`.
3. Set these Vercel environment variables:
   - `YAQADHA_API_BASE_URL`
   - `YAQADHA_API_KEY`
   - Optional: `GEMINI_API_KEY`
4. Deploy.

The included Vercel configuration uses:

- `buildCommand`: `vite build`
- `outputDirectory`: `dist`
- `framework`: `vite`
- API rewrite: `/api/(.*)` to `/api`
- SPA fallback rewrite: non-file paths to `/index.html`
- API function `maxDuration`: `60`

The risk proxy timeout is set just below the Vercel function limit, so cold starts from the Render free tier return a clean service-waking response instead of a platform timeout.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Express/Vite development server. |
| `npm run build` | Build the Vite app into `dist/`. |
| `npm start` | Start the local production server and serve `dist/`. |
| `npm run lint` | Run TypeScript checks with `tsc --noEmit`. |
| `npm run preview` | Run Vite preview for the static app. |

## API Routes

These routes are served identically by local `server.ts` and Vercel `api/index.ts`:

- `GET /api/health`
- `POST /api/audit/ai-analyze`
- `GET /api/risk/health`
- `POST /api/risk/evaluate`
