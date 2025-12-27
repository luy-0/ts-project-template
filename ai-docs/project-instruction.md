# 框架开发规范.md

本规范旨在约束团队在 T3 Turbo 全栈架构下的开发行为，确保 Web (Next.js/TanStack Start)、App (Expo) 与 Backend (tRPC) 的高度协同。

## 1. 目录组织与职责

仓库采用 Monorepo 结构，划分为应用、包和服务三个层次：

* **`apps/` (入口层)**
* `nextjs/`: 基于 App Router 的 Web 端主应用。
* `expo/`: 移动端原生应用 (React Native)。
* `tanstack-start/`: 实验性/轻量级全栈 Web 入口。


* **`packages/` (领域逻辑层)**
* `api/`: **核心业务定义**。包含 `root.ts` (路由聚合) 和 `router/` (业务逻辑)。业务接口必须放在此处，通过 tRPC 暴露给所有客户端，避免在 `apps/*` 追加平行的 REST 端点。
* `db/`: 基于 **Drizzle ORM** 的数据库交互层，包含 `schema.ts`。
* `auth/`: 基于 Auth.js 的身份验证核心。
* `ui/`: 跨端组件库，采用原子化设计（如 `button.tsx`, `input.tsx`）。
* `validators/`: 存放 Zod Schema，用于前端表单与后端 API 的共同校验。


* **`tooling/` (基础设施层)**
* 存放所有的配置规范（ESLint, Prettier, Tailwind, TypeScript），确保全仓库代码风格统一。


* **`ai-docs/` (协作层)**
* 存储 `project-dev-guide.md` 以及 AI 辅助开发的上下文约束和临时 PRD。



## 2. 前后端协作流程 (tRPC & Drizzle)

1. **数据库变更：** 在 `packages/db/src/schema.ts` 定义表结构。
2. **API 暴露：** * 在 `packages/api/src/router/` 创建业务路由。
* 在 `packages/api/src/root.ts` 中注册该路由。
* 客户端仅通过 tRPC 客户端调用，禁止在 `apps/*` 新增独立 REST 路由承载业务。


3. **调用端使用：** * **Nextjs:** 使用 `src/trpc/` 下的客户端或服务端调用器。
* **Expo:** 使用 `src/utils/api.tsx` 封装的 hook 调用。



## 3. 项目依赖与工程指令

我们使用 `pnpm` 作为唯一的包管理器。

* **安装依赖：** 根目录下执行 `pnpm install`。
* **本地开发：** `pnpm dev` (通过 Turborepo 并行启动所有应用)。
* **代码校验：** `pnpm lint` (应用 `tooling/eslint` 中的统一规则)。
* **生成代码：** `pnpm turbo gen` (使用 `turbo/generators` 快速生成新的 package 或组件)。

## 4. AI 开发规约

本仓库成员在使用 Cursor、Copilot 或其他大模型工具时，必须遵守以下约定：

* **优先读取规范：** AI 工具必须先解析 `ai-docs/project-dev-guide.md`。
* **禁止私自安装包：** AI 生成代码如需新依赖，必须由人工评估后使用 `pnpm --filter` 安装。
* **路径引用原则：** * 引用 UI 组件：必须来自 `@acme/ui`。
* 引用数据库：必须来自 `@acme/db`。
* 引用 API 类型：必须通过 tRPC 的 `appRouter` 类型推导。



## 5. 样式与 UI 规范

* **原子化：** 统一使用 Tailwind CSS。
* **跨端注意：** `apps/expo` 使用 NativeWind 适配 Tailwind 语法，编写样式时需注意移动端与 Web 端 flex 布局的细微差异。

## 6. 快速上手步骤

1. 克隆仓库后，执行 `pnpm install`。
2. 进入 `packages/db`，配置本地数据库连接。
3. 执行 `pnpm db:push` 推送数据库 Schema。
4. 在根目录执行 `pnpm dev`，访问 `http://localhost:3000`。
