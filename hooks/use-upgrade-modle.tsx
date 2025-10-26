import UpgradeModel from "@/components/upgrade-model";
import { TRPCClientError } from "@trpc/client";
import React, { useState } from "react";

const UseUpgradeModel = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = <UpgradeModel open={open} onOpenChange={setOpen} />;

  return { handleError, modal };
};

export default UseUpgradeModel;
