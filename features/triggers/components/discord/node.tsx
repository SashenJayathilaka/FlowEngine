"use client ";

import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "../../../execution/components/base-execution-node";
import { useNodeStatus } from "../../../execution/hooks/use-node-status";
import { fetchDiscordRequestRealTimeToken } from "./actions";
import { DiscordDialog, DiscordFormValues } from "./dialog";

type DiscordNodeData = {
  webhookUrl: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRequestRealTimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DiscordFormValues) => {
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

  const description = nodeData?.content
    ? `Send ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/images/discord-icon.svg"
        name="Discord"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
