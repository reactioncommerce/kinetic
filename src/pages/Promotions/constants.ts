import { SelectOptionType } from "types/common";
import { CalculationType, PromotionType } from "types/promotions";

export const CALCULATION_TYPE_OPTIONS: Record<CalculationType, SelectOptionType<CalculationType> & {symbol?: string}> = {
  percentage: { label: "% Off", value: CalculationType.Percentage, symbol: "%" },
  fixed: { label: "$ Off", value: CalculationType.Fixed, symbol: "$" },
  flat: { label: "Free Shipping", value: CalculationType.Flat }
};

export const PROMOTION_TYPE_OPTIONS: Record<PromotionType, SelectOptionType<PromotionType>> = {
  "order-discount": { label: "Order Discount", value: "order-discount" },
  "item-discount": { label: "Item Discount", value: "item-discount" },
  "shipping-discount": { label: "Shipping Discount", value: "shipping-discount" }
};

export const DATE_FORMAT = "yyyy-MM-dd";

export const TODAY = new Date();
