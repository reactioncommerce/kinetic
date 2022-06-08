import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useAccount } from '@containers/AccountProvider';

export const ProfileToolbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { account, removeAccessToken } = useAccount();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar sx={{ pl: { xs: '10px' }, pr: { xs: '10px' } }}>
      <Button
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        endIcon={<KeyboardArrowDownIcon sx={{ color: 'text.primary' }} />}>
        <Avatar sx={{ width: 32, height: 32, mr: '5px' }} />
        <Typography noWrap fontSize={13} textTransform="lowercase" color="text.primary">
          {account?.name || account?.primaryEmailAddress}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem>My account</MenuItem>
        <Divider />
        <MenuItem>Add another shop</MenuItem>
        <MenuItem onClick={removeAccessToken}>Logout</MenuItem>
      </Menu>
    </Toolbar>
  );
};
