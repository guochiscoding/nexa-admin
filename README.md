# Nexa Admin

[中文](#中文) | [English](#english)

## 中文

Nexa Admin 是一个开箱即用的 Vue 3 中后台前端模板，适用于管理后台、运营平台、数据看板和企业内部系统。它提供可直接运行的应用框架，并内置路由权限、国际化、主题偏好、表格范式、组件示例、接口请求层和质量检查流程。

项目默认启用演示登录模式，不依赖后端服务即可启动。你可以先用它验证页面结构、组件规范和权限模型，再逐步替换为真实业务接口。

### 能力概览

- Vue 3 + TypeScript + Vite 应用基础设施
- 基于 Ant Design Vue 的后台组件封装
- Tailwind CSS v4 + 项目级设计 Token 的样式工作流
- Vue Router 布局、导航元信息、路由守卫和 401/403 页面
- Pinia 登录态、权限树和用户偏好持久化
- Vue I18n 中文和英文语言包
- 统一 Axios 实例，集中处理认证 Token、语言头、超时和 401/403 跳转
- 演示登录模式，零后端即可本地启动
- 浅色、深色、跟随系统主题，偏好存储在浏览器缓存中
- 总览看板、组件文档、表格示例、二级布局示例和项目介绍页面

### 技术栈

- Vue 3，统一使用 `<script setup lang="ts">`
- TypeScript strict mode
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- Tailwind CSS v4
- Vue I18n
- Axios
- ECharts

### 环境要求

- Node.js 20.19+
- pnpm 10+

### 快速开始

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:5174`，使用任意非空账号和密码登录，例如：

```text
admin / admin123
```

当 `VITE_AUTH_MOCK=true` 或 `VITE_API_BASE_URL` 为空时，项目会启用演示登录模式。

### 环境变量

需要本地覆盖配置时，可以复制 `.env.example`：

```bash
cp .env.example .env.local
```

可用变量：

```text
VITE_AUTH_MOCK=true
VITE_API_BASE_URL=
VITE_ICONFONT_SCRIPT_URL=
ALLOWED_HOSTS=
```

连接真实后端时，将 `VITE_AUTH_MOCK` 设为 `false`，并配置 `VITE_API_BASE_URL`。本地开发时，Vite 会将 `/api` 请求代理到 `VITE_API_BASE_URL`；生产构建会直接使用 `VITE_API_BASE_URL` 作为 Axios base URL。

如果需要替换默认图标项目，可以将 `VITE_ICONFONT_SCRIPT_URL` 设置为自己的 Iconfont 项目脚本地址。`ALLOWED_HOSTS` 用于配置 Vite dev server 的 host allowlist，多个值用英文逗号分隔。

### 常用脚本

```bash
pnpm dev            # 启动本地开发服务，默认端口 5174
pnpm build          # 类型检查并构建生产产物
pnpm preview        # 预览生产构建产物，默认端口 4173
pnpm lint           # 运行 ESLint
pnpm typecheck      # 运行 vue-tsc
pnpm check:design   # 检查设计 Token 使用规则
pnpm check          # 设计检查、Lint、类型检查和生产构建
```

### 项目结构

```text
src/
  api/          Axios 实例、接口方法、响应类型和响应标准化
  components/   跨页面复用的 UI 与数据展示组件
  config/       应用配置、主题 Token 和导航权限配置
  directives/   全局指令，例如 v-permission
  layouts/      应用框架、头部、导航和布局组件
  locales/      zh-CN 与 en-US 语言包
  router/       路由、路由元信息和导航守卫
  stores/       Pinia store 与持久化状态
  styles/       全局 Token、工具类、字体和 Ant Design 覆盖样式
  views/        路由页面和页面私有组件
```

### 开发约定

- 新页面放在 `src/views/**`，跨页面复用组件放在 `src/components/**`。
- 所有可见文案通过 Vue I18n 管理，同步维护 `src/locales/lang/zh-CN.ts` 和 `src/locales/lang/en-US.ts`。
- HTTP 请求统一走 `src/api/request.ts`，接口类型和响应标准化逻辑放在 `src/api/**`。
- 页面权限使用路由元信息和 `v-permission`，权限码来自当前用户详情接口返回的 `permissions` 数组。
- 样式优先使用 `src/styles/**` 中的设计 Token 和语义工具类，避免在页面中散落硬编码颜色。

### 接口接入

关闭演示模式后，项目默认依赖以下认证接口：

```text
POST /api/auth/login
GET  /api/auth/current-user/detail
POST /api/auth/logout
```

响应体需要包含 `data` 字段。登录接口返回访问令牌和用户信息：

```json
{
  "data": {
    "access_token": "token",
    "expires_in": 7200,
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "Admin",
      "real_name": "Admin",
      "email": "admin@example.com",
      "status": "normal",
      "created_at": "2026-01-01 00:00:00",
      "updated_at": "2026-01-01 00:00:00"
    }
  }
}
```

当前用户详情接口需要返回用户信息和权限资源：

```json
{
  "data": {
    "user": {},
    "permission_resources": {
      "list": [],
      "permissions": ["dashboard:view"],
      "stats": {}
    }
  }
}
```

`permission_resources.list` 用于生成导航和权限树，`permission_resources.permissions` 用于路由访问和 `v-permission` 精确匹配。

### Docker

```bash
docker build -f Dockerfile.dev -t nexa-admin .
docker run --rm -p 3000:3000 nexa-admin
```

Docker 镜像默认以演示模式构建。如需连接真实后端，可以在构建时覆盖环境变量。

### 质量检查

提交代码前建议执行：

```bash
pnpm check
```

该命令会依次运行设计 Token 检查、ESLint、TypeScript 检查和生产构建。仓库内置 GitHub Actions，会在 `main` 分支推送和 Pull Request 时执行同一套检查。

### 许可证

MIT

## English

Nexa Admin is an out-of-the-box Vue 3 admin template for dashboards, back-office products, operation platforms, and internal business systems. It provides a ready-to-run application shell with routing, permissions, i18n, theme preferences, table patterns, component examples, an API request layer, and a quality gate.

The project runs in demo auth mode by default, so it does not require a backend service for local startup. You can use it to review the page structure, component conventions, and permission model before connecting real business APIs.

### Capabilities

- Vue 3 + TypeScript + Vite application foundation
- Admin-oriented components based on Ant Design Vue
- Tailwind CSS v4 with project-level design tokens
- Vue Router layouts, navigation metadata, route guards, and 401/403 pages
- Pinia stores for auth state, permission trees, and persisted preferences
- Vue I18n language packs for Simplified Chinese and English
- Unified Axios instance for auth tokens, locale headers, timeouts, and 401/403 redirects
- Built-in demo auth mode for zero-backend local startup
- Light, dark, and system themes persisted in browser storage
- Overview dashboard, component documentation, table examples, secondary-layout examples, and project introduction pages

### Tech Stack

- Vue 3 with `<script setup lang="ts">`
- TypeScript strict mode
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- Tailwind CSS v4
- Vue I18n
- Axios
- ECharts

### Requirements

- Node.js 20.19+
- pnpm 10+

### Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5174` and sign in with any non-empty account and password, for example:

```text
admin / admin123
```

Demo auth mode is enabled when `VITE_AUTH_MOCK=true` or when `VITE_API_BASE_URL` is empty.

### Environment Variables

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

Set `VITE_ICONFONT_SCRIPT_URL` to your own Iconfont project script URL when replacing the default Nexa Admin icon set. Use `ALLOWED_HOSTS` to configure the Vite dev server host allowlist; separate multiple values with commas.

### Scripts

```bash
pnpm dev            # start local dev server on port 5174
pnpm build          # type-check and build for production
pnpm preview        # preview the production build on port 4173
pnpm lint           # run ESLint
pnpm typecheck      # run vue-tsc
pnpm check:design   # enforce design-token usage rules
pnpm check          # design check, lint, type-check, and build
```

### Project Structure

```text
src/
  api/          Axios instance, API methods, response types, and normalizers
  components/   shared UI and data-display components
  config/       app config, theme tokens, navigation, and permission config
  directives/   global directives such as v-permission
  layouts/      app shell, header, navigation, and layout widgets
  locales/      zh-CN and en-US language packs
  router/       routes, route metadata, and navigation guards
  stores/       Pinia stores and persisted state
  styles/       global tokens, utilities, typography, and Ant Design overrides
  views/        route-level pages and feature-specific components
```

### Development Conventions

- Put route-level pages under `src/views/**` and shared components under `src/components/**`.
- Manage all visible UI copy with Vue I18n and keep `src/locales/lang/zh-CN.ts` and `src/locales/lang/en-US.ts` in sync.
- Send HTTP requests through `src/api/request.ts`; keep API types and response normalization in `src/api/**`.
- Use route metadata and `v-permission` for page and action permissions. Permission codes come from the current-user detail response.
- Prefer design tokens and semantic utilities from `src/styles/**`; avoid hard-coded colors in page components.

### API Integration

When demo mode is disabled, the app expects these auth endpoints:

```text
POST /api/auth/login
GET  /api/auth/current-user/detail
POST /api/auth/logout
```

Responses should be wrapped in a `data` field. The login endpoint returns the access token and user profile:

```json
{
  "data": {
    "access_token": "token",
    "expires_in": 7200,
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "Admin",
      "real_name": "Admin",
      "email": "admin@example.com",
      "status": "normal",
      "created_at": "2026-01-01 00:00:00",
      "updated_at": "2026-01-01 00:00:00"
    }
  }
}
```

The current-user detail endpoint should return the user profile and permission resources:

```json
{
  "data": {
    "user": {},
    "permission_resources": {
      "list": [],
      "permissions": ["dashboard:view"],
      "stats": {}
    }
  }
}
```

`permission_resources.list` is used to build navigation and permission trees. `permission_resources.permissions` is used for route access and exact `v-permission` checks.

### Docker

```bash
docker build -f Dockerfile.dev -t nexa-admin .
docker run --rm -p 3000:3000 nexa-admin
```

The Docker image builds in demo mode by default. Override build-time environment variables if you want to connect it to a real backend.

### Quality Gate

Before committing code, run:

```bash
pnpm check
```

This runs the design-token checker, ESLint, TypeScript checks, and the production build. The repository includes a GitHub Actions workflow that runs the same check on pushes to `main` and on pull requests.

### License

MIT
