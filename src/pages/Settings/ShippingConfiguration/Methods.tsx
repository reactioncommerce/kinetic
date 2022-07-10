
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { Table, TableAction, TableContainer } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingMethodsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { ShippingMethod } from "types/shippingMethods";


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
    header: () => <Stack direction="row" justifyContent="flex-end">Status</Stack>,
    cell: (info) => <Stack direction="row" justifyContent="flex-end"><Chip color="info" size="small" label={info.getValue() ? "ENABLED" : "DISABLED"}/></Stack>
  }
];

const ShippingMethods = () => {
  const { shopId } = useShop();

  const { data } = useGetShippingMethodsQuery(
    client,
    { shopId: shopId! },
    {
      enabled: !!shopId
    }
  );

  return <div>
    <TableContainer>
      <TableContainer.Header title="Shipping Methods" action={<TableAction>Add</TableAction>}/>
      <Table columns={columns} data={filterNodes(data?.flatRateFulfillmentMethods.nodes)}/>
    </TableContainer>
  </div>;
};

export default ShippingMethods;
