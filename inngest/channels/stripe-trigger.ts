import { channel, topic } from "@inngest/realtime";

export const STRIPE_TRIGGER_CHANNEL_ID = "stripe-trigger-execution";

export const stripeTriggerChannel = channel(STRIPE_TRIGGER_CHANNEL_ID).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
