import { Coupon as APICoupon } from "@graphql/generates";


export type CouponCreateInput = {
  code: string
  name: string
  canUseInStore: boolean
}

export type Coupon = APICoupon
