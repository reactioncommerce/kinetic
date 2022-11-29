import { Promotion as APIPromotion } from "@graphql/generates";

export type PromotionStatus = "active" | "upcoming" | "disabled" | "past"
export type PromotionType = "order-discount" | "item-discount" | "shipping-discount"
export type CalculationType = "percentage" | "fixed" | "flat"
export type Stackability = "none" | "all"

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
  triggers: {
    triggerKey: string
    triggerParameters?: {
      name: string
      conditions: {
        all: {
          fact: string
          operator: string
          value: number
        }[]
      }
    }
  }[]
}


