import { Promotion as APIPromotion } from "@graphql/generates";

export type PromotionStatus = "active" | "upcoming" | "disabled" | "past"
export type PromotionType = "order-discount" | "item-discount" | "shipping-discount"

export enum CalculationType {
  Percentage = "percentage",
  Fixed = "fixed",
  Flat = "flat"
}

export enum Stackability {
  None = "none",
  All = "all"
}

export interface Promotion extends Omit<APIPromotion, "__typename" | "actions" | "promotionType"> {
  promotionType: PromotionType
  actions: {
    actionKey: string
    actionParameters?: {
      discountType: string
      discountValue: number
      discountCalculationType: CalculationType
    }
  }[]
}


