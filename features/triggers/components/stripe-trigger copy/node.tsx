import { useNodeStatus } from "@/features/execution/hooks/use-node-status";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";

import { STRIPE_TRIGGER_CHANNEL_ID } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealTimeToken } from "./actions";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_ID,
    topic: "status",
    refreshToken: fetchStripeTriggerRealTimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/images/Stripe_logo.png"
        name="Stripe Trigger"
        description="Trigger the workflow when a Stripe event occurs"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
