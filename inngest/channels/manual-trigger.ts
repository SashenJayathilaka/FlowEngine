import { channel, topic } from "@inngest/realtime";

export const MANUAL_TRIGGER_CHANNEL_ID = "manual-trigger-execution";

export const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL_ID).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
