import { Coupon as APICoupon } from "@graphql/generates";


export type CouponInput = {
  code: string
  name: string
  canUseInStore: boolean
  _id?: string
}

export type Coupon = APICoupon
