import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.execution.getMany>;

/** Prefetch execution data */

export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.execution.getMany.queryOptions(params));
};

/** Prefetch execution data for a specific ID */

export const prefetchExecutionById = (id: string) => {
  return prefetch(trpc.execution.getOne.queryOptions({ id }));
};
