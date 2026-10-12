# Nexa Admin

Nexa Admin is an open-source Vue 3 admin starter for dashboard and back-office products. It includes a ready-to-run shell, routing, permissions, i18n, theme preferences, table patterns, and an Axios request layer.

The project runs in demo mode by default, so you can clone it, install dependencies, and sign in without preparing a backend service.

## Features

- Vue 3 + TypeScript + Vite application foundation
- Ant Design Vue components with project-level style tokens
- Tailwind CSS v4 semantic utility workflow
- Vue Router layouts, navigation metadata, route guards, and 401/403 pages
- Pinia stores for auth, permissions, and preferences
- Vue I18n language packs for Simplified Chinese and English
- Unified Axios instance with auth token and locale headers
- Built-in demo auth mode for zero-backend local startup

## Tech Stack

- Vue 3 with `<script setup lang="ts">`
- TypeScript strict mode
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- Tailwind CSS v4
- Vue I18n
- Axios

## Requirements

- Node.js 20.19+
- pnpm 10+

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` and sign in with any non-empty account and password, for example:

```text
admin / admin123
```

Demo mode is enabled when `VITE_AUTH_MOCK=true` or when `VITE_API_BASE_URL` is empty.

## Environment Variables

Copy `.env.example` to `.env.local` when you need local overrides.

```bash
cp .env.example .env.local
```

Available variables:

```text
VITE_AUTH_MOCK=true
VITE_API_BASE_URL=
VITE_ICONFONT_SCRIPT_URL=
ALLOWED_HOSTS=
```

Use `VITE_AUTH_MOCK=false` and set `VITE_API_BASE_URL` when connecting to a real API. During local development, Vite proxies `/api` requests to `VITE_API_BASE_URL`; production builds use `VITE_API_BASE_URL` as the Axios base URL.

Set `VITE_ICONFONT_SCRIPT_URL` to your own Iconfont project script URL when replacing the default Nexa Admin icon set.

## Scripts

```bash
pnpm dev            # start local dev server
pnpm build          # type-check and build for production
pnpm preview        # preview the production build
pnpm lint           # run ESLint
pnpm typecheck      # run vue-tsc
pnpm check:design   # enforce design-token usage rules
pnpm check          # design check, lint, type-check, and build
```

## Project Structure

```text
src/
  api/          Axios instance, API methods, and response models
  components/   shared UI and data-display components
  config/       app config, theme tokens, and permission code constants
  directives/   global directives such as v-permission
  layouts/      app shell, header, navigation, and layout widgets
  locales/      zh-CN and en-US language packs
  router/       routes, route metadata, and navigation guards
  stores/       Pinia stores and persisted state
  styles/       global tokens, utilities, typography, and Ant Design overrides
  views/        route-level pages and feature-specific components
```

## API Integration

HTTP requests should go through `src/api/request.ts`. Auth and permission data are modeled in `src/api/auth.ts` and stored in `src/stores/auth.ts` and `src/stores/permission.ts`.

The app expects these auth endpoints when demo mode is disabled:

```text
POST /api/auth/login
GET  /api/auth/current-user/detail
POST /api/auth/logout
```

`/api/auth/current-user/detail` should return the current user and permission resources. Route access and `v-permission` checks use exact permission codes from the returned `permissions` array.

## Docker

```bash
docker build -f Dockerfile.dev -t nexa-admin .
docker run --rm -p 3000:3000 nexa-admin
```

The Docker image builds in demo mode by default. Override the build environment if you want to connect it to a real backend.

## Quality Gate

Before opening a pull request, run:

```bash
pnpm check
```

This runs the design-token checker, ESLint, TypeScript checks, and the production build.

## License

MIT
