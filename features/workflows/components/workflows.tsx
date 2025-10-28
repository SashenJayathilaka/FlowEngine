"use client";

import {
  EmptyView,
  EntryContainer,
  EntryHeader,
  EntryItem,
  EntryList,
  EntryPagination,
  EntrySearch,
  ErrorView,
  LoadingView,
} from "@/components/entry-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import UseUpgradeModel from "@/hooks/use-upgrade-modle";
import { Workflow } from "@/lib/generated/prisma";
import { formatDistance } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspendWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { onSearchChange, searchValue } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntrySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search workflows"
    />
  );
};

const Workflows = () => {
  const workflows = useSuspendWorkflows();

  return (
    <EntryList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowsItems data={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
};

export default Workflows;

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflows = useCreateWorkflow();
  const { handleError, modal } = UseUpgradeModel();

  const handleCreate = () => {
    createWorkflows.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EntryHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflows.isPending}
      />
    </>
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspendWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntryPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPage}
      page={workflows.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntryContainer
      header={<WorkflowHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntryContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView entity="Loading workflows..." />;
};
export const WorkflowsError = () => {
  return <ErrorView message="Failed to load workflows." />;
};

export const WorkflowsEmpty = () => {
  const router = useRouter();
  const createWorkflows = useCreateWorkflow();
  const { handleError, modal } = UseUpgradeModel();

  const handleCreate = () => {
    createWorkflows.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
    });
  };

  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You don't have any workflows yet. Get started by creating one."
      />
    </>
  );
};

export const WorkflowsItems = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };

  return (
    <EntryItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated{" "}
          {formatDistance(new Date(data.updatedAt), new Date(), {
            addSuffix: true,
          })}{" "}
          &bull; Created{" "}
          {formatDistance(new Date(data.createdAt), new Date(), {
            addSuffix: true,
          })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
