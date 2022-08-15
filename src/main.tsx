import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

import { RoutesProvider } from "@containers/RoutesProvider";

import theme from "./theme";
import App from "./App";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { routes } from "./routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <RoutesProvider routes={routes}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RoutesProvider>
    </QueryClientProvider>
  </ThemeProvider>
</React.StrictMode>);
