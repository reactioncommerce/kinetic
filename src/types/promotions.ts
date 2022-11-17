import { Promotion as APIPromotion } from "@graphql/generates";

export type PromotionStatus = "active" | "upcoming" | "disabled" | "past"
export type PromotionType = "order-discount" | "item-discount" | "shipping-discount"
export type CalculationType = "percentage" | "amount"

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


