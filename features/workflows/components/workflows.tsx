"use client";

import { EntryContainer, EntryHeader } from "@/components/entry-components";
import React from "react";
import { useCreateWorkflow, useSuspendWorkflows } from "../hooks/use-workflows";
import UseUpgradeModel from "@/hooks/use-upgrade-modle";
import { useRouter } from "next/navigation";

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

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntryContainer
      header={<WorkflowHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntryContainer>
  );
};
