import { lazy } from "react";

import { SubHeaderItemProps } from "@components/AppHeader";

const Users = lazy(() => import("./Users"));
const Groups = lazy(() => import("./Groups"));

export const USER_PAGE_FEATURES: SubHeaderItemProps[] = [
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
    key: "groups",
    element: <Groups/>
  }
];
