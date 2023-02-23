import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { FullPageLoader } from "@components/Loader/FullPageLoader";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import theme from "../theme";
import { ToastProvider } from "@containers/ToastProvider";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { AccountProvider } from "@containers/AccountProvider";
import { ShopProvider } from "@containers/ShopProvider";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      retry: false
    }
  }
});

export const AppProviders = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Suspense fallback={<FullPageLoader />}>
              <AccountProvider>
                <ShopProvider>
                  <Outlet/>
                </ShopProvider>
              </AccountProvider>
            </Suspense>
          </ErrorBoundary>
        </QueryClientProvider>
      </LocalizationProvider>
    </ToastProvider>
  </ThemeProvider>
);
