import { FlatRateFulfillmentMethod } from "@graphql/types";

export type ShippingMethod = Pick<FlatRateFulfillmentMethod, "_id" | "group" | "label" | "name" | "cost" | "isEnabled" | "rate">
