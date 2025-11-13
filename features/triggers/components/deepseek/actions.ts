"use server";

import { deepseekChannel } from "@/inngest/channels/deepseek";
import { openaiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type DeepseekRequestToken = Realtime.Token<
  typeof deepseekChannel,
  ["status"]
>;

export async function fetchDeepseekRequestRealTimeToken(): Promise<DeepseekRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: deepseekChannel(),
    topics: ["status"],
  });
  return token;
}
