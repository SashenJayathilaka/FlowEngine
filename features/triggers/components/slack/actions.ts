"use server";

import { slackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type SlackRequestToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackRequestRealTimeToken(): Promise<SlackRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });
  return token;
}
