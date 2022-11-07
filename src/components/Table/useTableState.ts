import { PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const useTableState = (defaultSortingState?: SortingState) => {
  const [{ pageIndex, pageSize }, setPagination] =
  useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const [sorting, setSorting] =
  useState<SortingState>(defaultSortingState || []);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  return {
    pagination,
    sorting,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    handlePaginationChange: setPagination,
    onSortingChange: setSorting
  };
};
