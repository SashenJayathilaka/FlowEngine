import { ExecutionView } from "@/features/execution/components/execution";
import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/execution/components/executions";
import { prefetchExecutionById } from "@/features/execution/components/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    executionsId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { executionsId } = await params;

  // Prefetch execution data for better performance
  await prefetchExecutionById(executionsId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Execution Details
              </h1>
              <p className="text-muted-foreground mt-2">
                View detailed information about workflow execution
              </p>
            </div>
          </div>

          {/* Execution ID Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Execution ID:
            </span>
            <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
              {executionsId.slice(0, 12)}...
            </code>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <HydrateClient>
            <ErrorBoundary
              fallback={
                <div className="space-y-4">
                  <ExecutionsError />
                  <div className="flex justify-center">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <div>
                          <p className="text-lg font-medium text-foreground">
                            Loading Execution
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fetching execution details...
                          </p>
                        </div>
                      </div>
                    </div>
                    <ExecutionsLoading />
                  </div>
                }
              >
                <ExecutionView executionId={executionsId} />
              </Suspense>
            </ErrorBoundary>
          </HydrateClient>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Workflow Execution</span>
            <span>Loaded at {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
