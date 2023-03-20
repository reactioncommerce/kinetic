import { Location as APILocation } from "@graphql/generates";

export enum LocationType {
  Warehouses = "warehouse",
  Stores = "store"
}

export interface Location extends Omit<APILocation, "__typename" | "type"> {
  type: LocationType
}

export type StoreHours = Array<{
  day: string
  open: string | null
  close: string | null
}>
