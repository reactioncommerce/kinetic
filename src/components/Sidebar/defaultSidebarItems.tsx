import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { SidebarItemProps } from "./SidebarItem";


export const FEATURE_KEYS = {
  dashboard: "dashboard",
  storefront: "storefront",
  products: "products",
  orders: "orders",
  customers: "customers",
  promotions: "promotions",
  settings: "settings",
  users: "users",
  shopDetails: "shopDetails",
  checkout: "checkout",
  shippingFulfillment: "shippingFulfillment",
  categories: "categories",
  emails: "emails",
  stores: "stores"
};

export type ItemProps = SidebarItemProps & {
  subItems?: ItemProps[]
  backTo?: string
  key: string
}


export type SidebarFeaturesProps = {
  coreFeatures?: ItemProps[]
  plugins?: ItemProps[]
}


export const STOREFRONT_FEATURES: ItemProps[] = [
  {
    key: FEATURE_KEYS.dashboard,
    text: "Dashboard",
    to: "/",
    icon: <HomeOutlinedIcon fontSize="small" />
  },
  {
    key: FEATURE_KEYS.storefront,
    text: "View Storefront",
    to: "/storefront",
    icon: <OpenInNewOutlinedIcon fontSize="small" />
  }
];

export const CORE_FEATURES: ItemProps[] = [
  {
    key: FEATURE_KEYS.products,
    text: "Products",
    to: "/products",
    icon: <ContentPasteOutlinedIcon fontSize="small" />
  },
  {
    key: FEATURE_KEYS.orders,
    text: "Orders",
    to: "/orders",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />
  },
  {
    key: "customers",
    text: "Customers",
    to: "/customers",
    icon: <GroupOutlinedIcon fontSize="small" />
  },
  {
    key: FEATURE_KEYS.promotions,
    text: "Promotions",
    to: "/promotions",
    icon: <LocalOfferOutlinedIcon fontSize="small" />
  },
  {
    key: FEATURE_KEYS.categories,
    text: "Categories",
    to: "/categories",
    icon: <CategoryOutlinedIcon fontSize="small" />
  },
  {
    key: FEATURE_KEYS.settings,
    text: "Settings",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    backTo: "/products",
    subItems: [
      {
        key: FEATURE_KEYS.settings,
        text: "Users & Permissions",
        icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
        to: "/settings/users"
      },
      {
        key: FEATURE_KEYS.shopDetails,
        text: "Shop Details",
        icon: <FactCheckOutlinedIcon fontSize="small" />,
        to: "/settings/shop-details"
      },
      {
        key: FEATURE_KEYS.checkout,
        text: "Checkout",
        icon: <CreditCardOutlinedIcon fontSize="small" />,
        to: "/settings/checkout"
      },
      {
        key: FEATURE_KEYS.shippingFulfillment,
        text: "Shipping & Fulfillment",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        to: "/settings/shipping-fulfillment"
      },
      {
        key: FEATURE_KEYS.emails,
        text: "Transactional Emails",
        icon: <EmailOutlinedIcon fontSize="small" />,
        to: "/settings/emails"
      }
    ]
  }
];

export const SIDEBAR_ITEMS: SidebarFeaturesProps =
{
  coreFeatures: CORE_FEATURES
};
