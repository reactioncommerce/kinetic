import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const useTableState = () => {
  const [{ pageIndex, pageSize }, setPagination] =
  useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  return { pagination, handlePaginationChange: setPagination };
};
