import { FlatRateFulfillmentMethod } from "@graphql/types";

export type ShippingMethod = Pick<
  FlatRateFulfillmentMethod,
  "_id" | "group" | "label" | "name" | "cost" | "isEnabled" | "rate" | "handling" | "fulfillmentTypes"
>;

export enum FulfillmentGroup {
  Free = "Free",
  Ground = "Ground",
  OneDay = "One Day",
  Priority = "Priority"
}
