"use client";

import {
  EntryContainer,
  EntryHeader,
  EntryPagination,
  EntrySearch,
} from "@/components/entry-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import UseUpgradeModel from "@/hooks/use-upgrade-modle";
import { useRouter } from "next/navigation";
import React from "react";
import { useCreateWorkflow, useSuspendWorkflows } from "../hooks/use-workflows";
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
    <div className="flex flex-1 justify-center items-center">
      {JSON.stringify(workflows.data, null, 2)}
    </div>
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
