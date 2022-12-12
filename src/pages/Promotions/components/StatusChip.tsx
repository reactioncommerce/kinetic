import { isAfter } from "date-fns";
import Chip from "@mui/material/Chip";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { startCase } from "lodash-es";

import { PromotionState } from "@graphql/generates";
import { Promotion, PromotionTabs } from "types/promotions";
import { TODAY } from "../constants";

const checkStatus: Record<PromotionTabs, (promotion: Promotion) => boolean> = {
  active: (promotion) => promotion.enabled && promotion.state === PromotionState.Active,
  upcoming: (promotion) => isAfter(new Date(promotion.startDate), TODAY),
  disabled: (promotion) => !promotion.enabled,
  past: (promotion) => promotion.state === PromotionState.Completed,
  archived: (promotion) => promotion.state === PromotionState.Archived,
  viewAll: () => true
};

const getStatusText = (promotion: Promotion) => {
  if (checkStatus.archived(promotion)) return "archived";
  if (checkStatus.active(promotion)) return "active";
  if (checkStatus.disabled(promotion)) return "disabled";
  if (checkStatus.past(promotion)) return "past";
  if (promotion.enabled) return "enabled";
  return "disabled";
};

type StatusChipProps = {
  promotion: Promotion
}

export const StatusChip = ({ promotion }: StatusChipProps) => {
  const statusText = getStatusText(promotion);
  return <Chip
    icon={<FiberManualRecordIcon sx={{ height: "8px", width: "8px" }} />}
    color={statusText === "active" ? "success" : "default"}
    size="small"
    label={startCase(statusText)}
  />;
};
