import { useNodeStatus } from "@/features/execution/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_ID } from "@/inngest/channels/manual-trigger";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { fetchManualTriggerRealTimeToken } from "./actions";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_ID,
    topic: "status",
    refreshToken: fetchManualTriggerRealTimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When Clicking 'Execute Workflow'"
        description="Trigger the workflow manually"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
