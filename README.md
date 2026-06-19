# AMS

Monorepo for the AMS application — React frontend and Node.js backend.

## Structure

```
AMS/
├── apps/
│   ├── frontend/     # React SPA (Vite + TypeScript)
│   └── backend/      # Node.js API (Express + TypeScript)
├── packages/
│   └── shared/       # Shared types and utilities
└── docs/             # Project documentation
```

## Prerequisites

- Node.js >= 20
- npm >= 10

## Quick start

```bash
# Install all dependencies
npm install

# Run frontend and backend in development
npm run dev

# Or run individually
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:3000
```

## Documentation

See the [docs](./docs/README.md) folder for architecture, development guides, API reference, and deployment instructions.

## Workspaces

| Package | Description |
|---------|-------------|
| `@ams/frontend` | React web application |
| `@ams/backend` | REST API server |
| `@ams/shared` | Shared TypeScript types and utilities |
