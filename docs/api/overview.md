# API Overview

Backend REST API served by `@ams/backend` (Express).

**Base URL (local):** `http://localhost:3000`

All `/api/*` routes are also reachable via the frontend dev proxy at `http://localhost:5173/api/*`.

## Endpoints

### Health check

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Root health (no `/api` prefix) |
| `GET` | `/api/health` | API health check |

**Response** (`200 OK`):

```json
{
  "status": "ok",
  "service": "ams-backend",
  "version": "0.1.0",
  "timestamp": "2026-06-19T12:00:00.000Z"
}
```

Type: `HealthResponse` from `@ams/shared`.

## Error format

Future endpoints will return errors using the `ApiError` shape:

```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found",
  "statusCode": 404
}
```

## Adding new endpoints

1. Create a route file in `apps/backend/src/routes/`.
2. Register it in `apps/backend/src/routes/index.ts`.
3. Add shared request/response types to `packages/shared` if used by the frontend.
4. Document the endpoint in this file.

Example:

```typescript
// apps/backend/src/routes/users.ts
import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.json({ users: [] });
});
```

```typescript
// apps/backend/src/routes/index.ts
import { usersRouter } from './users.js';

apiRouter.use('/users', usersRouter);
// → GET /api/users
```

## Authentication

Not yet implemented. When added, document the auth scheme here (JWT, session cookies, etc.) and place middleware in `apps/backend/src/middleware/`.
