import { RouteObject } from "react-router-dom";
import { lazy } from "react";


import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AppLayout, PageLayout } from "@containers/Layouts";

import { USER_PAGE_FEATURES } from "./pages/Settings/UsersAndPermissions";
import { SHIPPING_PAGE_FEATURES } from "./pages/Settings/ShippingAndFulfillment";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
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
                    element: <PageLayout headers={SHIPPING_PAGE_FEATURES}/>,
                    children: SHIPPING_PAGE_FEATURES.map((page) => ({ ...page }))
                  },
                  {
                    path: "users",
                    element: <PageLayout headers={USER_PAGE_FEATURES}/>,
                    children: USER_PAGE_FEATURES.map((page) => ({ ...page }))
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
