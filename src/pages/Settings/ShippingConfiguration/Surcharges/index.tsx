import { ColumnDef } from "@tanstack/react-table";

import {
  Table,
  TableAction,
  TableContainer,
  useTableState
} from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingSurchargesQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { Money, SurchargeDestinationRestrictions } from "@graphql/types";
import { Surcharge } from "types/surcharges";

const columns: ColumnDef<Surcharge>[] = [
  {
    id: "nickName",
    header: "Nickname",
    cell: "-"
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: (info) => (
      <>{`${
        info.getValue<SurchargeDestinationRestrictions>()?.country?.length ?? 0
      } Destinations`}</>
    )
  },
  {
    accessorKey: "methodIds",
    header: "Methods",
    cell: (info) => <>{info.getValue<string[]>()?.length} Methods</>
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => info.getValue<Money>().displayAmount
  }
];

const Surcharges = () => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading } = useGetShippingSurchargesQuery(client, {
    shopId: shopId!,
    first: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize
  });

  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Surcharges"
        action={<TableAction>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.surcharges.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
      />
    </TableContainer>
  );
};

export default Surcharges;
