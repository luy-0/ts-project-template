# Repository Guidelines

## Project Structure & Module Organization
- `apps/nextjs`, `apps/tanstack-start`, and `apps/expo` are the entry points; run app-specific commands there when debugging.
- Shared logic lives in `packages`: `api` (tRPC routers), `auth` (Better Auth setup), `db` (Drizzle schemas & clients), and `ui` (shared React components).
- Tooling presets are centralized in `tooling` (eslint, prettier, tailwind, typescript) and consumed via workspace packages such as `@acme/eslint-config`.
- Environment variables come from the root `.env` (see `.env.example`). CLI helpers like `with-env` in app scripts load it.

## Build, Test, and Development Commands
- Install with `pnpm install` (Node 22 / pnpm 10 per `package.json#engines`).
- Start all dev processes with `pnpm dev` (Turbo watches dependencies). For a single target: `pnpm --filter @acme/nextjs dev`, `pnpm --filter @acme/tanstack-start dev`, or from `apps/expo` use `pnpm dev:ios` / `pnpm dev:android`.
- Pre-PR checks: `pnpm lint`, `pnpm typecheck`, and `pnpm build` (runs through the Turbo graph). Format fixes with `pnpm format:fix`.
- Database and auth: `pnpm db:push`, `pnpm db:studio`, and `pnpm auth:generate` to refresh the Better Auth schema (writes to `packages/db/src/auth-schema.ts`).

## Coding Style & Naming Conventions
- TypeScript-first; follow shared configs (`@acme/tsconfig`, `@acme/eslint-config`, `@acme/prettier-config`). Prettier enforces 2-space indentation and quote/style defaults—avoid manual overrides.
- Keep packages and imports scoped under `@acme/*`. Use PascalCase for components/hooks, camelCase for functions/vars, and kebab-case for file names unless a framework requires otherwise.
- Tailwind is available in web apps; prefer tokens defined in `tooling/tailwind`.

## Testing Guidelines
- There is no monorepo-wide test runner yet; add tests nearest to the code (e.g., `feature/Button.test.tsx`) using the framework that fits the target app (React Testing Library/Playwright for web, Expo Testing Library for native).
- Include contract tests for shared packages (`packages/api`, `packages/db`) when changing request/response shapes; mock external services and avoid hitting live APIs in CI.
- Gate PRs by running lint/typecheck/build and any new tests you add; note commands and coverage expectations in the PR description.

## Commit & Pull Request Guidelines
- Follow the existing history style: `<type>: summary` (e.g., `fix: handle auth callback (#123)`) with small, focused commits.
- PRs should include a brief summary, linked issue/PR number, screenshots or recordings for UI changes, and notes on env changes (e.g., new secrets required).
- Keep changes minimal per PR; ensure Turbo tasks pass locally (`pnpm lint`, `pnpm typecheck`, `pnpm build`) before requesting review.
