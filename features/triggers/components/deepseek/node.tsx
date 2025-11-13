"use client ";

import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channels/deepseek";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../../../execution/components/base-execution-node";
import { useNodeStatus } from "../../../execution/hooks/use-node-status";
import { fetchDeepseekRequestRealTimeToken } from "./actions";
import { AVAILABLE_MODELS, DeepseekDialog, DeepseekFormValues } from "./dialog";

type DeepseekNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type DeepseekNodeType = Node<DeepseekNodeData>;

export const DeepseekNode = memo((props: NodeProps<DeepseekNodeType>) => {
  const nodeData = props.data;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DEEPSEEK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDeepseekRequestRealTimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DeepseekFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : "Not configured";

  return (
    <>
      <DeepseekDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/images/Deepseek-logo-icon.svg"
        name="Deepseek AI"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DeepseekNode.displayName = "DeepseekNode";
