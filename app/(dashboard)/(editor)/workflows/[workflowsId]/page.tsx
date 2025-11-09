import { LoadingView } from "@/components/entry-components";
import Editor, { EditorError } from "@/features/editor/components/editor";
import EditorHeader from "@/features/editor/components/editor-header";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    workflowsId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { workflowsId } = await params;

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<LoadingView />}>
          <EditorHeader workflowId={workflowsId} />
          <main className="flex-1">
            <Editor workflowId={workflowsId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
