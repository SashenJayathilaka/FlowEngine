import { workflowsRouters } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
});

export type AppRouter = typeof appRouter;
