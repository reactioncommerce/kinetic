import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import { SubHeaderItemProps } from "@components/AppHeader";

const ShippingMethods = lazy(() => import("./Methods"));
const ShippingSurcharges = lazy(() => import("./Surcharges"));
const ShippingRestrictions = lazy(() => import("./Restrictions"));

export const SHIPPING_PAGE_FEATURES: Array<SubHeaderItemProps & RouteObject> = [
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

