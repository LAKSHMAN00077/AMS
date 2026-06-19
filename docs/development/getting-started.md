# Getting Started

First-time setup for the AMS monorepo.

## Prerequisites

- **Node.js** >= 20 (see `.nvmrc`)
- **npm** >= 10

If you use nvm:

```bash
nvm use
```

## Install

From the repository root:

```bash
npm install
```

This installs dependencies for all workspaces (`apps/frontend`, `apps/backend`, `packages/shared`) and links `@ams/shared` into both apps.

## Environment setup

Copy the backend environment template:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Default values work for local development:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend listen port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |

## Verify installation

```bash
# Terminal 1 — start backend
npm run dev:backend

# Terminal 2 — start frontend
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). The page should show a green API status if the backend is running.

## Build for production

```bash
npm run build
```

Outputs:

- Frontend: `apps/frontend/dist/`
- Backend: `apps/backend/dist/`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot find module '@ams/shared'` | Run `npm install` from the repo root |
| Port 3000 in use | Change `PORT` in `apps/backend/.env` |
| CORS errors | Ensure `CORS_ORIGIN` matches your frontend URL |
