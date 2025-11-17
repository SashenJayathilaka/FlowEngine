import { credentialsRouter } from "@/features/credential/server/routers";
import { executionRouter } from "@/features/execution/components/server/routers";
import { workflowsRouters } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
  credentials: credentialsRouter,
  execution: executionRouter,
});

export type AppRouter = typeof appRouter;
