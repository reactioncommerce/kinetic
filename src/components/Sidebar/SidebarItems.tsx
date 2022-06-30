import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListSubheader from "@mui/material/ListSubheader";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";

import { SidebarItem } from "./SidebarItem";
import { ProfileToolbar } from "./ProfileToolbar";

const ITEMS = [
  {
    text: "Dashboard",
    link: "/",
    icon: <HomeOutlinedIcon fontSize="small" />
  },
  {
    text: "View Storefront",
    link: "/storefront",
    icon: <OpenInNewOutlinedIcon fontSize="small" />
  }
];

const CORE_FEATURES = [
  {
    text: "Products",
    link: "/products",
    icon: <ContentPasteOutlinedIcon fontSize="small" />
  },
  {
    text: "Orders",
    link: "/orders",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />
  },
  {
    text: "Customers",
    link: "/customers",
    icon: <GroupOutlinedIcon fontSize="small" />
  },
  {
    text: "Promotions",
    link: "/promotions",
    icon: <LocalOfferOutlinedIcon fontSize="small" />
  },
  {
    text: "Categories",
    link: "/categories",
    icon: <CategoryOutlinedIcon fontSize="small" />
  },
  {
    text: "Settings",
    link: "/settings",
    icon: <SettingsOutlinedIcon fontSize="small" />
  }
];

export const SidebarItems = () => (
  <>
    <ProfileToolbar />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100% - 80px)",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <List>
          {ITEMS.map(({ text, icon, link }) => (
            <SidebarItem key={text} icon={icon} to={link} text={text} />
          ))}
        </List>
        <Divider sx={{ borderColor: "background.darkGrey" }} />
        <List subheader={<ListSubheader sx={{ bgcolor: "background.dark", color: "grey.500" }}>STORE</ListSubheader>}>
          {CORE_FEATURES.map(({ text, icon, link }) => (
            <SidebarItem key={text} icon={icon} to={link} text={text} />
          ))}
        </List>
      </Box>
      <List>
        <SidebarItem
          key="system-information"
          icon={<InfoOutlinedIcon fontSize="small" />}
          to="/system-information"
          text="System Information"
        />
        <SidebarItem
          key="documentation"
          icon={<SupportOutlinedIcon fontSize="small" />}
          to="/documentations"
          text="Documentations"
        />
      </List>
    </Box>
  </>
);
