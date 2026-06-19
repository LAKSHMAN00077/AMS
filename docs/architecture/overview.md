# Architecture Overview

## System diagram

```
┌─────────────────┐         ┌─────────────────┐
│  React Frontend │  HTTP   │  Node.js API    │
│  (Vite, :5173)  │ ──────► │  (Express,:3000)│
│  @ams/frontend  │  /api   │  @ams/backend   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
            ┌─────────────────┐
            │  @ams/shared    │
            │  Types & utils  │
            └─────────────────┘
```

## Tech stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19, Vite 6, TypeScript | Single-page web UI |
| Backend | Node.js 20+, Express, TypeScript | REST API |
| Shared | TypeScript package | API contracts, shared types |
| Tooling | npm workspaces | Monorepo dependency management |

## Design principles

1. **Workspace isolation** — Each app owns its runtime and dependencies. Cross-app code lives in `packages/`.
2. **Type safety end-to-end** — Shared interfaces (e.g. `HealthResponse`) are defined once in `@ams/shared` and consumed by both FE and BE.
3. **API-first** — Backend exposes JSON REST endpoints under `/api`. Frontend proxies `/api` to the backend in development.
4. **Simple by default** — No extra orchestration (Turborepo/Nx) until the repo grows. npm workspaces handle linking.

## Request flow (development)

1. Browser loads the React app from Vite dev server (`localhost:5173`).
2. Frontend calls `/api/*` — Vite proxies these to `localhost:3000`.
3. Express handles the request, returns JSON typed with `@ams/shared` interfaces.

## Future extensions

As the project grows, consider adding:

- `packages/ui` — Shared React components
- `packages/config` — Shared ESLint/TS configs
- Database layer in `apps/backend/src/db/`
- Authentication middleware in `apps/backend/src/middleware/`
