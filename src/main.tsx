import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

import theme from "./theme";
import App from "./App";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      retry: false
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
</React.StrictMode>);
