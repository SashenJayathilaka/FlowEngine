import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{
    executionsId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { executionsId } = await params;

  return <div>Page{executionsId}</div>;
};

export default Page;
