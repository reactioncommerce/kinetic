import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

import { SystemInformation } from "@components/SystemInformation";
import { useShop } from "@containers/ShopProvider";

import { SidebarItem } from "./SidebarItem";
import { ProfileToolbar } from "./ProfileToolbar";
import { CORE_FEATURES, FEATURE_KEYS, SidebarFeaturesProps, SIDEBAR_ITEMS } from "./defaultSidebarItems";
import { SidebarItems } from "./SidebarItems";


type SidebarItemsProps = {
  sidebar?: SidebarFeaturesProps
}

export const SidebarContent = ({ sidebar = SIDEBAR_ITEMS }: SidebarItemsProps) => {
  const { coreFeatures = CORE_FEATURES, plugins = [] } = sidebar;
  const { shop: activeShop } = useShop();

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
            <SidebarItem key="dashboard" icon={<HomeOutlinedIcon fontSize="small" />} to="/" text="Dashboard" />
            <SidebarItem
              key="storefront"
              icon={<OpenInNewOutlinedIcon fontSize="small" />}
              text="View Storefront"
              onClick={activeShop?.storefrontUrls?.storefrontHomeUrl ?
                () => window.open(`${activeShop?.storefrontUrls?.storefrontHomeUrl}`, "_blank") : undefined} />
          </List>
          <Divider sx={{ mx: 2, borderColor: "background.darkGrey" }} />
          {coreFeatures.length ? <SidebarItems items={[{ text: "Stores", key: FEATURE_KEYS.stores, subItems: coreFeatures }]}/> : null}
          {plugins.length ? <SidebarItems items={plugins}/> : null}
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
