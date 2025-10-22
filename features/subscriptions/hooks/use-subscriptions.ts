import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...reset } = useSubscriptions();

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscriptions: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...reset,
  };
};
