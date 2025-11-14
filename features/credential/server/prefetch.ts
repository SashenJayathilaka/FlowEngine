import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.credentials.getMany>;

/** Prefetch credentials data */

export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

/** Prefetch credentials data for a specific ID */

export const prefetchCredentialById = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
