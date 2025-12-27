import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const pingRouter = {
  ping: publicProcedure.query(() => "pong"),
} satisfies TRPCRouterRecord;
