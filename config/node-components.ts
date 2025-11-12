import { InitialNode } from "@/components/initial-node";
import { GeminiNode } from "@/features/triggers/components/geminai/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { HttpRequestNode } from "@/features/triggers/components/http-request-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { OpenAiNode } from "@/features/triggers/components/openai/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger copy/node";
import { NodeType } from "@/lib/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
