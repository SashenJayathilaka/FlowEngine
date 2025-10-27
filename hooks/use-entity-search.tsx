import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMes?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMes = 500,
}: UseEntitySearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState(params.search);

  useEffect(() => {
    if (searchTerm === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });

      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm !== params.search) {
        setParams({
          ...params,
          search: searchTerm,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMes);

    return () => clearTimeout(timer);
  }, [searchTerm, params, setParams, debounceMes]);

  useEffect(() => {
    setSearchTerm(params.search);
  }, [params.search]);

  return { searchValue: searchTerm, onSearchChange: setSearchTerm };
}
