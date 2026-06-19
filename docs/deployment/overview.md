# Deployment Overview

Guidance for building and deploying AMS applications.

## Build artifacts

| App | Command | Output |
|-----|---------|--------|
| Frontend | `npm run build:frontend` | `apps/frontend/dist/` (static files) |
| Backend | `npm run build:backend` | `apps/backend/dist/` (compiled JS) |

Full monorepo build:

```bash
npm run build
```

## Frontend deployment

The frontend is a static SPA. Deploy `apps/frontend/dist/` to any static host:

- Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, Nginx, etc.

**Important:** Configure the host to:

1. Serve `index.html` for client-side routes (SPA fallback).
2. Proxy `/api` to the backend origin in production, **or** set `VITE_API_URL` and update the frontend API client to use it.

## Backend deployment

The backend is a Node.js process:

```bash
cd apps/backend
npm run build
npm start
```

Requires Node.js >= 20. Set environment variables (see `apps/backend/.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No (default 3000) | Listen port |
| `CORS_ORIGIN` | Yes (prod) | Frontend origin URL |

Suitable hosts: Railway, Render, Fly.io, AWS ECS, Kubernetes, or a VPS with PM2/systemd.

## Monorepo CI suggestion

A typical pipeline:

```yaml
# Example steps (adapt to your CI provider)
- npm ci
- npm run lint
- npm run build
- npm run test   # when tests are added
```

Deploy frontend and backend as separate artifacts from the same repo.

## Environment matrix

| Environment | Frontend URL | Backend URL | Notes |
|-------------|--------------|-------------|-------|
| Local | `http://localhost:5173` | `http://localhost:3000` | Vite proxy handles `/api` |
| Staging | TBD | TBD | Set `CORS_ORIGIN` to staging FE URL |
| Production | TBD | TBD | Use HTTPS; restrict CORS |

Update this table as environments are provisioned.
