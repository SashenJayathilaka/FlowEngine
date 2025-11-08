import { NodeExecutor } from "@/features/execution/types";

export type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
}) => {
  // For a manual trigger, we simply return the existing context without modification
  const result = await step.run("manual-trigger", async () => context);

  //TODO:

  return result;
};
