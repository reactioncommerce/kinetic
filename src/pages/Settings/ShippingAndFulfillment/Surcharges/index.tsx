import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import {
  Table,
  TableAction,
  TableContainer,
  useTableState
} from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingSurchargesQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterNodes";
import { Money, SurchargeDestinationRestrictions } from "@graphql/types";
import { Surcharge } from "types/surcharges";


const Surcharges = () => {
  const { shopId } = useShop();

  const columns: ColumnDef<Surcharge>[] = useMemo(() => [
    {
      accessorFn: (row) => row.messagesByLanguage?.[0]?.content,
      header: "Nickname"
    },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: (info) => {
        const rowValue = info.getValue<SurchargeDestinationRestrictions>();
        const totalCountry = rowValue?.country?.length ?? 0;
        const totalPostal = rowValue?.postal?.length ?? 0;
        const totalRegion = rowValue?.region?.length ?? 0;
        const totalDestinations = totalCountry + totalRegion + totalPostal;

        return (
          <>
            {totalDestinations === 1 ? "1 Destination" : `${totalDestinations} Destinations`}
          </>
        );
      }
    },
    {
      accessorKey: "methodIds",
      header: "Methods",
      cell: (info) =>
        <>
          {info.getValue<string[]>()?.length === 1 ? "1 Method" : `${info.getValue<string[]>()?.length} Methods`}
        </>
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => info.getValue<Money>().displayAmount,
      meta: {
        align: "right"
      }
    }
  ], []);

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
        totalCount={data?.surcharges.totalCount ?? 0}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <LocalShippingOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Shipping Surcharges</Typography>
              <Typography variant="body2" color="grey.600">
                Get started by adding your first shipping surcharge.
              </Typography>
            </div>
            <Button variant="contained" size="small" sx={{ width: "120px" }}>
              Add
            </Button>
          </Stack>
        }
      />
    </TableContainer>
  );
};

export default Surcharges;
