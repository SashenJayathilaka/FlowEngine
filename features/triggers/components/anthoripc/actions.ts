"use server";

import { anthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type AnthropicRequestToken = Realtime.Token<
  typeof anthropicChannel,
  ["status"]
>;

export async function fetchAnthropicRequestRealTimeToken(): Promise<AnthropicRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });
  return token;
}
