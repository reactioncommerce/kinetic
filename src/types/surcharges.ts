import { Surcharge as CoreSurcharge } from "@graphql/types";

export type Surcharge = Pick<
  CoreSurcharge,
  | "_id"
  | "amount"
  | "attributes"
  | "messagesByLanguage"
  | "methodIds"
  | "destination"
>;
