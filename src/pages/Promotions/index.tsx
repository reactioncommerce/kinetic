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
import Checkbox from "@mui/material/Checkbox";
import { noop, startCase } from "lodash-es";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
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
  upcoming: { label: "Upcoming" },
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

  if (isAfter(new Date(promotion.startDate), TODAY)) return "upcoming";
  if (!promotion.enabled) return "disabled";
  if (promotion.endDate && isBefore(new Date(promotion.endDate), TODAY)) return "past";

  return "disabled";
};

const getStatusText = (status: PromotionStatus, enabled: boolean) => {
  if (status === "upcoming") {
    return enabled ? "enabled" : "disabled";
  }
  return status;
};

const Promotions = () => {
  const [searchParams, setSearchParams] = useSearchParams({ type: "active" });
  const { shopId } = useShop();

  const activeTab = (searchParams.get("type") || "active") as PromotionFilterKey;
  const defaultSortingState: SortingState = [{ id: "label", desc: false }];

  const { pagination, handlePaginationChange, sorting, onSortingChange, rowSelection, onRowSelectionChange } = useTableState(defaultSortingState);

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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          inputProps={{ "aria-label": "select all promotions" }}
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
          inputProps={{ "aria-label": "select promotion" }}
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
        const statusText = getStatusText(status, promotion.enabled);
        return <Chip
          icon={<FiberManualRecordIcon sx={{ height: "8px", width: "8px" }} />}
          color={status === "active" ? "success" : "default"}
          size="small"
          label={startCase(statusText)}
        />;
      },
      enableSorting: false,
      meta: {
        align: "right"
      }
    }
  ], []);

  const handleChangeTab = (value: string) => {
    setSearchParams({ type: value });
    onRowSelectionChange({});
  };

  const disabledActionItem = Object.keys(rowSelection).length === 0;
  return (
    <Container sx={{ padding: "20px 30px" }} maxWidth={false}>
      <Typography variant="h5" gutterBottom>Promotions</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "grey.200", marginBottom: 3 }}>
        <Tabs value={activeTab} onChange={(_, value) => handleChangeTab(value)}>
          {Object.keys(TAB_VALUES).map((key) => <Tab disableRipple key={key} value={key} label={TAB_VALUES[key as PromotionFilterKey].label}/>)}
        </Tabs>
      </Box>
      <TableContainer>
        <TableContainer.Header
          title="Promotions"
          action={<MenuActions
            options={
              [
                { label: "Create New", onClick: noop },
                { label: "Duplicate", onClick: noop, disabled: disabledActionItem },
                { label: "Enable", onClick: noop, disabled: disabledActionItem },
                { label: "Disable", onClick: noop, disabled: disabledActionItem }
              ]
            }
            renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
          />}
        />
        <Table
          columns={columns}
          data={data?.promotions || []}
          loading={isLoading}
          tableState={{ pagination, sorting, rowSelection }}
          onPaginationChange={handlePaginationChange}
          onRowSelectionChange={onRowSelectionChange}
          onSortingChange={onSortingChange}
          maxHeight={600}
        />
      </TableContainer>
    </Container>
  );
};

export default Promotions;
