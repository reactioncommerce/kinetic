import { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";

import { Sidebar } from "../../components/Sidebar";
import { AppHeader } from "../../components/AppHeader";
import { SIDEBAR_WIDTH } from "../../constants";

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, padding: 3, width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
