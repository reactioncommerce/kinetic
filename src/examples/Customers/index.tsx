import Container from "@mui/material/Container";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { Table, TableAction, TableContainer, TableHeader, useTableState } from "@components/Table";

import { Customer, customers } from "./data";


const Customers = () => {
  const { pagination, handlePaginationChange } = useTableState();

  const columns = useMemo((): ColumnDef<Customer>[] => [
    {
      id: "name",
      header: "Name",
      cell: (info) =>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar alt={info.row.original.name}>{info.row.original.name[0]}</Avatar>
          {info.row.original.name}
        </Stack>
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      id: "location",
      header: "Location",
      cell: (info) => {
        const { state, city, country } = info.row.original.address;
        return `${state}, ${city}, ${country}`;
      }
    },
    {
      accessorKey: "phone",
      header: "Phone"
    },
    {
      accessorKey: "createdAt",
      header: "Registration date",
      cell: (data) => new Intl.DateTimeFormat("en-US").format(data.getValue())
    }
  ], []);

  return (
    <Container maxWidth={false} sx={{ padding: "20px 30px" }}>
      <TableContainer>
        <TableHeader title="Customers" action={<TableAction>Add</TableAction>}/>
        <Box sx={{ maxWidth: 300, pl: 2.5, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small"/>
                </InputAdornment>
              )
            }}
            placeholder="Search customer"
            variant="outlined"
          />
        </Box>
        <Table columns={columns}
          data={customers.slice(pagination.pageIndex * pagination.pageSize, pagination.pageSize + pagination.pageIndex * pagination.pageSize)}
          totalCount={customers.length}
          tableState={{ pagination }}
          onPaginationChange={handlePaginationChange}
        />
      </TableContainer>
    </Container>
  );
};

export default Customers;
