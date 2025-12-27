# Repository Guidelines

## Project Structure & Module Organization
- `apps/nextjs`, `apps/tanstack-start`, and `apps/expo` render UI only; do not add business endpoints here. All contracts live in `packages/api` as tRPC routers (register in `packages/api/src/root.ts`).
- Shared logic lives in `packages`: `api`, `auth` (Better Auth), `db` (Drizzle), `ui` (shared React components). Tooling presets sit in `tooling` and are consumed via `@acme/*` configs.
- Environment variables come from root `.env` (see `.env.example`); `with-env` in app scripts loads it.

## Build, Test, and Development Commands
- Install with `pnpm install` (Node 22 / pnpm 10 per `package.json#engines`).
- Start all dev processes with `pnpm dev`. Single targets: `pnpm --filter @acme/nextjs dev`, `pnpm --filter @acme/tanstack-start dev`, or in `apps/expo` run `pnpm dev:ios` / `pnpm dev:android`.
- Pre-PR checks: `pnpm lint`, `pnpm typecheck`, `pnpm build`; format fixes with `pnpm format:fix`.
- Database/auth helpers: `pnpm db:push`, `pnpm db:studio`, `pnpm auth:generate` (writes `packages/db/src/auth-schema.ts`).

## Coding Style & Naming Conventions
- TypeScript-first; follow `@acme/tsconfig`, `@acme/eslint-config`, `@acme/prettier-config`. Prettier enforces 2-space indentation; avoid overrides.
- Keep packages/imports scoped under `@acme/*`. Use PascalCase for components/hooks, camelCase for functions/vars, kebab-case for files unless framework dictates otherwise.
- Tailwind is available in web apps; prefer tokens defined in `tooling/tailwind`.
- Add new business endpoints as tRPC procedures in `packages/api`; clients call via tRPC, not ad-hoc fetch.

## Testing Guidelines
- There is no monorepo-wide test runner yet; add tests nearest to the code (e.g., `feature/Button.test.tsx`) using the framework that fits the target app (React Testing Library/Playwright for web, Expo Testing Library for native).
- Include contract tests for shared packages (`packages/api`, `packages/db`) when changing request/response shapes; mock external services and avoid hitting live APIs in CI.
- Gate PRs by running lint/typecheck/build and any new tests you add; note commands and coverage expectations in the PR description.

## Commit & Pull Request Guidelines
- Follow the existing history style: `<type>: summary` (e.g., `fix: handle auth callback (#123)`) with small, focused commits.
- PRs should include a brief summary, linked issue/PR number, screenshots or recordings for UI changes, and notes on env changes (e.g., new secrets required).
- Keep changes minimal per PR; ensure Turbo tasks pass locally (`pnpm lint`, `pnpm typecheck`, `pnpm build`) before requesting review.
