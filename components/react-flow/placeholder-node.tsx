"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { forwardRef, type ReactNode } from "react";
import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, onClick }, ref) => {
    return (
      <BaseNode
        ref={ref}
        className="w-auto h-auto border-dashed border-primary/40 bg-primary/5 p-5 text-center text-primary/50 shadow-none cursor-pointer hover:border-primary/70 hover:bg-primary/10 hover:text-primary/80 transition-all duration-200"
        onClick={onClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: "hidden" }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type="source"
          style={{ visibility: "hidden" }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  }
);

PlaceholderNode.displayName = "PlaceholderNode";
