import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import {
  useGetShippingMethodsQuery
} from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterNodes";
import { ShippingMethod } from "types/shippingMethod";

const columns: ColumnDef<ShippingMethod>[] = [
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
    accessorKey: "rate",
    header: "S&H Fee"
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
];

const ShippingMethods = () => {
  const { shopId } = useShop();

  const { pagination, handlePaginationChange } = useTableState();

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
      />
    </TableContainer>
  );
};

export default ShippingMethods;
