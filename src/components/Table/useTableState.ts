import { PaginationState, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const useTableState = (defaultSortingState?: SortingState) => {
  const [{ pageIndex, pageSize }, setPagination] =
  useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const [sorting, setSorting] =
  useState<SortingState>(defaultSortingState || []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  return { pagination, handlePaginationChange: setPagination, onSortingChange: setSorting, sorting };
};
