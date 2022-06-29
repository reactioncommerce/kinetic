import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import { SIDEBAR_WIDTH } from '../../constants'

import { SidebarItems } from './SidebarItems'

type SidebarProps = {
  mobileOpen: boolean
  handleDrawerToggle: () => void
}

export const Sidebar = ({ mobileOpen, handleDrawerToggle }: SidebarProps) => {
  return (
    <Box component="nav" sx={{ width: { sm: SIDEBAR_WIDTH }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH },
        }}
      >
        <SidebarItems />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH },
        }}
        open
      >
        <SidebarItems />
      </Drawer>
    </Box>
  )
}
