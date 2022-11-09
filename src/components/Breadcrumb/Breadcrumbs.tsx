import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import { useLocation } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";

import { useShop } from "@containers/ShopProvider";

import { LinkRouter } from "./LinkRouter";
import { BREADCRUMB_ITEMS } from "./defaultBreadcrumbItems";
import { BreadcrumbItem } from "./BreadcrumbItem";


type BreadcrumbsProps = {
  items?: Record<string, string>
  sx?: SxProps<Theme>
}

export const Breadcrumbs = ({ items = BREADCRUMB_ITEMS, sx }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const { shop } = useShop();
  return (
    <MuiBreadcrumbs
      maxItems={2}
      itemsAfterCollapse={2}
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />} sx={{ lineHeight: 1, color: "grey.600", ...sx }}>
      <LinkRouter key="home" underline="none" color="inherit" to="/">
        <Stack direction="row" alignItems="center" gap={1}>
          <HomeOutlinedIcon />
          <NavigateNextIcon fontSize="small" />
          {location.pathname === "/" ?
            <Chip
              label={shop?.name}
            />
            :
            <Typography variant="subtitle2">{shop?.name}</Typography>
          }
        </Stack>
      </LinkRouter>
      {pathnames.map((_, index) => {
        const last: boolean = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return items[to] ?
          <BreadcrumbItem to={to} key={to} label={`${items[to]}`} last={last} />
          : null;
      })}
    </MuiBreadcrumbs>
  );
};
