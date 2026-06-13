import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type EntryHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntryHeader = ({
  title,
  description,
  disabled,
  isCreating,
  newButtonHref,
  newButtonLabel,
  onNew,
}: EntryHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col gap-y-0.5">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground/80">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          disabled={isCreating || disabled}
          onClick={onNew}
          size="sm"
          className="gap-x-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 border-0 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
        >
          {isCreating ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <PlusIcon className="size-3.5" />
          )}
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button
          size="sm"
          asChild
          className="gap-x-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 border-0 transition-all duration-200"
        >
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-3.5" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntryContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntryContainer = ({
  children,
  header,
  pagination,
  search,
}: EntryContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-8 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

export const EntrySearch = ({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        className="max-w-[220px] bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background pl-8 text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-1 focus:ring-primary/30"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntryPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
}

export const EntryPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntryPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground/70">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          className="border-border/60 hover:bg-accent/40 hover:border-primary/40 transition-all duration-200 text-xs"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          variant="outline"
          size="sm"
          className="border-border/60 hover:bg-accent/40 hover:border-primary/40 transition-all duration-200 text-xs"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

interface LoadingStateProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = ({ entity, message }: LoadingStateProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <div className="relative">
        <div className="size-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
          <Loader2Icon className="size-5 animate-spin text-primary" />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
      </div>
      <p className="text-sm text-muted-foreground/70 font-medium">
        {message || `Loading ${entity || "data"}...`}
      </p>
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <div className="size-10 rounded-full border border-destructive/30 bg-destructive/10 flex items-center justify-center">
        <AlertTriangleIcon className="size-5 text-destructive" />
      </div>
      {!!message && <p className="text-sm text-muted-foreground/70">{message}</p>}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border border-dashed border-border/50 bg-muted/20 backdrop-blur-sm rounded-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <ZapIcon className="size-7 text-primary/70" />
          </div>
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle className="text-foreground/80 font-semibold">No items found</EmptyTitle>
      {!!message && (
        <EmptyDescription className="text-muted-foreground/60 text-center max-w-xs">
          {message}
        </EmptyDescription>
      )}
      {!!onNew && (
        <EmptyContent>
          <Button
            onClick={onNew}
            className="gap-x-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 border-0 mt-2"
          >
            <PlusIcon className="size-4" />
            Add new item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntryListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export const EntryList = <T,>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntryListProps<T>) => {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

interface EntryItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntryItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntryItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 border border-border/50 bg-card/80 hover:bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 cursor-pointer transition-all duration-200 backdrop-blur-sm group",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors duration-200 p-1">
              {image}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs text-muted-foreground/60 mt-0.5">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-border/60 bg-popover/95 backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={handleRemove}
                      disabled={isRemoving}
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-x-2"
                    >
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
