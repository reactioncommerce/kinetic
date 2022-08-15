import { lazy } from "react";

import { SubHeaderItemProps } from "@components/AppHeader";

const ShippingMethods = lazy(() => import("./Methods"));
const ShippingSurcharges = lazy(() => import("./Surcharges"));
const ShippingRestrictions = lazy(() => import("./Restrictions"));

export const SHIPPING_PAGE_FEATURES: SubHeaderItemProps[] = [
  {
    header: "Methods",
    path: "",
    key: "methods",
    element: <ShippingMethods/>,
    index: true
  },
  {
    header: "Restrictions",
    path: "restrictions",
    key: "restrictions",
    element: <ShippingRestrictions/>
  },
  {
    header: "Surcharges",
    path: "surcharges",
    key: "surcharges",
    element: <ShippingSurcharges/>
  }
];

