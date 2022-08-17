import { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { ItemProps } from "./defaultSidebarItems";
import { SidebarItem } from "./SidebarItem";

function findActiveItems(items: ItemProps[], pathName: string, path: ItemProps[] = []): ItemProps[] {
  if (!items.length) return [];
  for (const item of items) {
    path.push(item);
    if (item.to && pathName.includes(item.to)) return path;
    if (item.subItems) {
      const activeItem = findActiveItems(item.subItems, pathName, path);
      if (activeItem.length) return activeItem;
    }
    path.pop();
  }
  return [];
}


type SidebarItemsProps = {
  items: ItemProps[]
}

export const SidebarItems = ({ items }:SidebarItemsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeMenuItem: ItemProps = useMemo(() => {
    const activeItems = findActiveItems(items, location.pathname);
    const parent = activeItems.length <= 1 ? null : activeItems[activeItems.length - 2];
    return parent ?? items[0];
  }, [items, location.pathname]);

  return (
    <List
      subheader={
        <ListItemButton
          sx={{
            "bgcolor": "background.dark",
            "color": "grey.500",
            "textTransform": "uppercase",
            "display": "flex",
            "alignItems": "center",
            "mt": 1,
            "fontSize": 12,
            "fontWeight": 700,
            "&.Mui-disabled": {
              color: "grey.500",
              opacity: 1
            }
          }}
          disableRipple
          disabled={!activeMenuItem.backTo}
          component={NavLink}
          to={activeMenuItem.backTo ?? "/"}
        >
          {activeMenuItem.backTo && <KeyboardArrowLeftIcon sx={{ fontSize: "1rem" }} />} {activeMenuItem.text}
        </ListItemButton>
      }
    >
      {activeMenuItem.subItems?.map(({ key, ...item }) => (
        <SidebarItem
          key={key}
          onClick={() => navigate(item.subItems?.[0].to ?? "/")}
          {...item}
        />
      ))}
    </List>
  );
};
