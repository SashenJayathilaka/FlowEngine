import { channel, topic } from "@inngest/realtime";

export const HTTP_REQUEST_CHANNEL_ID = "http-request-execution";

export const httpRequestChannel = channel(HTTP_REQUEST_CHANNEL_ID).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
