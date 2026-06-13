"use client";

import {
  EmptyView,
  EntryContainer,
  EntryHeader,
  EntryItem,
  EntryList,
  EntryPagination,
  ErrorView,
  LoadingView,
} from "@/components/entry-components";
import { useCredentialsParams } from "@/features/credential/hooks/use-credential-params";
import { Execution, ExecutionStatus } from "@/lib/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import React from "react";
import { useSuspendExecutions } from "../hooks/use-execution";

const ExecutionsList = () => {
  const executions = useSuspendExecutions();

  return (
    <EntryList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export default ExecutionsList;

export const ExecutionsHeader = () => {
  return (
    <>
      <EntryHeader
        title="Executions"
        description="Create and manage your executions for various services."
      />
    </>
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspendExecutions();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntryPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPage}
      page={executions.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntryContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntryContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView entity="Loading executions..." />;
};
export const ExecutionsError = () => {
  return <ErrorView message="Failed to load executions." />;
};

export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="No executions found. Create your first execution." />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-emerald-500" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-destructive" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-primary animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground/60" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionsItem = ({
  data,
}: {
  data: Execution & {
    workflow: { id: string; name: string } | null;
  };
}) => {
  const durations = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const subtitle = (
    <>
      {data.workflow?.name || "Unknown workflow"} &middot; Started at{" "}
      {formatDistanceToNow(new Date(data.startedAt), { addSuffix: true })}\
      {durations !== null && ` &middot; Duration: ${durations}s`}
    </>
  );

  return (
    <EntryItem
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
