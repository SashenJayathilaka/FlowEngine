import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

/** Prefetch workflows data */

export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/** Prefetch workflows data for a specific ID */

export const prefetchWorkflowById = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
