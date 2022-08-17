import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { SIDEBAR_WIDTH } from "../../constants";

import { SidebarFeaturesProps } from "./defaultSidebarItems";
import { SidebarContent } from "./SidebarContent";

type SidebarProps = {
  mobileOpen: boolean
  handleDrawerToggle: () => void
  sidebar?: SidebarFeaturesProps
}

const sharedStyles = {
  boxSizing: "border-box",
  width: SIDEBAR_WIDTH,
  bgcolor: "background.dark",
  color: "white",
  pt: 3,
  pb: 1
};

export const Sidebar = ({ mobileOpen, handleDrawerToggle, sidebar }: SidebarProps) => (
  <Box component="nav" sx={{ width: { sm: SIDEBAR_WIDTH }, flexShrink: { sm: 0 } }}>
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        "display": { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": sharedStyles
      }}
    >
      <SidebarContent sidebar={sidebar}/>
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        "display": { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": sharedStyles
      }}
      open
    >
      <SidebarContent sidebar={sidebar}/>
    </Drawer>
  </Box>
);


