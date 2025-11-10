import { NodeExecutor } from "@/features/execution/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerData = Record<string, unknown>;

export const GoogleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ context, nodeId, step, publish }) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("google-form-trigger", async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
