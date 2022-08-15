import { RouteObject } from "react-router-dom";
import { lazy } from "react";

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AppLayout } from "@containers/Layouts";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ShippingAndFulfillment from "./pages/Settings/ShippingAndFulfillment";

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
                    element: <ShippingAndFulfillment/>,
                    children: [
                      {
                        index: true,
                        element: <ShippingMethods/>,
                        title: "Methods"
                      },
                      {
                        path: "surcharges",
                        element: <ShippingSurcharges/>,
                        title: "Surcharges"
                      },
                      {
                        path: "restrictions",
                        element: <ShippingRestrictions/>,
                        title: "Restrictions"
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
