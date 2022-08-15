import { useRoutes as useReactRouterRoutes } from "react-router-dom";
import { Suspense } from "react";

import { AccountProvider } from "@containers/AccountProvider";
import { ShopProvider } from "@containers/ShopProvider";
import { Loader } from "@components/Loader";
import { useRoutes } from "@containers/RoutesProvider";

function App() {
  const routes = useRoutes();
  const routeElement = useReactRouterRoutes(routes);

  return (
    <Suspense fallback={<Loader />}>
      <ShopProvider>
        <AccountProvider>
          {routeElement}
        </AccountProvider>
      </ShopProvider>
    </Suspense>
  );
}

export default App;
