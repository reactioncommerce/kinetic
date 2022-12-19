import { Navigate, RouteObject } from "react-router-dom";
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
const Customers = lazy(() => import("./pages/Customers"));
const PromotionDetails = lazy(() => import("./pages/Promotions/Details"));
const Promotions = lazy(() => import("./pages/Promotions/List"));

type SubPageRouteProps = Array<SubHeaderItemProps & RouteObject>
const shippingPageRoutes: SubPageRouteProps = [
  {
    header: "Methods",
    path: "",
    key: "methods",
    index: true,
    element:
    <PermissionGuard permissions={["reaction:legacy:shippingMethods/read"]}>
      <ShippingMethods/>
    </PermissionGuard>
  },
  {
    header: "Restrictions",
    path: "restrictions",
    key: "restrictions",
    element:
    <PermissionGuard permissions={["reaction:legacy:shippingRestrictions/read"]}>
      <ShippingRestrictions/>
    </PermissionGuard>
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
    <PermissionGuard permissions={["reaction:legacy:accounts/read", "reaction:legacy:groups/read"]}>
      <Users/>
    </PermissionGuard>,
    index: true
  },
  {
    header: "Invitations",
    path: "invitations",
    key: "invitations",
    element:
    <PermissionGuard permissions={["reaction:legacy:invitations/read", "reaction:legacy:groups/read", "reaction:legacy:groups/manage:accounts"]}>
      <PendingInvitations/>
    </PermissionGuard>
  },
  {
    header: "Groups",
    path: "groups",
    key: "groups",
    element:
    <PermissionGuard permissions={["reaction:legacy:groups/read"]}><Groups/></PermissionGuard>
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
    element:
    <PermissionGuard permissions={["reaction:legacy:email-templates/read"]}>
      <EmailTemplatesSettings/>
    </PermissionGuard>,
    index: true
  },
  {
    header: "Logs",
    path: "logs",
    key: "email-logs-settings",
    element:
    <PermissionGuard permissions={["reaction:legacy:emails/read"]}>
      <EmailLogsSettings/>
    </PermissionGuard>
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
    element:
    <PermissionGuard permissions={["reaction:legacy:taxes/read"]}>
      <TaxesSettings/>
    </PermissionGuard>
  },
  {
    header: "Address Validation",
    path: "address-validation",
    key: "address-validation",
    element:
    <PermissionGuard permissions={["reaction:legacy:addressValidationRules/read"]}>
      <AddressValidationSettings/>
    </PermissionGuard>
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
        element:
        <PermissionGuard permissions={["reaction:legacy:shops/create"]} fallback={<AccessDenied/>}>
          <CreateShop/>
        </PermissionGuard>
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
                path: "promotions",
                children: [
                  {
                    index: true,
                    element:
                    <PermissionGuard permissions={["reaction:legacy:promotions/read"]}>
                      <Promotions/>
                    </PermissionGuard>
                  },
                  {
                    path: "create",
                    element:
                  <PermissionGuard permissions={["reaction:legacy:promotions/create"]}>
                    <PromotionDetails/>
                  </PermissionGuard>
                  },
                  {
                    path: ":promotionId",
                    element:
                    <PermissionGuard permissions={["reaction:legacy:promotions/read"]}>
                      <PromotionDetails/>
                    </PermissionGuard>
                  }
                ]
              },
              {
                path: "customers",
                element: <PageLayout/>,
                children: [{
                  index: true,
                  element: <Customers/>
                }]
              },
              {
                path: "settings",
                children: [
                  {
                    index: true,
                    element: <Navigate to="users-and-permissions" replace />
                  },
                  {
                    path: "users-and-permissions",
                    element: <PageLayout headers={userPageRoutes} />,
                    children: userPageRoutes
                  },
                  {
                    path: "shop-details",
                    element: <PageLayout headers={shopSettingPageRoutes}/>,
                    children: shopSettingPageRoutes
                  },
                  {
                    path: "checkout",
                    element: <PageLayout headers={checkoutSettingPageRoutes}/>,
                    children: checkoutSettingPageRoutes
                  },
                  {
                    path: "shipping-fulfillment",
                    element: <PageLayout headers={shippingPageRoutes}/>,
                    children: shippingPageRoutes
                  },
                  {
                    path: "emails",
                    element: <PageLayout headers={emailsSettingPageRoutes}/>,
                    children: emailsSettingPageRoutes
                  }
                ]
              },
              {
                path: "customers",
                element: <PageLayout/>,
                children: [{
                  index: true,
                  element: <Customers/>
                }]
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
