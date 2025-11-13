import { NodeExecutor } from "@/features/execution/types";
import { openaiChannel } from "@/inngest/channels/openai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { AVAILABLE_MODELS } from "./dialog";
import { deepseekChannel } from "@/inngest/channels/deepseek";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export type DeepseekRequestData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

export const deepseekRequestExecutor: NodeExecutor<
  DeepseekRequestData
> = async ({ data, context, nodeId, step, publish }) => {
  await publish(
    deepseekChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is required");
  }

  if (!data.userPrompt) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("User prompt is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credentialValues = process.env.DEEPSEEK_API_KEY || "";

  const deepseek = createDeepSeek({
    apiKey: credentialValues,
  });

  try {
    const { steps } = await step.ai.wrap(
      "deepseek-generate-text",
      generateText,
      {
        model: deepseek("gpt-4"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      deepseekChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      deepseekChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
