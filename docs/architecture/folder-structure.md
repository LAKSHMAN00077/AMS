# Folder Structure

Complete layout of the AMS monorepo and the role of each directory.

```
AMS/
├── apps/                          # Deployable applications
│   ├── frontend/                  # React SPA
│   │   ├── public/                # Static assets (favicon, images)
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── pages/             # Route-level page components
│   │   │   ├── services/          # API client functions
│   │   │   ├── types/             # Frontend-only types
│   │   │   ├── App.tsx            # Root component
│   │   │   ├── App.css
│   │   │   ├── main.tsx           # Entry point
│   │   │   └── index.css          # Global styles
│   │   ├── index.html
│   │   ├── vite.config.ts         # Vite + dev proxy config
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── backend/                   # Node.js API server
│       ├── src/
│       │   ├── routes/            # Express route handlers
│       │   │   └── index.ts       # /api router
│       │   ├── middleware/        # Auth, logging, error handling
│       │   ├── services/          # Business logic
│       │   ├── db/                # Database clients & queries
│       │   └── index.ts           # Server entry point
│       ├── .env.example           # Environment variable template
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                      # Shared libraries
│   └── shared/
│       ├── src/
│       │   └── index.ts           # Exported types & utilities
│       ├── tsconfig.json
│       └── package.json
│
├── docs/                          # Project documentation
│   ├── architecture/
│   ├── development/
│   ├── api/
│   └── deployment/
│
├── package.json                   # Root workspace config & scripts
├── .gitignore
├── .nvmrc                         # Node version (20)
└── README.md
```

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| Workspace packages | `@ams/<name>` | `@ams/frontend` |
| React components | PascalCase file and export | `UserCard.tsx` |
| Hooks | `use` prefix | `useAuth.ts` |
| API routes | kebab-case paths | `/api/user-profile` |
| Env variables | SCREAMING_SNAKE_CASE | `CORS_ORIGIN` |

## Where to add new code

| Need | Location |
|------|----------|
| New API endpoint | `apps/backend/src/routes/` |
| New page | `apps/frontend/src/pages/` |
| Shared type used by FE + BE | `packages/shared/src/` |
| Frontend-only type | `apps/frontend/src/types/` |
| DB model / query | `apps/backend/src/db/` |
| Project docs | `docs/<section>/` |

## Placeholder directories

The following directories are documented for future use but not yet created with files:

- `apps/frontend/src/components/`
- `apps/frontend/src/hooks/`
- `apps/frontend/src/pages/`
- `apps/frontend/src/services/`
- `apps/frontend/src/types/`
- `apps/backend/src/middleware/`
- `apps/backend/src/services/`
- `apps/backend/src/db/`

Create them as you add features — keeping the tree lean until needed.
