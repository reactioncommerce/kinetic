import { Promotion as APIPromotion } from "@graphql/generates";

export type PromotionStatus = "active" | "upcoming" | "disabled" | "past"
export enum PromotionType {
  OrderDiscount = "order-discount",
  ItemDiscount = "item-discount",
  ShippingDiscount = "shipping-discount"
}

export enum CalculationType {
  Percentage = "percentage",
  Fixed = "fixed",
  Flat = "flat"
}

export enum Stackability {
  None = "none",
  All = "all"
}

export type Trigger = {
  triggerKey: string
  triggerParameters?: {
    name: string
    conditions: {
      all: {
        fact: string
        operator: string
        value: number
        triggerType?: string
      }[]
    }
  }
}
export interface Promotion extends Omit<APIPromotion, "__typename" | "actions" | "promotionType" | "triggers"> {
  promotionType: PromotionType
  actions: {
    actionKey: string
    actionParameters?: {
      discountType: string
      discountValue: number
      discountCalculationType: CalculationType
      inclusionRules?: {
        conditions: {
          all: {
          fact: string
          operator: string
          value: string
          path: string
        }[]
      }
      }
    }
  }[]
  triggers?: Trigger[]
}


