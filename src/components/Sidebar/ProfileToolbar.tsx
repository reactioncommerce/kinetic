import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { MouseEvent, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import Check from "@mui/icons-material/Check";

import { SIDEBAR_WIDTH } from "../../constants";
import { useAccount } from "@containers/AccountProvider";
import { useShop } from "@containers/ShopProvider";

export const ProfileToolbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { account, removeAccessToken } = useAccount();
  const { shopId, setShopId } = useShop();

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSignOut = () => {
    removeAccessToken();
    setShopId();
  };

  const activeShop = account?.adminUIShops?.find((shop) => shop?._id === shopId);

  const showShopList = account?.adminUIShops?.length && account.adminUIShops.length > 1;

  return (
    <Toolbar sx={{ pl: { xs: "10px" }, pr: { xs: "10px" }, width: SIDEBAR_WIDTH }}>
      <Button
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<KeyboardArrowDownIcon sx={{ color: "text.primary" }} />}
        sx={{ flexGrow: 1, justifyContent: "flex-start" }}
      >
        <Avatar sx={{ width: 32, height: 32, mr: "10px" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
            maxWidth: "calc(100% - 60px)"
          }}
        >
          <Typography noWrap fontSize={13} fontWeight={500} color="text.primary" maxWidth="100%">
            {activeShop?.name || "Shop Name"}
          </Typography>
          <Typography noWrap fontSize={13} textTransform="lowercase" color="text.primary" maxWidth="100%">
            {account?.name || account?.primaryEmailAddress}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          style: {
            maxWidth: SIDEBAR_WIDTH - 20
          },
          sx: {
            "overflow": "visible",
            "filter": "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "mt": 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {showShopList
          ? account?.adminUIShops?.map((shop) => (
            <MenuItem key={shop?._id} onClick={() => setShopId(shop?._id)}>
              {shop?._id === shopId ? (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              ) : null}
              <ListItemText
                primary={shop?.name}
                inset={shop?._id !== shopId}
                primaryTypographyProps={{ noWrap: true }}
              />
            </MenuItem>
          ))
          : null}
        {showShopList ? <Divider /> : null}
        <MenuItem to="/new-shop" component={Link}>
          Add another shop
        </MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleSignOut}>Logout</MenuItem>
      </Menu>
    </Toolbar>
  );
};
