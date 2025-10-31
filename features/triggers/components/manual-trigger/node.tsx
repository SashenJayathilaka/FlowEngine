import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import BaseTriggerNode from "../base-execution-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When Clicking 'Execute Workflow'"
        description="Trigger the workflow manually"
        onSettings={() => {}}
        onDoubleClick={() => {}}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
