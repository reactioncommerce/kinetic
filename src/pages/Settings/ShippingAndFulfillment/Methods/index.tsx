import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useMemo } from "react";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import {
  useGetShippingMethodsQuery
} from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterNodes";
import { ShippingMethod } from "types/shippingMethod";


const ShippingMethods = () => {
  const { shopId } = useShop();

  const { pagination, handlePaginationChange } = useTableState();

  const columns = useMemo((): ColumnDef<ShippingMethod>[] => [
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "label",
      header: "Label"
    },
    {
      accessorKey: "group",
      header: "Group"
    },
    {
      id: "s&h fee",
      header: "S&H Fee",
      cell: (info) => `$${info.row.original.rate + info.row.original.handling}`
    },
    {
      accessorKey: "isEnabled",
      header: "Status",
      cell: (info) => (
        <Chip
          color={info.getValue() ? "success" : "warning"}
          size="small"
          label={info.getValue() ? "ENABLED" : "DISABLED"}
        />
      ),
      meta: {
        align: "right"
      }
    }
  ], []);

  const { data, isLoading } = useGetShippingMethodsQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize },
    {
      enabled: !!shopId,
      keepPreviousData: true
    }
  );


  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Methods"
        action={<TableAction>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.flatRateFulfillmentMethods.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <LocalShippingOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Shipping Methods</Typography>
              <Typography variant="body2" color="grey.600">Get started by adding your first shipping method.</Typography>
            </div>
            <Button variant="contained" size="small" sx={{ width: "120px" }}>
              Add
            </Button>
          </Stack>}
      />
    </TableContainer>
  );
};

export default ShippingMethods;
