import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom'

type SidebarItemProps = {
  to: string
  text: string
  icon: JSX.Element
}

export const SidebarItem = ({ to, text, icon }: SidebarItemProps) => {
  const resolvedPath = useResolvedPath(to)
  const match = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <ListItem dense sx={{ padding: '4px 10px' }}>
      <ListItemButton
        selected={!!match}
        component={NavLink}
        to={to}
        dense
        sx={{
          padding: '4px 10px',
          borderRadius: '5px',
          '&.active': {
            bgcolor: 'background.darkGrey',
            '&:hover': { bgcolor: 'background.darkGrey' },
          },
        }}
      >
        <ListItemIcon sx={{ color: 'white', minWidth: '0px', mr: '16px' }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  )
}
