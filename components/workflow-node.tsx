"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar className="flex gap-1 bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg p-1 shadow-lg shadow-black/20">
          <Button
            size="sm"
            variant="ghost"
            className="size-7 p-0 hover:bg-accent/60 hover:text-primary text-muted-foreground transition-all duration-200"
            onClick={onSettings}
          >
            <SettingsIcon className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-7 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-200"
            onClick={onDelete}
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center bg-card/80 backdrop-blur-sm border border-border/40 rounded-lg px-3 py-1.5 shadow-md shadow-black/20"
        >
          <p className="font-semibold text-sm text-foreground/90">{name}</p>
          {description && (
            <p className="text-muted-foreground/60 truncate text-xs mt-0.5">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
}
