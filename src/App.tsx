import { BrowserRouter, Routes, Route } from "react-router-dom";

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from "@components/Routes";
import { AccountProvider } from "@containers/AccountProvider";
import { AppLayout } from "@containers/Layouts";
import { ShopProvider } from "@containers/ShopProvider";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CreateShop from "./pages/CreateShop";
import PasswordReset from "./pages/PasswordReset";
import NewPassword from "./pages/NewPassword";
import ShippingConfiguration from "./pages/Settings/ShippingConfiguration";
import ShippingMethods from "./pages/Settings/ShippingConfiguration/Methods";
import ShippingRestrictions from "./pages/Settings/ShippingConfiguration/Restrictions";
import ShippingSurcharges from "./pages/Settings/ShippingConfiguration/Surcharges";

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
                      <Route path="restrictions" element={<ShippingRestrictions />} />
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
