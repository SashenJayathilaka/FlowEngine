"use client";

import { NodeType } from "@/lib/generated/prisma";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNode: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger Manually",
    description:
      "Runs the flow on clicking the manual trigger button. Good for getting start manually.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Trigger on Google Form Submission",
    description: "Runs the flow when a Google Form is submitted.",
    icon: "/images/Google_Forms_logo.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Trigger on Stripe Event",
    description: "Runs the flow when a Stripe event occurs",
    icon: "/images/Stripe_logo.png",
  },
];

const executionNode: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request to a specified URL.",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini AI",
    description: "Interact with Google's Gemini AI models.",
    icon: "/images/gemini_icon.png",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "OpenAI's powerful language models at your fingertips.",
    icon: "/images/openai.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Anthropic's powerful AI models at your fingertips.",
    icon: "/images/anthropic.svg",
  },
  {
    type: NodeType.DEEPSEEK,
    label: "Deepseek AI",
    description: "Deepseek's powerful AI models at your fingertips.",
    icon: "/images/Deepseek-logo-icon.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Interact with Discord's API and events.",
    icon: "/images/discord-icon.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Interact with Slack's API and events.",
    icon: "/images/Slack_icon.svg",
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();

        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );

        if (hasManualTrigger) {
          toast.error(
            "You can only have one Manual Trigger node per workflow."
          );
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-background/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader className="pb-4 border-b border-border/40">
          <SheetTitle className="text-lg font-bold tracking-tight">Add a node</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground/70">
            Choose what happens in your workflow.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 px-1 mb-2">
            Triggers
          </p>
          {triggerNode.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="flex items-center gap-4 px-3 py-3.5 rounded-lg cursor-pointer hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group mb-1"
                onClick={() => {
                  handleNodeSelect(nodeType);
                }}
              >
                <div className="size-9 rounded-lg bg-muted/60 group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors duration-200 border border-border/40 group-hover:border-primary/30">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain"
                    />
                  ) : (
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-semibold text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                    {nodeType.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60 truncate w-full">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-4 opacity-40" />

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 px-1 mb-2">
            Actions
          </p>
          {executionNode.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="flex items-center gap-4 px-3 py-3.5 rounded-lg cursor-pointer hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group mb-1"
                onClick={() => {
                  handleNodeSelect(nodeType);
                }}
              >
                <div className="size-9 rounded-lg bg-muted/60 group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors duration-200 border border-border/40 group-hover:border-primary/30">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain"
                    />
                  ) : (
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-semibold text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                    {nodeType.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60 truncate w-full">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
