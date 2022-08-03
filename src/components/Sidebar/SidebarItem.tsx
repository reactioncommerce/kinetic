import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";

export type SidebarItemProps = {
  to?: string
  text: string
  icon?: JSX.Element
  onClick?: () => void
}

type NavLinkSidebarItemProps = Omit<SidebarItemProps, "to" | "onClick"> & {
  to: string
}

const sharedStyles = {
  "px": 1.5,
  "borderRadius": 1,
  "&.active": {
    "bgcolor": "background.darkGrey",
    ".MuiListItemIcon-root": {
      color: "white"
    },
    "&:hover, &:focus": { bgcolor: "background.darkGrey" }
  },
  ".MuiListItemIcon-root": {
    color: "background.lightGrey",
    marginRight: 1
  },
  ".MuiListItemText-root span": {
    fontWeight: 500
  }
};

const NavLinkSidebarItem = ({ to, text, icon }: NavLinkSidebarItemProps) => {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <ListItemButton
      selected={!!match}
      component={NavLink}
      to={to}
      dense
      sx={sharedStyles}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export const SidebarItem = ({ to, onClick, ...props }: SidebarItemProps) => (
  <ListItem dense sx={{ py: 0.25 }}>
    {to ? (
      <NavLinkSidebarItem to={to} {...props} />
    ) : (
      <ListItemButton
        dense
        sx={sharedStyles}
        onClick={onClick}
      >
        {props.icon ? <ListItemIcon>{props.icon}</ListItemIcon> : null}
        <ListItemText primary={props.text} />
      </ListItemButton>
    )}
  </ListItem>
);
