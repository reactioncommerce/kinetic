import { SelectOptionType } from "types/common";
import { CalculationType, PromotionType } from "types/promotions";

export const CALCULATION_OPTIONS: Record<CalculationType, SelectOptionType<CalculationType>> = {
  percentage: { label: "% Off", value: "percentage" },
  amount: { label: "$ Off", value: "amount" }
};

export const PROMOTION_TYPE_OPTIONS: Record<PromotionType, SelectOptionType<PromotionType>> = {
  "order-discount": { label: "Order Discount", value: "order-discount" },
  "item-discount": { label: "Item Discount", value: "item-discount" },
  "shipping-discount": { label: "Shipping Discount", value: "shipping-discount" }
};
