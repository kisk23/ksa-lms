# Contributing

## Branch Naming

- `feat/<feature-name>` — New features
- `fix/<bug-description>` — Bug fixes
- `refactor/<scope>` — Code refactoring
- `docs/<scope>` — Documentation updates

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(courses): add drag-and-drop lesson reordering
fix(auth): resolve token refresh race condition
docs(api): update enrollment endpoint docs
```

## Feature Development Workflow

1. Create a branch from `main`
2. Work within the relevant `apps/` or `packages/` directory
3. Run `pnpm lint` and `pnpm test` before pushing
4. Open a PR and request review from the appropriate team (see CODEOWNERS)

## Adding a New Feature Module (Frontend)

Each feature in `apps/web/src/features/` or `apps/admin/src/features/` follows this structure:

```
features/
└── <feature-name>/
    ├── components/     # UI components for this feature
    ├── hooks/          # Custom hooks
    ├── services/       # API service functions
    ├── types/          # Feature-specific types (if any)
    └── index.ts        # Public API (barrel export)
```

**Rule:** Pages in `app/` should be thin — import from features, don't put logic in pages.

## Adding a New NestJS Module (Backend)

```
modules/
└── <module-name>/
    ├── dto/                    # class-validator DTOs
    │   ├── create-<name>.dto.ts
    │   ├── update-<name>.dto.ts
    │   └── index.ts
    ├── <name>.controller.ts
    ├── <name>.service.ts
    ├── <name>.module.ts
    └── __tests__/
```

1. Create the module folder under `apps/api/src/modules/`
2. Register the module in `app.module.ts`
3. Add Prisma models in `prisma/schema.prisma` if needed
4. Run `pnpm db:migrate` to create migrations
