# Gamehoop Agent Guidelines

This document provides coding guidelines and standards for AI agents working in the Gamehoop codebase.

## Project Overview

**Stack:** TanStack Start (React 19), TypeScript, PostgreSQL, Kysely, Mantine UI, Tailwind CSS
**Package Manager:** pnpm (use pnpm, not npm or yarn)
**Module System:** ES Modules with path aliases (`@/*` → `./src/*`)

## Build, Lint, and Test Commands

```bash
# Development
pnpm dev                    # Start dev server on port 3000

# Type checking and linting
pnpm check                  # Run both lint and typecheck
pnpm typecheck              # TypeScript type checking
pnpm lint                   # Lint with oxlint (auto-fixes issues)
pnpm fmt                    # Format with Prettier

# Testing
pnpm test                   # Run all unit tests (watch mode by default)
pnpm test:ci                # Run tests once (CI mode)
vitest run path/to/file.test.ts  # Run single test file
vitest path/to/file.test.ts      # Watch single test file
pnpm test:e2e               # Run Playwright E2E tests

# Database
pnpm db:migrate             # Run pending migrations
pnpm db:codegen             # Regenerate schema.d.ts from database

# Build and deployment
pnpm build                  # Build for production
pnpm start                  # Start production server
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** with additional checks:
  - `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
  - `noUncheckedIndexedAccess` (indexed access includes `| undefined`)
  - `noImplicitReturns`, `noImplicitOverride`
- Use path aliases: `@/components`, `@/db`, `@/utils`, etc.
- Always include explicit return types for functions exported from modules
- Never use `any` - use `unknown` and narrow with type guards

### Import Order

```typescript
// 1. React and UI components
import { Button } from '@/components/ui';

// 2. Database types
import { Game } from '@/db/types';

// 3. Domain logic
import { validateApiKey } from '@/domain/api';

// 4. Functions and hooks
import { getSession } from '@/functions/auth';
import { useActiveOrganization } from '@/hooks/use-active-organization';

// 5. Libraries and utilities
import { logger, logError } from '@/libs/logger';
import { HttpStatus, ok, badRequest } from '@/utils/http';

// 6. External packages
import { createServerFn } from '@tanstack/react-start';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

// 7. Relative imports
import { helper } from './helper';

// 8. Assets and styles
import logo from '@/assets/logo.svg';
```

### Naming Conventions

**Files:**

- Components: PascalCase names, kebab-case files (`GameSettingsForm` → `game-settings-form.tsx`)
- Functions/utils: kebab-case (`get-session-context.ts`)
- Tests: co-located in `__tests__/` or next to file with `.test.ts(x)` suffix
- Migrations: `YYYY-MM-DD.N-description.ts` (e.g., `2026-01-25.1-add-game-table.ts`)

**Code:**

- Variables/functions: `camelCase`
- Components/types/interfaces/classes: `PascalCase`
- Constants: `camelCase` (not SCREAMING_SNAKE_CASE unless truly constant)
- Database columns: `snake_case` in migrations, `camelCase` in TypeScript (auto-converted)

```typescript
// Good
const activeOrganization = getActiveOrg();
export function GameList() {}
export interface GameListProps {}
export const sessionTokenKey = 'gamehoop.session_token';

// Bad
const ActiveOrganization = getActiveOrg();
export function gameList() {}
export const SESSION_TOKEN_KEY = 'gamehoop.session_token';
```

### Formatting

Prettier enforces:

- 2 spaces for indentation
- Single quotes for strings
- Trailing commas everywhere
- Line length: 100 characters (soft limit)

### Type Definitions

```typescript
// Database types pattern
import { Selectable, Insertable, Updateable } from 'kysely';
import { Game as GameTable } from './schema';

export type Game = Selectable<GameTable>;
export type InsertableGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;

// Component props - always export
export interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// Use discriminated unions for enums
export type GamePlatform = 'android' | 'ios' | 'windows' | 'mac';
```

### Error Handling

**Always log errors:**

```typescript
import { logError } from '@/libs/logger';

try {
  await operation();
} catch (error) {
  logError(error); // ALWAYS log before handling
  notify.error({ title: 'Error', message: 'Operation failed' });
}
```

**API routes - throw Response objects:**

```typescript
import { unauthorized, notFound, badRequest } from '@/utils/http';

if (!apiKey) {
  throw unauthorized(); // Returns Response, not Error
}

if (!resource) {
  throw notFound();
}

throw badRequest({ error: 'Invalid input' });
```

**Server functions - return data or throw:**

