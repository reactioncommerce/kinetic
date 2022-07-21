import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AccountProvider } from "@containers/AccountProvider";
import { AppLayout } from "@containers/Layouts";
import { ShopProvider } from "@containers/ShopProvider";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreateShop from "./pages/CreateShop";
import ShippingConfiguration from "./pages/Settings/ShippingAndFulfillment";
import ShippingMethods from "./pages/Settings/ShippingAndFulfillment/Methods";
import ShippingSurcharges from "./pages/Settings/ShippingAndFulfillment/Surcharges";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));

function App() {
  return (
    <BrowserRouter>
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
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AccountProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
