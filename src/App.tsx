import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

import { AccountProvider } from "@containers/AccountProvider";
import { ShopProvider } from "@containers/ShopProvider";
import { Loader } from "@components/Loader";

import { routes } from "./routes";

function App() {
  const routeElement = useRoutes(routes);

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
