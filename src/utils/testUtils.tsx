/* eslint-disable import/export */
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";

import { ShopProvider } from "@containers/ShopProvider";
import { AccountProvider } from "@containers/AccountProvider";

afterEach(() => {
  cleanup();
});


const renderWithProviders = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => {
      const client = new QueryClient();

      return <QueryClientProvider client={client}>
        <ShopProvider>
          <AccountProvider>
            {children}
          </AccountProvider>
        </ShopProvider>
      </QueryClientProvider>;
    },
    ...options
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { renderWithProviders };
