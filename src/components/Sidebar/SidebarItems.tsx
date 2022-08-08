import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Box from "@mui/material/Box";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useMemo } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";

import { SystemInformation } from "@components/SystemInformation";

import { SidebarItem, SidebarItemProps } from "./SidebarItem";
import { ProfileToolbar } from "./ProfileToolbar";

type ItemProps = SidebarItemProps & {
  subItems?: ItemProps[]
  prev?: string
}

const ITEMS: SidebarItemProps[] = [
  {
    text: "Dashboard",
    to: "/",
    icon: <HomeOutlinedIcon fontSize="small" />
  },
  {
    text: "View Storefront",
    to: "/storefront",
    icon: <OpenInNewOutlinedIcon fontSize="small" />
  }
];

const CORE_FEATURES: ItemProps[] = [
  {
    text: "Products",
    to: "/products",
    icon: <ContentPasteOutlinedIcon fontSize="small" />
  },
  {
    text: "Orders",
    to: "/orders",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />
  },
  {
    text: "Customers",
    to: "/customers",
    icon: <GroupOutlinedIcon fontSize="small" />
  },
  {
    text: "Promotions",
    to: "/promotions",
    icon: <LocalOfferOutlinedIcon fontSize="small" />
  },
  {
    text: "Categories",
    to: "/categories",
    icon: <CategoryOutlinedIcon fontSize="small" />
  },
  {
    text: "Settings",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    prev: "/products",
    subItems: [
      {
        text: "Users & Permissions",
        icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
        to: "/settings/users"
      },
      {
        text: "Shop Details",
        icon: <FactCheckOutlinedIcon fontSize="small" />,
        to: "/settings/shop-details"
      },
      {
        text: "Payments",
        icon: <CreditCardOutlinedIcon fontSize="small" />,
        to: "/settings/payments"
      },
      {
        text: "Taxes",
        icon: <ExposureOutlinedIcon fontSize="small" />,
        to: "/settings/taxes"
      },
      {
        text: "Shipping & Fulfillment",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        to: "/settings/shipping-fulfillment"
      },
      {
        text: "Transactional Emails",
        icon: <EmailOutlinedIcon fontSize="small" />,
        to: "/settings/emails"
      }
    ]
  }
];

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

type State = {
  items: ItemProps[]
  title: string
  prev?: string
}

const defaultState: State = {
  title: "Store",
  items: CORE_FEATURES
};

export const SidebarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeMenuItem = useMemo(() => {
    const items = findActiveItems(CORE_FEATURES, location.pathname);
    const parent = items.length <= 1 ? null : items[items.length - 2];
    return parent ? { title: parent.text, items: parent.subItems ?? [], prev: parent.prev } : defaultState;
  }, [location.pathname]);

  return (
    <>
      <ProfileToolbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <Box>
          <List>
            {ITEMS.map(({ text, icon, to }) => (
              <SidebarItem key={text} icon={icon} to={to} text={text} />
            ))}
          </List>
          <Divider sx={{ mx: 2, borderColor: "background.darkGrey" }} />
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
                disabled={!activeMenuItem.prev}
                component={NavLink}
                to={activeMenuItem.prev ?? "/"}
              >
                {activeMenuItem.prev && <KeyboardArrowLeftIcon sx={{ fontSize: "1rem" }} />} {activeMenuItem.title}
              </ListItemButton>
            }
          >
            {activeMenuItem.items.map((item) => (
              <SidebarItem
                key={item.text}
                onClick={() => navigate(item.subItems?.[0].to ?? "/")}
                {...item}
              />
            ))}
          </List>
        </Box>
        <List>
          <SystemInformation />
          <SidebarItem
            key="documentation"
            icon={<SupportOutlinedIcon fontSize="small" />}
            onClick={() => window.open("https://mailchimp.com/developer/open-commerce/docs/", "_blank")}
            text="Documentation"
          />
          <ListItem dense sx={{ py: 0.25, px: 0, justifyContent: "center", mt: 1 }}>
            <Typography variant="body2">Powered by <Link underline="none" href="https://mailchimp.com/developer/open-commerce/" target="_blank" sx={{ fontSize: "inherit" }}>Open Commerce</Link></Typography>
          </ListItem>

        </List>
      </Box>
    </>
  );
};
