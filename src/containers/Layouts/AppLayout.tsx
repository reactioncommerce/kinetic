import { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";

import { Sidebar, SidebarFeaturesProps } from "@components/Sidebar";
import { AppHeader } from "@components/AppHeader";
import { SIDEBAR_WIDTH } from "../../constants";
import { BREADCRUMB_ITEMS } from "@components/Breadcrumb";

type AppLayoutProps = {
  sidebar?: SidebarFeaturesProps
  breadcrumbs?: ((currentBreadcrumbs: Record<string, string>) => Record<string, string>) | Record<string, string>
}


export const AppLayout = ({ sidebar, breadcrumbs = BREADCRUMB_ITEMS }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_breadcrumbs, setBreadcrumbs] = useState(typeof breadcrumbs === "function" ? breadcrumbs(BREADCRUMB_ITEMS) : breadcrumbs);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader handleDrawerToggle={handleDrawerToggle} breadcrumbs={_breadcrumbs}/>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} sidebar={sidebar} />
      <Box component="main" sx={{ flexGrow: 1, width: { xs: "100%", sm: `calc(100% - ${SIDEBAR_WIDTH}px)` } }}>
        <Toolbar/>
        <Outlet context={[_breadcrumbs, setBreadcrumbs]}/>
      </Box>
    </Box>
  );
};
