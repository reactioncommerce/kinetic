import { SelectOptionType } from "types/common";
import { CalculationType, PromotionType, Stackability, TriggerType, TriggerKeys } from "types/promotions";

export const CALCULATION_TYPE_OPTIONS: Record<CalculationType, SelectOptionType<CalculationType> & {symbol?: string}> = {
  percentage: { label: "% Off", value: CalculationType.Percentage, symbol: "%" },
  fixed: { label: "$ Off", value: CalculationType.Fixed, symbol: "$" },
  flat: { label: "Free Shipping", value: CalculationType.Flat }
};

export const PROMOTION_TYPE_OPTIONS: Record<PromotionType, SelectOptionType<PromotionType>> = {
  "order-discount": { label: "Order Discount", value: PromotionType.OrderDiscount },
  "item-discount": { label: "Item Discount", value: PromotionType.ItemDiscount },
  "shipping-discount": { label: "Shipping Discount", value: PromotionType.ShippingDiscount }
};

export const DISCOUNT_TYPES_MAP: Record<PromotionType, string> = {
  "order-discount": "order",
  "item-discount": "item",
  "shipping-discount": "shipping"
};

export const DATE_FORMAT = "yyyy-MM-dd";

export const PROMOTION_STACKABILITY_OPTIONS: SelectOptionType<Stackability>[] = [
  { label: "Never Stackable", value: Stackability.None },
  { label: "Stack with Any", value: Stackability.All }
];

export const TRIGGER_TYPE_MAP: Record<TriggerType, SelectOptionType & {triggerKey: TriggerKeys}> = {
  totalItemAmount: { label: "Cart Value is greater than", value: "totalItemAmount-greaterThanInclusive", triggerKey: TriggerKeys.Offers },
  totalItemCount: { label: "Item is in cart", value: "totalItemCount-greaterThanExclusive", triggerKey: TriggerKeys.Offers },
  couponStandard: { label: "Coupon is used (Standard)", value: "couponStandard", triggerKey: TriggerKeys.Coupons }
};

export const TRIGGER_TYPE_OPTIONS = Object.values(TRIGGER_TYPE_MAP);

export const OPERATOR_OPTIONS: SelectOptionType[] = [
  { label: "Is", value: "equal" },
  { label: "Is Any Of", value: "in" }
];

export const CONDITION_PROPERTIES_OPTIONS: SelectOptionType[] = [
  { label: "Vendor", value: "$.productVendor" },
  { label: "Product ID", value: "$.productId" },
  { label: "Title", value: "$.title" },
  { label: "Tag (Category)", value: "$.productTagIds" }
];

export const TODAY = new Date();

export const CONDITION_OPERATORS: Record<string, SelectOptionType & {fieldPrefix: string}> = {
  all: { label: "all", value: "all", fieldPrefix: "and" },
  any: { label: "any of", value: "any", fieldPrefix: "or" }
};

export const COUPON_USAGE: SelectOptionType<boolean>[] = [
  { label: "Online Only", value: false },
  { label: "Online and In Store", value: true }
];

export const NOOP_ACTION = "noop";
