import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { SIDEBAR_WIDTH } from "../../constants";

type AppHeaderProps = {
  handleDrawerToggle: () => void
}

export const AppHeader = ({ handleDrawerToggle }: AppHeaderProps) => (
  <AppBar
    position="fixed"
    sx={{
      width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
      ml: { sm: `${SIDEBAR_WIDTH}px` }
    }}
  >
    <Toolbar sx={{ bgcolor: "white", color: "grey.800" }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);
