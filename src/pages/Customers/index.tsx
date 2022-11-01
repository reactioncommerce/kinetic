import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import Typography from "@mui/material/Typography";

import { useGetCustomersQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Table, TableContainer, useTableState } from "@components/Table";
import { filterNodes, formatDate } from "@utils/common";
import { Customer } from "types/customers";
import { AccountSortByField, SortOrder } from "@graphql/types";

const Customers = () => {
  const defaultSortingState: SortingState = [{ id: AccountSortByField.CreatedAt, desc: false }];

  const { pagination, handlePaginationChange, sorting, onSortingChange } = useTableState(defaultSortingState);

  const { data, isLoading } = useGetCustomersQuery(
    client,
    {
      first: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      sortBy: sorting[0]?.id as AccountSortByField,
      sortOrder: sorting[0]?.desc ? SortOrder.Desc : SortOrder.Asc
    }
  );

  const columns = useMemo((): ColumnDef<Customer>[] => [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: (info) => info.getValue() ?? "--",
      enableSorting: false
    },
    {
      accessorKey: "userId",
      header: "User ID",
      enableSorting: false
    },
    {
      accessorKey: "primaryEmailAddress",
      header: "Email",
      enableSorting: false
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      cell: (info) => formatDate(new Date(info.getValue())),
      enableSorting: true
    }
  ], []);

  const customers = filterNodes(data?.customers.nodes);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Customers"
      />
      <Table
        columns={columns}
        data={customers}
        loading={isLoading}
        tableState={{ pagination, sorting }}
        onPaginationChange={handlePaginationChange}
        onSortingChange={onSortingChange}
        totalCount={data?.customers.totalCount}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <FaceIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <Typography variant="h6" gutterBottom>No Customers</Typography>
          </Stack>}
      />

    </TableContainer>
  );
};

export default Customers;
