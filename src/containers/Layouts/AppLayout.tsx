import { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";

import { Sidebar, SidebarFeaturesProps } from "@components/Sidebar";
import { AppHeader } from "@components/AppHeader";
import { SIDEBAR_WIDTH } from "../../constants";
import { ErrorBoundary } from "@components/ErrorBoundary";

type AppLayoutProps = {
  sidebar?: SidebarFeaturesProps
}

export const AppLayout = ({ sidebar }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} sidebar={sidebar} />
      <Box component="main" sx={{ flexGrow: 1, width: { xs: "100%", sm: `calc(100% - ${SIDEBAR_WIDTH}px)` } }}>
        <Toolbar />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};
