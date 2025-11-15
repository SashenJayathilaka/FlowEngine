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
import type { Credential } from "@/lib/generated/prisma";
import { CredentialType } from "@/lib/generated/prisma";
import { formatDistance } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import {
  useRemoveCredential,
  useSuspendCredentials,
} from "../hooks/use-credential";
import { useCredentialsParams } from "../hooks/use-credential-params";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { onSearchChange, searchValue } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntrySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials..."
    />
  );
};

const CredentialsList = () => {
  const credentials = useSuspendCredentials();

  return (
    <EntryList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export default CredentialsList;

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntryHeader
        title="Credentials"
        description="Create and manage your credentials for various services."
        newButtonHref="/credentials/new"
        newButtonLabel="New credential"
        disabled={disabled}
      />
    </>
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspendCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntryPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPage}
      page={credentials.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntryContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntryContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView entity="Loading credentials..." />;
};
export const CredentialsError = () => {
  return <ErrorView message="Failed to load credentials." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };

  return (
    <EmptyView
      onNew={handleCreate}
      message="No credentials found. Create your first credential."
    />
  );
};

const CredentialsLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/images/openai.svg",
  [CredentialType.ANTHROPIC]: "/images/anthropic.svg",
  [CredentialType.GEMINI]: "/images/gemini_icon.png",
  [CredentialType.DEEPSEEK]: "/images/Deepseek-logo-icon.svg",
};

export const CredentialsItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = CredentialsLogos[data.type] || "/images/openai.svg";

  return (
    <EntryItem
      href={`/credentials/${data.id}`}
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
          <Image src={logo} alt={data.type} width={30} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
