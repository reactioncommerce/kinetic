import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Breadcrumbs } from "@components/Breadcrumb/Breadcrumbs";

import { SIDEBAR_WIDTH } from "../../constants";

type AppHeaderProps = {
  handleDrawerToggle: () => void
  breadcrumbs?: Record<string, string>
}

export const AppHeader = ({ handleDrawerToggle, breadcrumbs }: AppHeaderProps) => (
  <AppBar
    position="fixed"
    sx={{
      width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
      ml: { sm: `${SIDEBAR_WIDTH}px` },
      borderBottom: "1px solid",
      borderBottomColor: "grey.300"
    }}
    elevation={0}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Breadcrumbs items={breadcrumbs} sx={{ display: { xs: "none", md: "block" } }}/>
    </Toolbar>
  </AppBar>
);
