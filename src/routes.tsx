import { RouteObject } from "react-router-dom";
import { lazy } from "react";


import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AppLayout, PageLayout } from "@containers/Layouts";
import { SubHeaderItemProps } from "@components/AppHeader";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
const CreateShop = lazy(() => import("./pages/CreateShop"));
const ShippingMethods = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Methods"));
const ShippingSurcharges = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Surcharges"));
const ShippingRestrictions = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Restrictions"));
const Users = lazy(() => import("./pages/Settings/UsersAndPermissions/Users"));
const Groups = lazy(() => import("./pages/Settings/UsersAndPermissions/Groups"));
const ShopGeneralSettings = lazy(() => import("./pages/Settings/ShopDetails/General"));

type SubPageRouteProps = Array<SubHeaderItemProps & RouteObject>
const shippingPageRoutes: SubPageRouteProps = [
  {
    header: "Methods",
    path: "",
    key: "methods",
    index: true,
    element: <ShippingMethods/>
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

const userPageRoutes: SubPageRouteProps = [
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

const shopSettingPageRoutes: SubPageRouteProps = [
  {
    header: "Generals",
    path: "",
    key: "shop-general-setting",
    element: <ShopGeneralSettings/>,
    index: true
  },
  {
    header: "Localization",
    path: "localization",
    key: "localization",
    element: <Groups/>
  }
];


export const routes: RouteObject[] = [
  {
    element: <UnauthenticatedRoute/>,
    children: [
      {
        path: "/signup",
        element: <SignUp/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/password-reset/new",
        element: <PasswordReset/>
      },
      {
        path: "/password-reset",
        element: <NewPassword/>
      }
    ]
  },
  {
    element: <RequireAuthRoute/>,
    children: [
      {
        path: "/new-shop",
        element: <CreateShop/>
      },
      {
        element: <RequireShopRoute/>,
        children: [
          {
            path: "/",
            element: <AppLayout/>,
            children: [
              {
                index: true,
                element: <Dashboard/>
              },
              {
                path: "settings",
                children: [
                  {
                    path: "shipping-fulfillment",
                    element: <PageLayout headers={shippingPageRoutes}/>,
                    children: shippingPageRoutes
                  },
                  {
                    path: "users",
                    element: <PageLayout headers={userPageRoutes}/>,
                    children: userPageRoutes
                  },
                  {
                    path: "shop-details",
                    element: <PageLayout headers={shopSettingPageRoutes}/>,
                    children: shopSettingPageRoutes
                  }
                ]
              },
              {
                path: "*",
                element: <NotFound />
              }
            ]
          }
        ]
      }
    ]
  }
];
