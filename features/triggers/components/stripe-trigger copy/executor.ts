import { NodeExecutor } from "@/features/execution/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export type StripeTriggerData = Record<string, unknown>;

export const StripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("stripe-trigger", async () => context);

  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
