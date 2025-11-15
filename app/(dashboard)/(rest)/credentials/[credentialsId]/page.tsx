import {
  CredentialsError,
  CredentialsLoading,
} from "@/features/credential/components/credential";
import { CredentialView } from "@/features/credential/components/credentials";
import { prefetchCredentialById } from "@/features/credential/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    credentialsId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialsId } = await params;
  prefetchCredentialById(credentialsId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback={<CredentialsLoading />}>
              <CredentialView credentialsId={credentialsId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;
