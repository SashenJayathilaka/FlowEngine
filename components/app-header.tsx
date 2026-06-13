import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
      <div className="h-5 w-px bg-border/60" />
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-primary/60 animate-pulse" />
        <span className="text-xs text-muted-foreground font-medium">NodeBase</span>
      </div>
    </header>
  );
};

export default AppHeader;
