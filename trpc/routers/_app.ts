import { credentialsRouter } from "@/features/credential/server/routers";
import { workflowsRouters } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
  credentials: credentialsRouter,
});

export type AppRouter = typeof appRouter;
