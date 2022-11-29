/* eslint-disable import/export */
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { ShopProvider } from "@containers/ShopProvider";
import { AccountProvider } from "@containers/AccountProvider";
import { ToastProvider } from "@containers/ToastProvider";

afterEach(() => {
  cleanup();
});


const renderWithProviders = (ui: React.ReactElement, options = { initialEntries: ["/"] }) => {
  const { initialEntries, ...restOptions } = options;

  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => {
      const client = new QueryClient();

      return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={initialEntries}>
            <ToastProvider>
              <ShopProvider>
                <AccountProvider>
                  {children}
                </AccountProvider>
              </ShopProvider>
            </ToastProvider>

          </MemoryRouter>
        </QueryClientProvider>
      </LocalizationProvider>
      ;
    },
    ...restOptions
  });
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { renderWithProviders };
