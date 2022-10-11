import { RouteObject } from "react-router-dom";
import { lazy } from "react";

import { PermissionGuard } from "@components/PermissionGuard";
import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AppLayout, PageLayout } from "@containers/Layouts";
import { SubHeaderItemProps } from "@components/AppHeader";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

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
const LocalizationSettings = lazy(() => import("./pages/Settings/ShopDetails/Localization"));
const PendingInvitations = lazy(() => import("./pages/Settings/UsersAndPermissions/PendingInvitations"));
const EmailTemplatesSettings = lazy(() => import("./pages/Settings/Emails/Templates"));
const EmailLogsSettings = lazy(() => import("./pages/Settings/Emails/EmailLogs"));
const PaymentSettings = lazy(() => import("./pages/Settings/Checkout/Payments"));
const AddressValidationSettings = lazy(() => import("./pages/Settings/Checkout/AddressValidation"));
const TaxesSettings = lazy(() => import("./pages/Settings/Checkout/Taxes"));

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
    element:
    <PermissionGuard permissions={["accounts/read", "groups/read"]}>
      <Users/>
    </PermissionGuard>,
    index: true
  },
  {
    header: "Invitations",
    path: "invitations",
    key: "invitations",
    element:
    <PermissionGuard permissions={["invitations/read", "groups/read", "groups/manage:accounts"]}>
      <PendingInvitations/>
    </PermissionGuard>
  },
  {
    header: "Groups",
    path: "groups",
    key: "groups",
    element:
    <PermissionGuard permissions={["groups/read"]}><Groups/></PermissionGuard>
  }
];

const shopSettingPageRoutes: SubPageRouteProps = [
  {
    header: "General",
    path: "",
    key: "shop-general-setting",
    element: <ShopGeneralSettings/>,
    index: true
  },
  {
    header: "Localization",
    path: "localization",
    key: "shop-localization-setting",
    element: <LocalizationSettings/>
  }
];

const emailsSettingPageRoutes: SubPageRouteProps = [
  {
    header: "Templates",
    path: "",
    key: "email-templates-settings",
    element: <EmailTemplatesSettings/>,
    index: true
  },
  {
    header: "Logs",
    path: "logs",
    key: "email-logs-settings",
    element: <EmailLogsSettings/>
  }
];

const checkoutSettingPageRoutes: SubPageRouteProps = [
  {
    header: "Payments",
    path: "",
    key: "payment-settings",
    element: <PaymentSettings/>,
    index: true
  },
  {
    header: "Taxes",
    path: "taxes",
    key: "taxes-settings",
    element: <TaxesSettings/>
  },
  {
    header: "Address Validation",
    path: "address-validation",
    key: "address-validation",
    element: <AddressValidationSettings/>
  }
];

export const routes: RouteObject[] = [
  {
    path: "/access-denied",
    element: <AccessDenied/>
  },
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
                  },
                  {
                    path: "emails",
                    element: <PageLayout headers={emailsSettingPageRoutes}/>,
                    children: emailsSettingPageRoutes
                  },
                  {
                    path: "checkout",
                    element: <PageLayout headers={checkoutSettingPageRoutes}/>,
                    children: checkoutSettingPageRoutes
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
