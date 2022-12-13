import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { CSVLink } from "react-csv";

import { useGetCustomersQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { filterNodes, formatDate } from "@utils/common";
import { Customer } from "types/customers";
import { AccountSortByField, SortOrder } from "@graphql/types";

const exportHeaders = [
  { label: "Customer Name", key: "name" },
  { label: "User ID", key: "userId" },
  { label: "Email", key: "primaryEmailAddress" },
  { label: "Registered", key: "createdAt" }
];


const Customers = () => {
  const defaultSortingState: SortingState = [{ id: AccountSortByField.CreatedAt, desc: false }];

  const { pagination, handlePaginationChange, sorting, onSortingChange, rowSelection, onRowSelectionChange } = useTableState(defaultSortingState);

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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          inputProps={{ "aria-label": "select all customers" }}
          disableRipple
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler()
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          disableRipple
          inputProps={{ "aria-label": "select customer" }}
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      ),
      meta: {
        padding: "checkbox"
      }
    },
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
      enableSorting: true,
      meta: {
        align: "right"
      }
    }
  ], []);

  const customers = filterNodes(data?.customers.nodes);

  const getExportData = useMemo(() => (Object.keys(rowSelection).length ?
    customers.filter(({ _id }) => !!rowSelection[_id])
      .map((customer) => ({ ...customer, createdAt: formatDate(new Date(customer.createdAt)) })) : []), [customers, rowSelection]);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Customers"
        action={
          <TableAction disabled={!Object.keys(rowSelection).length} sx={{ "& a": { color: "inherit", textDecoration: "none" } }}>
            <CSVLink data={getExportData} headers={exportHeaders} filename="customers.csv">Export</CSVLink>
          </TableAction>
        }
      />
      <Table
        columns={columns}
        data={customers}
        loading={isLoading}
        tableState={{ pagination, sorting, rowSelection }}
        onPaginationChange={handlePaginationChange}
        onSortingChange={onSortingChange}
        onRowSelectionChange={onRowSelectionChange}
        totalCount={data?.customers.totalCount}
        getRowId={(row) => row._id}
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
