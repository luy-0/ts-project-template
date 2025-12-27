# 项目开发指南 (AI & Developer Guide)

本指南定义了在本项目中实现功能的技术路径和代码模式。AI 助手在生成代码前必须参考此准则。

## 1. 核心技术栈概览

* **Mono-repo 管理**: `pnpm` + `Turborepo`
* **前端框架**: Next.js (App Router), Expo (React Native)
* **后端 API**: tRPC (类型安全 RPC)
* **数据库**: Drizzle ORM + PostgreSQL
* **样式**: Tailwind CSS + NativeWind (Expo)
* **校验**: Zod

---

## 2. 数据库开发规范 (`packages/db`)

**路径**: `packages/db/src/schema.ts`

* **定义模型**: 使用 Drizzle 语法。如果是 Auth 相关表，放入 `auth-schema.ts`；业务表放入 `schema.ts`。
* **操作原则**:
* 禁止在应用层直接编写原始 SQL。
* 必须使用 `db.query.<model_name>.findFirst` 等类型安全的方法。


* **同步数据库**: 修改 schema 后，运行 `pnpm db:push`。

---

## 3. API 开发规范 (`packages/api`)

**路径**: `packages/api/src/router/`

### 3.1 创建新路由

1. 在 `router/` 目录下创建 `[feature].ts`。
2. 使用 `publicProcedure` 或 `protectedProcedure` (需登录)。
3. **必须**使用 `.input(z.object({ ... }))` 进行参数校验。

### 3.2 示例模式

```typescript
// packages/api/src/router/post.ts 模式
export const postRouter = {
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.post).values(input);
    }),
};

```

4. 在 `packages/api/src/root.ts` 中注册新路由。

---

## 4. Web 端开发规范 (`apps/nextjs`)

**路径**: `apps/nextjs/src/app/`

* **数据获取**:
* **Server Components**: 优先使用 `import { api } from "~/trpc/server"` 进行异步调用。
* **Client Components**: 使用 `import { api } from "~/trpc/react"` 的 hooks 模式。


* **组件化**: UI 基础组件必须从 `@acme/ui` 导入，禁止在 `apps/nextjs` 中重新定义 Button、Input 等原子组件。

---

## 5. 移动端开发规范 (`apps/expo`)

**路径**: `apps/expo/src/app/`

* **路由**: 使用 `expo-router` (基于文件系统的路由)。
* **API 调用**: 只能使用 `~/utils/api` 中的 hooks 模式。
* **样式**: 使用 Tailwind 语法，但需注意在 `className` 中仅使用 React Native 支持的属性。

---

## 6. 共享校验规则 (`packages/validators`)

* 所有跨端共用的表单校验逻辑必须写在 `packages/validators/src/index.ts` 中。
* 前端 React Hook Form 和后端 tRPC input 必须引用同一个 Zod Schema。

---

## 7. 给 AI 助手的特别指令 (System Prompt Add-on)

当你在本仓库工作时，请遵循以下逻辑流：

1. **修改数据时**: 首先检查 `packages/db/src/schema.ts`。
2. **增加业务逻辑时**: 在 `packages/api/src/router/` 创建 procedure。
3. **UI 变动时**: 检查 `packages/ui` 是否已有组件，若无，建议在 `packages/ui` 中创建而非直接在 `apps` 中写死。
4. **禁止行为**: 禁止使用 `axios` 或 `fetch` 直接调用内部接口，必须使用 `tRPC` 客户端。

---

### 如何使用此文档？

* **开发者**: 在实现新功能前，先按此顺序检查：`db` -> `api` -> `ui` -> `app`。
* **AI (Cursor/Claude)**: 在对话开始时输入：“*请阅读 ai-docs/project-dev-guide.md，并基于此规范为我实现 [功能名称] 的全栈逻辑。*”