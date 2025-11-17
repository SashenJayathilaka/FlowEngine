import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionsParams } from "./use-execution-params";

export const useSuspendExecutions = () => {
  const trpc = useTRPC();

  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.execution.getMany.queryOptions(params));
};

export const useSuspendExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.execution.getOne.queryOptions({ id }));
};
