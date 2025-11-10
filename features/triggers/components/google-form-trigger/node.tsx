import { useNodeStatus } from "@/features/execution/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_ID } from "@/inngest/channels/google-form-trigger";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { fetchGoogleFormTriggerRealTimeToken } from "./actions";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_ID,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealTimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/images/Google_Forms_logo.svg"
        name="Google Form"
        description="Trigger the workflow when a Google Form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
