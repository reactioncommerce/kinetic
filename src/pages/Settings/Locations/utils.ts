import * as Yup from "yup";

import { LocationType, Location } from "types/location";
import { filterNodes } from "@utils/common";

export const fulfillmentMethodOptions = [
  {
    label: "Shipping",
    value: "shipping"
  },
  {
    label: "Store Pickup",
    value: "pickup"
  },
  {
    label: "Ship to Store",
    value: "ship-to-store"
  },
  {
    label: "Local Delivery",
    value: "local-delivery"
  }
];
export const titleMapping = {
  [LocationType.Stores]: "Store",
  [LocationType.Warehouses]: "Warehouse"
};

export const pluralTitleMapping = {
  [LocationType.Stores]: "Stores",
  [LocationType.Warehouses]: "Warehouses"
};

export const locationSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  identifier: Yup.string().required("This field is required"),
  fulfillmentMethods: Yup.array().of(Yup.string()).required("This field is required"),
  address: Yup.object().shape({
    address1: Yup.string().required("This field is required"),
    country: Yup.object({
      label: Yup.string(),
      value: Yup.string()
    }).nullable().required("This field is required"),
    city: Yup.string().required("This field is required")
  }).required()
});

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const formatStoreHours = (storeHours?: Location["storeHours"]) => days.map((dayInWeek) => {
  const storeHour = filterNodes(storeHours).find(({ day }) => day === dayInWeek);
  return storeHour || { day: dayInWeek, open: null, close: null };
});
