import { RouteObject } from "react-router-dom";
import { lazy } from "react";

import { SubHeaderItemProps } from "@components/AppHeader";

const Users = lazy(() => import("./Users"));

export const USER_PAGE_FEATURES: Array<SubHeaderItemProps & RouteObject> = [
  {
    header: "Users",
    path: "",
    key: "users",
    element: <Users/>,
    index: true
  },
  {
    header: "Groups",
    path: "groups",
    key: "groups"
  }
];
