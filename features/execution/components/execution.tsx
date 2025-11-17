"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExecutionStatus } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
  ExternalLinkIcon,
  Loader2Icon,
  PlayIcon,
  TimerIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSuspendExecution } from "../hooks/use-execution";

const getStatusConfig = (status: ExecutionStatus) => {
  const configs = {
    [ExecutionStatus.SUCCESS]: {
      icon: CheckCircle2Icon,
      label: "Success",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      variant: "default" as const,
    },
    [ExecutionStatus.FAILED]: {
      icon: XCircleIcon,
      label: "Failed",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      variant: "destructive" as const,
    },
    [ExecutionStatus.RUNNING]: {
      icon: Loader2Icon,
      label: "Running",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      variant: "secondary" as const,
    },
    default: {
      icon: ClockIcon,
      label: "Pending",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-muted",
      variant: "outline" as const,
    },
  };

  return configs[status] || configs.default;
};

const StatusBadge = ({ status }: { status: ExecutionStatus }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 font-semibold",
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon
        className={cn("size-4", config.color, {
          "animate-spin": status === ExecutionStatus.RUNNING,
        })}
      />
      {config.label}
    </Badge>
  );
};

const InfoItem = ({
  label,
  value,
  icon: Icon,
  href,
  children,
}: {
  label: string;
  value?: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="size-4 text-muted-foreground" />}
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
    </div>
    {children ||
      (href ? (
        <Link
          href={href}
          className="flex items-center gap-1 text-lg font-semibold text-primary hover:underline transition-colors"
        >
          {value}
          <ExternalLinkIcon className="size-4" />
        </Link>
      ) : (
        <p className="text-lg font-semibold">{value}</p>
      ))}
  </div>
);

const CodeBlock = ({
  title,
  content,
  language = "json",
  variant = "default",
}: {
  title: string;
  content: string;
  language?: string;
  variant?: "default" | "error";
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={cn({
        "border-red-200": variant === "error",
      })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CodeIcon className="size-4" />
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-2"
          >
            <CopyIcon className="size-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea
          className={cn("rounded-md border p-4", {
            "h-48": variant === "default",
            "h-64": variant === "error",
            "bg-red-50 border-red-200": variant === "error",
          })}
        >
          <pre
            className={cn("text-sm font-mono whitespace-pre-wrap", {
              "text-red-800": variant === "error",
            })}
          >
            {content}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspendExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000
      )
    : null;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <StatusBadge status={execution.status} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs">
                    {executionId.slice(0, 8)}...
                  </code>
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl font-bold">
                  {execution.workflow?.name}
                </CardTitle>
                <CardDescription className="text-base">
                  Workflow execution details and runtime information
                </CardDescription>
              </div>
            </div>

            <Button asChild variant="outline">
              <Link href={`/workflows/${execution.workflowId}`}>
                <PlayIcon className="size-4 mr-2" />
                View Workflow
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Execution Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="size-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              label="Started"
              value={formatDistanceToNow(new Date(execution.startedAt), {
                addSuffix: true,
              })}
              icon={ClockIcon}
            />

            {execution.completedAt && (
              <InfoItem
                label="Completed"
                value={formatDistanceToNow(new Date(execution.completedAt), {
                  addSuffix: true,
                })}
                icon={CheckCircle2Icon}
              />
            )}

            {duration !== null && (
              <InfoItem
                label="Duration"
                value={formatDuration(duration)}
                icon={TimerIcon}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoItem
              label="Workflow Name"
              value={execution.workflow?.name}
              href={`/workflows/${execution.workflowId}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Event</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoItem
              label="Inngest Event ID"
              value={execution.inngestEventId}
            />
          </CardContent>
        </Card>
      </div>

      {/* Error Section */}
      {execution.error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircleIcon className="size-5 text-red-600" />
                <CardTitle className="text-red-900">Execution Failed</CardTitle>
              </div>
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-300"
                  >
                    {showStackTrace ? (
                      <ChevronUpIcon className="size-4 mr-2" />
                    ) : (
                      <ChevronDownIcon className="size-4 mr-2" />
                    )}
                    {showStackTrace ? "Hide" : "Show"} Stack Trace
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
            <CardDescription className="text-red-700">
              {execution.error}
            </CardDescription>
          </CardHeader>

          {showStackTrace && execution.errorStack && (
            <CardContent className="pt-0">
              <CodeBlock
                title="Stack Trace"
                content={execution.errorStack}
                variant="error"
              />
            </CardContent>
          )}
        </Card>
      )}

      {/* Output Section */}
      {execution.output && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CodeIcon className="size-4" />
                Execution Output
              </CardTitle>
              <Collapsible open={showOutput} onOpenChange={setShowOutput}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    {showOutput ? (
                      <ChevronUpIcon className="size-4 mr-2" />
                    ) : (
                      <ChevronDownIcon className="size-4 mr-2" />
                    )}
                    {showOutput ? "Hide" : "Show"} Output
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </CardHeader>

          {showOutput && (
            <CardContent className="pt-0">
              <CodeBlock
                title="Output Data"
                content={JSON.stringify(execution.output, null, 2)}
              />
            </CardContent>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 justify-end">
        <Button asChild variant="outline">
          <Link href={`/workflows/${execution.workflowId}/executions`}>
            View All Executions
          </Link>
        </Button>
        {execution.status === ExecutionStatus.FAILED && (
          <Button>
            <PlayIcon className="size-4 mr-2" />
            Retry Execution
          </Button>
        )}
      </div>
    </div>
  );
};
