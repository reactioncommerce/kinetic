import { Promotion as APIPromotion } from "@graphql/generates";

export type CalculationType = "percentage" | "amount"
export type Promotion = Omit<APIPromotion, "__typename" | "actions"> & {
  actions: {
    actionKey: string
    actionParameters?: {
      discountType: string
      discountValue: number
      discountCalculationType: CalculationType
    }
  }[]
}

export type PromotionType = "order-discount" | "item-discount" | "shipping-discount"
