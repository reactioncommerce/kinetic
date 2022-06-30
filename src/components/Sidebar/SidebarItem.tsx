import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";

export type SidebarItemProps = {
  to?: string
  text: string
  icon: JSX.Element
  onClick?: () => void
}

type NavLinkSidebarItemProps = Omit<SidebarItemProps, "to" | "onClick"> & {
  to: string
}

const NavLinkSidebarItem = ({ to, text, icon }: NavLinkSidebarItemProps) => {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <ListItemButton
      selected={!!match}
      component={NavLink}
      to={to}
      dense
      sx={{
        "padding": "4px 10px",
        "borderRadius": "5px",
        "&.active": {
          "bgcolor": "background.darkGrey",
          "&:hover": { bgcolor: "background.darkGrey" }
        }
      }}
    >
      <ListItemIcon sx={{ color: "white", minWidth: "0px", mr: "16px" }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export const SidebarItem = ({ to, onClick, ...props }: SidebarItemProps) => (
  <ListItem dense sx={{ padding: "4px 10px" }}>
    {to ? (
      <NavLinkSidebarItem to={to} {...props} />
    ) : (
      <ListItemButton
        dense
        sx={{
          "padding": "4px 10px",
          "borderRadius": "5px",
          "&.active": {
            "bgcolor": "background.darkGrey",
            "&:hover": { bgcolor: "background.darkGrey" }
          }
        }}
        onClick={onClick}
      >
        <ListItemIcon sx={{ color: "white", minWidth: "0px", mr: "16px" }}>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    )}
  </ListItem>
);
