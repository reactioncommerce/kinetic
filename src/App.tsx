import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AccountProvider } from "@containers/AccountProvider";
import { AppLayout } from "@containers/Layouts";
import { ShopProvider } from "@containers/ShopProvider";
import { Loader } from "@components/Loader";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreateShop from "./pages/CreateShop";
import ShippingConfiguration from "./pages/Settings/ShippingAndFulfillment";
import UsersAndPermissions from "./pages/Settings/UsersAndPermissions";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
const ShippingMethods = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Methods"));
const ShippingSurcharges = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Surcharges"));
const ShippingRestrictions = lazy(() => import("./pages/Settings/ShippingAndFulfillment/Restrictions"));
const Users = lazy(() => import("./pages/Settings/UsersAndPermissions/Users"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <ShopProvider>
          <AccountProvider>
            <Routes>
              <Route element={<UnauthenticatedRoute />}>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/password-reset/new" element={<PasswordReset />} />
                <Route path="/password-reset" element={<NewPassword />} />
              </Route>

              <Route element={<RequireAuthRoute />}>
                <Route path="/new-shop" element={<CreateShop />} />
                <Route element={<RequireShopRoute />}>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="settings">
                      <Route path="shipping-fulfillment" element={<ShippingConfiguration />}>
                        <Route index element={<ShippingMethods/>} />
                        <Route path="surcharges" element={<ShippingSurcharges />} />
                        <Route path="restrictions" element={<ShippingRestrictions />} />
                      </Route>
                      <Route path="users" element={<UsersAndPermissions />}>
                        <Route index element={<Users/>} />
                      </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AccountProvider>
        </ShopProvider>
      </Suspense>

    </BrowserRouter>
  );
}

export default App;
