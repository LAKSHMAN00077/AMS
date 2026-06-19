# Local Development

Day-to-day workflow for working in the monorepo.

## Running services

### Both apps

```bash
npm run dev
```

Runs `dev` in every workspace that defines it (frontend + backend).

### Individual apps

```bash
npm run dev:frontend   # Vite → http://localhost:5173
npm run dev:backend    # tsx watch → http://localhost:3000
```

## Development proxy

In development, the frontend does not call the backend directly. Vite proxies `/api` requests:

```
Browser  →  localhost:5173/api/health
         →  localhost:3000/api/health  (proxied)
```

Config: `apps/frontend/vite.config.ts`

## Working with shared types

1. Add or update types in `packages/shared/src/index.ts`.
2. Import in frontend or backend:

```typescript
import type { HealthResponse } from '@ams/shared';
```

3. No rebuild step needed in dev — workspaces resolve source directly.

## Linting

```bash
npm run lint              # All workspaces
npm run lint -w @ams/frontend
npm run lint -w @ams/backend
```

## Adding dependencies

Always install from the **workspace** that needs the package:

```bash
# Frontend dependency
npm install axios -w @ams/frontend

# Backend dependency
npm install zod -w @ams/backend

# Shared dev dependency
npm install -D vitest -w @ams/shared
```

## Recommended IDE setup

- TypeScript language service enabled
- ESLint extension for inline lint feedback
- Open the repo root (not an individual app) so workspace paths resolve

## Git workflow

1. Create a feature branch from `main`.
2. Make changes in the relevant workspace(s).
3. Run `npm run lint` and `npm run build` before opening a PR.
4. Update docs in `docs/` when adding endpoints, env vars, or architectural changes.
