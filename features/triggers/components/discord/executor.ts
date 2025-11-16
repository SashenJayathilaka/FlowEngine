import { NodeExecutor } from "@/features/execution/types";
import { discordChannel } from "@/inngest/channels/discord";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export type DiscordRequestData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordRequestExecutor: NodeExecutor<DiscordRequestData> = async ({
  data,
  context,
  nodeId,
  step,

  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Content is required");
  }

  const rowContent = Handlebars.compile(data.content)(context);
  const content = decode(rowContent);
  const username = data.username
    ? Handlebars.compile(data.username)(context)
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Webhook URL is required");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Variable name is required");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      })
    );
    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
