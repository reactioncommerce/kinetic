import { Promotion as APIPromotion } from "@graphql/generates";

export type PromotionStatus = "active" | "upcoming" | "disabled" | "past" | "archived"
export type PromotionTabs = PromotionStatus | "viewAll"

export enum PromotionType {
  OrderDiscount = "order-discount",
  ItemDiscount = "item-discount",
  ShippingDiscount = "shipping-discount"
}

export enum TriggerKeys {
  Offers = "offers",
  Coupons = "coupons",
}

export enum CalculationType {
  Percentage = "percentage",
  Fixed = "fixed",
  Flat = "flat",
}

export enum TriggerType {
  ItemAmount = "totalItemAmount",
  ItemCount = "totalItemCount",
  CouponStandard = "couponStandard"
}

export enum TriggerType {
  ItemAmount = "totalItemAmount",
  ItemCount = "totalItemCount"
}

export enum Stackability {
  None = "none",
  All = "all"
}

export type RuleCondition = {
  fact: string,
  operator: string,
  value: string[],
  path: string
}

export type Rule = {
  conditions: {
    all?: RuleCondition[]
    any?: RuleCondition[]
  }
}

export type OffersTriggerParameters = {
  name: string
  conditions: {
    all: {
      fact: string
      operator: string
      value: number
      triggerType?: string
    }[]
  }
  inclusionRules?: Rule
  exclusionRules?: Rule
}

export type CouponsTriggerParameters = {
  name: string
  couponCode: string
  canUseInStore: boolean
}

export type Trigger<Key extends TriggerKeys = TriggerKeys.Offers> = {
  triggerKey: Key
  triggerParameters: Key extends TriggerKeys.Offers ? OffersTriggerParameters | undefined : CouponsTriggerParameters
}

export type Action = {
  actionKey: string
  actionParameters?: {
    discountType: string
    discountValue: number
    discountCalculationType: CalculationType
    inclusionRules?: Rule
    exclusionRules?: Rule
  }
}
export interface Promotion extends Omit<APIPromotion, "__typename" | "actions" | "promotionType" | "triggers"> {
  promotionType: PromotionType
  actions: Action[]
  triggers?: Trigger[]
}


