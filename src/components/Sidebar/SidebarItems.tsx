import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ListSubheader from '@mui/material/ListSubheader';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';

import SidebarItem from './SidebarItem';
import { ProfileToolbar } from './ProfileToolbar';

const ITEMS = [
  {
    text: 'Dashboard',
    link: '/',
    icon: <HomeOutlinedIcon />
  },
  {
    text: 'New Product',
    link: '/product/new',
    icon: <StorefrontOutlinedIcon />
  }
];

const CORE_FEATURES = [
  {
    text: 'Orders',
    link: '/orders',
    icon: <ShoppingCartOutlinedIcon />
  },
  {
    text: 'Products',
    link: '/products',
    icon: <CategoryOutlinedIcon />
  },
  {
    text: 'Customers',
    link: '/customers',
    icon: <GroupOutlinedIcon />
  },
  {
    text: 'Promotions',
    link: '/promotions',
    icon: <StyleOutlinedIcon />
  },
  {
    text: 'Settings',
    link: '/settings',
    icon: <SettingsOutlinedIcon />
  }
];

const SidebarItems = () => {
  return (
    <div>
      <ProfileToolbar />
      <Divider />
      <List>
        {ITEMS.map(({ text, icon, link }) => (
          <SidebarItem key={text} icon={icon} to={link} text={text} />
        ))}
      </List>
      <List subheader={<ListSubheader>STORE</ListSubheader>}>
        {CORE_FEATURES.map(({ text, icon, link }) => (
          <SidebarItem key={text} icon={icon} to={link} text={text} />
        ))}
      </List>
    </div>
  );
};

export default SidebarItems;
