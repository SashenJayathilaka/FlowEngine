"use client";
import { ErrorView, LoadingView } from "@/components/entry-components";
import { usePrefetchWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading Editor" />;
};

const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = usePrefetchWorkflow(workflowId);

  return <p>{JSON.stringify(workflow, null, 2)}</p>;
};

export default Editor;