```typescript
export const createGame = createServerFn({ method: HttpMethod.Post })
  .inputValidator(z.object({ name: z.string() }))
  .handler(async ({ data }): Promise<Game> => {
    // Return data on success
    return await gameRepo.create(data);

    // Errors are caught by caller
  });
```

### Data Access Patterns

**Use repository pattern (never write raw queries in components/routes):**

```typescript
// repos/game-repo.ts
export class GameRepo extends BaseRepo<Game> {
  constructor() {
    super('game');
  }

  async findOneForUser(args: { userId: string; gameId: string }) {
    return db
      .selectFrom('game')
      .selectAll('game')
      .where('game.id', '=', args.gameId)
      .where('game.userId', '=', args.userId)
      .executeTakeFirst();
  }
}

export const gameRepo = new GameRepo(); // Export singleton
```

**Available BaseRepo methods:**

- `findMany({ where, orderBy, take, skip })`
- `findOne({ where })` / `findOneOrThrow({ where })`
- `create(data)` / `createMany(data[])`
- `update({ where, data })` / `updateOrThrow({ where, data })`
- `delete({ where })`
- `count({ where })`
- `page({ page, pageSize, where, orderBy })`

### Server Functions

```typescript
import { createServerFn } from '@tanstack/react-start';
import { HttpMethod } from '@/utils/http';

export const updateGame = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      id: z.string(),
      name: z.string().min(1),
    }),
  )
  .handler(async ({ data }): Promise<Game> => {
    const session = await getSessionContext();
    return await gameRepo.updateOrThrow({
      where: { id: data.id, userId: session.user.id },
      data: { name: data.name },
    });
  });
```

### Forms (TanStack Form)

```typescript
const form = useForm({
  defaultValues: { name: game.name },
  validators: {
    onSubmit: z.object({ name: z.string().min(1) }),
  },
  onSubmit: async ({ value }) => {
    try {
      await updateGame({ data: value });
      await router.invalidate(); // Refresh data
      form.reset(value); // Reset dirty state
      notify.success({ title: 'Saved' });
    } catch (error) {
      logError(error);
      notify.error({ title: 'Error' });
    }
  },
});

// Field rendering
<form.Field name="name">
  {(field) => (
    <TextInput
      name={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      error={field.state.meta.errors[0]?.message}
    />
  )}
</form.Field>

// Submit button with state
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <Button
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      loading={isSubmitting}
    >
      Save
    </Button>
  )}
</form.Subscribe>
```

## Testing Guidelines

### Unit Tests

**File structure:** Co-locate tests in `__tests__/` directories or use `.test.ts(x)` suffix

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUser, createGame } from '@/utils/testing';

describe('GameRepo', () => {
  let user: User;

  beforeEach(async () => {
    ({ user } = await createTestUser());
  });

  it('should create a game', async () => {
    const game = await gameRepo.create({
      name: 'Test Game',
      userId: user.id,
    });

    expect(game).toStrictEqual({
      name: 'Test Game',
      userId: user.id,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });
});
```

**Component tests:** Add `// @vitest-environment jsdom` at top of file

```typescript
// @vitest-environment jsdom
import { render } from '@/utils/testing';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('should handle clicks', async () => {
    const handleClick = vi.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Test utilities:** Use helpers from `@/utils/testing`

- `createTestUser()` - Creates user + organization
- `createGame({ user, organization })` - Creates game
- `createPlayer({ game })` - Creates player
- `render(component)` - Renders with all providers

### Database Testing

- All tests run in transactions (auto-rollback)
- Use real database, not mocks
- Test isolation guaranteed by `vitest.setup.ts`

## Common Patterns

### Authentication

```typescript
import { getSessionContext } from '@/functions/auth/get-session-context';

// In server functions
const session = await getSessionContext(); // Throws if not authenticated
const { user, organizations, activeOrganization } = session;

// Check permissions
if (!organizations.some((org) => org.id === resource.organizationId)) {
  throw forbidden();
}
```

### Pagination

```typescript
const result = await gameRepo.page({
  page: 1,
  pageSize: 10,
  where: { userId: user.id },
  orderBy: [{ column: 'createdAt', order: 'desc' }],
});

// Returns: { items: Game[], total: number, hasMore: boolean }
```

### Environment Variables

Define in `src/env/server.ts` or `src/env/client.ts`:

```typescript
import { createEnv } from '@t3-oss/env-core';
import z from 'zod';

export const env = createEnv({
  server: {
    // or client:
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  runtimeEnv: process.env, // or import.meta.env for client
  emptyStringAsUndefined: true,
});
```

## Commit Guidelines

Follow conventional commits (enforced by commitlint):

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `docs:` Documentation changes
- `chore:` Maintenance tasks

Pre-commit hooks run oxlint and Prettier automatically.
