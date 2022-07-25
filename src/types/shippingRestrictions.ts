import { FlatRateFulfillmentRestriction } from "@graphql/types";

export type ShippingRestriction = Pick<
FlatRateFulfillmentRestriction,
  "_id" | "attributes" | "destination" | "methodIds" | "type"
>;
