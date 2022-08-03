import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import LocalMallIcon from "@mui/icons-material/LocalMall";

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AppLayout, PageLayout } from "@containers/Layouts";
import { FEATURE_KEYS, SIDEBAR_ITEMS } from "@components/Sidebar";

import Dashboard from "./pages/Dashboard";
import { HEADERS } from "./pages/Settings/ShippingAndFulfillment";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
const ShippingMethods = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Methods"));
const ShippingSurcharges = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Surcharges"));
const ShippingRestrictions = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Restrictions"));
const CreateShop = lazy(() => import("./pages/CreateShop"));

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
            element: <AppLayout
              sidebar={{
                coreFeatures: SIDEBAR_ITEMS.coreFeatures.map((features) => {
                  if (features.key === FEATURE_KEYS.settings) {
                    return {
                      ...features,
                      subItems: [...(features.subItems ? features.subItems : []), {
                        key: "newSetting",
                        text: "New Settings",
                        to: "/new-settings"
                      }]
                    };
                  }

                  return features;
                }),
                plugins: [
                  {
                    text: "Plugins",
                    key: "plugins",
                    subItems: [
                      {
                        text: "Store Pickup",
                        icon: <LocalMallIcon fontSize="small" />,
                        to: "/pickup",
                        key: "storePickup"
                      }]
                  }
                ]
              }}/>,
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
                    element: <PageLayout headers={HEADERS}/>,
                    children: [
                      {
                        index: true,
                        element: <ShippingMethods/>
                      },
                      {
                        path: "surcharges",
                        element: <ShippingSurcharges/>
                      },
                      {
                        path: "restrictions",
                        element: <ShippingRestrictions/>
                      }
                    ]
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
