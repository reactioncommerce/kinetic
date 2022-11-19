import { Stackability } from "@graphql/generates";
import { SelectOptionType } from "types/common";
import { CalculationType, PromotionType } from "types/promotions";

export const CALCULATION_OPTIONS: Record<CalculationType, SelectOptionType<CalculationType> & {symbol: string}> = {
  percentage: { label: "% Off", value: "percentage", symbol: "%" },
  amount: { label: "$ Off", value: "amount", symbol: "$" }
};

export const PROMOTION_TYPE_OPTIONS: Record<PromotionType, SelectOptionType<PromotionType>> = {
  "order-discount": { label: "Order Discount", value: "order-discount" },
  "item-discount": { label: "Item Discount", value: "item-discount" },
  "shipping-discount": { label: "Shipping Discount", value: "shipping-discount" }
};

export const DATE_FORMAT = "yyyy-MM-dd";

export const PROMOTION_STACKABILITY_OPTIONS: SelectOptionType<Stackability>[] = [
  { label: "Never Stackable", value: Stackability.None },
  { label: "Stack All", value: Stackability.All }
];
