/* eslint-disable import/export */
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMemoryRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import { ReactElement } from "react";

import { ShopProvider } from "@containers/ShopProvider";
import { AccountProvider } from "@containers/AccountProvider";
import { ToastProvider } from "@containers/ToastProvider";

afterEach(() => {
  cleanup();
});

const WrapperProviders = () => {
  const client = new QueryClient();

  return <QueryClientProvider client={client}>
    <ToastProvider>
      <AccountProvider>
        <ShopProvider>
          <Outlet/>
        </ShopProvider>
      </AccountProvider>
    </ToastProvider>
  </QueryClientProvider>;
};

const renderWithProviders = (ui: React.ReactElement) => {
  const router = createMemoryRouter([{
    element: <WrapperProviders/>,
    children: [
      { path: "/", element: ui }
    ]
  }], { initialEntries: ["/"], initialIndex: 0 });

  return render(<RouterProvider router={router}/>);
};

const renderWithRoutes = (options: {initialEntries: string[], routes: ReactElement, initialIndex?: number}) => {
  const { initialEntries, routes, initialIndex = 0 } = options;
  const router = createMemoryRouter(createRoutesFromElements(<Route element={<WrapperProviders/>}>
    {routes}
  </Route>), { initialEntries, initialIndex });

  return render(<RouterProvider router={router}/>);
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { renderWithProviders, renderWithRoutes };
