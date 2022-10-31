import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import Typography from "@mui/material/Typography";

import { useGetCustomersQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Table, TableContainer, useTableState } from "@components/Table";
import { filterNodes, formatDate } from "@utils/common";
import { Customer } from "types/customers";

const Customers = () => {
  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading } = useGetCustomersQuery(
    client,
    { first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize }
  );

  const columns = useMemo((): ColumnDef<Customer>[] => [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: (info) => info.getValue() ?? "--"
    },
    {
      accessorKey: "userId",
      header: "User ID"
    },
    {
      accessorKey: "primaryEmailAddress",
      header: "Email"
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      cell: (info) => formatDate(new Date(info.getValue()))
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
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
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
