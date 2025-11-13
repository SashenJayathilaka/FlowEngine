import { anthropicRequestExecutor } from "@/features/triggers/components/anthoripc/executor";
import { deepseekRequestExecutor } from "@/features/triggers/components/deepseek/executor";
import { geminiRequestExecutor } from "@/features/triggers/components/geminai/executor";
import { GoogleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { openaiRequestExecutor } from "@/features/triggers/components/openai/executor";
import { StripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger copy/executor";
import { NodeType } from "@/lib/generated/prisma";
import { httpRequestExecutor } from "../../triggers/components/http-request-trigger/executor";
import { NodeExecutor } from "../types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
  [NodeType.GEMINI]: geminiRequestExecutor,
  [NodeType.OPENAI]: openaiRequestExecutor,
  [NodeType.ANTHROPIC]: anthropicRequestExecutor,
  [NodeType.DEEPSEEK]: deepseekRequestExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};

// https:jsonplaceholder.typicode.com/todos/1
