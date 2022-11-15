import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { isBefore, isAfter, isSameDay } from "date-fns";
import Chip from "@mui/material/Chip";

import { useGetPromotionsQuery } from "@graphql/generates";
import { useShop } from "@containers/ShopProvider";
import { client } from "@graphql/graphql-request-client";
import { Table, TableContainer, useTableState } from "@components/Table";
import { filterNodes, formatDate } from "@utils/common";
import { CalculationType, Promotion, PromotionStatus, PromotionType } from "types/promotions";
import { SortOrder } from "@graphql/types";

import { CALCULATION_OPTIONS, PROMOTION_TYPE_OPTIONS } from "./constants";

type PromotionFilterKey = PromotionStatus | "viewAll"
const TAB_VALUES: Record<PromotionFilterKey, {label: string}> = {
  active: { label: "Active" },
  enabled: { label: "Upcoming" },
  disabled: { label: "Disabled" },
  past: { label: "Past" },
  viewAll: { label: "View All" }
};

const TODAY = new Date();

const getPromotionStatus = (promotion: Promotion): PromotionStatus => {
  if (promotion.enabled &&
    isBefore(new Date(promotion.startDate), TODAY)
  && (
    !promotion.endDate || isSameDay(new Date(promotion.endDate), TODAY) || isAfter(new Date(promotion.endDate), TODAY))
  ) return "active";

  if (promotion.enabled && isAfter(new Date(promotion.startDate), TODAY)) return "enabled";
  if (!promotion.enabled) return "disabled";
  if (promotion.endDate && isBefore(new Date(promotion.endDate), TODAY)) return "past";

  return "disabled";
};

const Promotions = () => {
  const [searchParams, setSearchParams] = useSearchParams({ type: "active" });
  const { shopId } = useShop();

  const activeTab = (searchParams.get("type") || "active") as PromotionFilterKey;
  const defaultSortingState: SortingState = [{ id: "label", desc: false }];

  const { pagination, handlePaginationChange, sorting, onSortingChange } = useTableState(defaultSortingState);

  const { data, isLoading } = useGetPromotionsQuery(client, {
    shopId: shopId!,
    first: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? SortOrder.Desc : SortOrder.Asc,
    filter: {
      shopId: shopId!,
      ...(activeTab === "active" ? { enabled: true } : {}),
      ...(activeTab === "disabled" ? { enabled: false } : {})
    }
  }, {
    keepPreviousData: true,
    select: (response) => {
      const promotions = filterNodes(response.promotions.nodes).map((promotion) => ({
        ...promotion,
        actions: filterNodes(promotion.actions)
      }));

      return {
        totalCount: response.promotions.totalCount,
        promotions: activeTab !== "viewAll" ? promotions.filter((promotion) => getPromotionStatus(promotion) === activeTab) : promotions
      };
    }
  });

  const columns = useMemo((): ColumnDef<Promotion>[] => [
    {
      accessorKey: "label",
      header: "Name"
    },
    {
      accessorKey: "promotionType",
      header: "Promotion Type",
      cell: (row) =>
        <Typography variant="body2">{PROMOTION_TYPE_OPTIONS[row.getValue<PromotionType>()]?.label || "Unknown"}</Typography>
    },
    {
      accessorFn: (row) => row.actions?.[0].actionParameters?.discountCalculationType,
      header: "Action",
      id: "actionType",
      enableSorting: false,
      cell: (row) =>
        <Typography variant="body2">{CALCULATION_OPTIONS[row.getValue<CalculationType>()]?.label || "Unknown"}</Typography>
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => <Typography variant="body2">{formatDate(new Date(getValue()))}</Typography>
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ getValue }) =>
        <Typography variant="body2">{getValue() ? formatDate(new Date(getValue())) : "--"}</Typography>
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const promotion = row.original;
        const status = getPromotionStatus(promotion);
        return <Chip
          color={status === "active" ? "success" : "default"}
          size="small"
          label={status.toUpperCase()}
        />;
      },
      enableSorting: false,
      meta: {
        align: "right"
      }
    }
  ], []);

  return (
    <Container sx={{ padding: "20px 30px" }} maxWidth={false}>
      <Typography variant="h5" gutterBottom>Promotions</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "grey.200", marginBottom: 3 }}>
        <Tabs value={activeTab} onChange={(_, value) => setSearchParams({ type: value })}>
          {Object.keys(TAB_VALUES).map((key) => <Tab disableRipple key={key} value={key} label={TAB_VALUES[key as PromotionFilterKey].label}/>)}
        </Tabs>
      </Box>
      <TableContainer>
        <TableContainer.Header
          title="Promotions"
        />
        <Table
          columns={columns}
          data={data?.promotions || []}
          loading={isLoading}
          tableState={{ pagination, sorting }}
          onPaginationChange={handlePaginationChange}
          onSortingChange={onSortingChange}
          totalCount={data?.totalCount}
          maxHeight={600}
        />
      </TableContainer>
    </Container>
  );
};

export default Promotions;
