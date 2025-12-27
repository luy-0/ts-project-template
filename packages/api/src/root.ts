import { authRouter } from "./router/auth";
import { pingRouter } from "./router/ping";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  ping: pingRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
