import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";

type SidebarItemProps = {
  to: string
  text: string
  icon: JSX.Element
}

export const SidebarItem = ({ to, text, icon }: SidebarItemProps) => {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <ListItem disablePadding>
      <ListItemButton selected={!!match} component={NavLink} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};
