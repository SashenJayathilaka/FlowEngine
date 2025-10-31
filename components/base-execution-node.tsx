"use client";

import { NodeProps, Position } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";
import { BaseHandle } from "./react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "./react-flow/base-node";
import { WorkflowNode } from "./workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  // status? : NodeStatus
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseExecutionNode = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    //TODO: implement status indicator
    const handleDelete = () => {};

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  }
);

export default BaseExecutionNode;

BaseExecutionNode.displayName = "BaseExecutionNode";
