import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{
    workflowsId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { workflowsId } = await params;

  return <div>Page{workflowsId}</div>;
};

export default Page;
