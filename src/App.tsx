import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { FullPageLoader } from "@components/Loader/FullPageLoader";

import { AccountProvider } from "@containers/AccountProvider";
import { ShopProvider } from "@containers/ShopProvider";
import { ToastProvider } from "@containers/ToastProvider";

import { routes } from "./routes";

function App() {
  const routeElement = useRoutes(routes);

  return (
    <Suspense fallback={<FullPageLoader />}>
      <ToastProvider>
        <ShopProvider>
          <AccountProvider>
            {routeElement}
          </AccountProvider>
        </ShopProvider>
      </ToastProvider>
    </Suspense>

  );
}

export default App;
