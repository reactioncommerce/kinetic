import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import ExposureOutlinedIcon from '@mui/icons-material/ExposureOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { useState } from 'react'
import { usePrevious } from 'react-use'
import ListItemButton from '@mui/material/ListItemButton'

import { SidebarItem, SidebarItemProps } from './SidebarItem'
import { ProfileToolbar } from './ProfileToolbar'

type ItemProps = SidebarItemProps & {
  subItems?: ItemProps[]
}

const ITEMS: SidebarItemProps[] = [
  {
    text: 'Dashboard',
    to: '/',
    icon: <HomeOutlinedIcon fontSize="small" />,
  },
  {
    text: 'View Storefront',
    to: '/storefront',
    icon: <OpenInNewOutlinedIcon fontSize="small" />,
  },
]

const CORE_FEATURES: ItemProps[] = [
  {
    text: 'Products',
    to: '/products',
    icon: <ContentPasteOutlinedIcon fontSize="small" />,
  },
  {
    text: 'Orders',
    to: '/orders',
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    text: 'Customers',
    to: '/customers',
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    text: 'Promotions',
    to: '/promotions',
    icon: <LocalOfferOutlinedIcon fontSize="small" />,
  },
  {
    text: 'Categories',
    to: '/categories',
    icon: <CategoryOutlinedIcon fontSize="small" />,
  },
  {
    text: 'Settings',
    icon: <SettingsOutlinedIcon fontSize="small" />,
    subItems: [
      {
        text: 'Users & Permissions',
        icon: <GroupOutlinedIcon fontSize="small" />,
        to: '/settings/users',
      },
      {
        text: 'Shop Details',
        icon: <FactCheckOutlinedIcon fontSize="small" />,
        to: '/settings/shop-details',
      },
      {
        text: 'Payments',
        icon: <CreditCardOutlinedIcon fontSize="small" />,
        to: '/settings/payments',
      },
      {
        text: 'Taxes',
        icon: <ExposureOutlinedIcon fontSize="small" />,
        to: '/settings/taxes',
      },
      {
        text: 'Shipping & Fulfillment',
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        to: '/settings/shipping-fulfillment',
      },
      {
        text: 'Transactional Emails',
        icon: <EmailOutlinedIcon fontSize="small" />,
        to: '/settings/emails',
      },
    ],
  },
]

const defaultState = {
  title: 'Store',
  items: CORE_FEATURES,
  root: true,
}

export const SidebarItems = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<{
    items: ItemProps[]
    title: string
    icon?: JSX.Element
    root?: boolean
  }>(defaultState)

  const prevMenuItem = usePrevious(activeMenuItem)

  return (
    <>
      <ProfileToolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100% - 80px)',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <List>
            {ITEMS.map(({ text, icon, to }) => (
              <SidebarItem key={text} icon={icon} to={to} text={text} />
            ))}
          </List>
          <Divider sx={{ borderColor: 'background.darkGrey' }} />
          <List
            subheader={
              <ListItemButton
                component="button"
                sx={{
                  bgcolor: 'background.dark',
                  color: 'grey.500',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  mt: 1,
                  '&:disabled': {
                    color: 'grey.500',
                    opacity: 1,
                  },
                }}
                disabled={activeMenuItem.root || !prevMenuItem}
                onClick={() => setActiveMenuItem(prevMenuItem!)}
              >
                {activeMenuItem.icon} {activeMenuItem.title}
              </ListItemButton>
            }
          >
            {activeMenuItem.items.map(item => (
              <SidebarItem
                key={item.text}
                onClick={
                  item.subItems &&
                  (() =>
                    setActiveMenuItem({ items: item.subItems!, title: item.text, icon: <KeyboardArrowLeftIcon /> }))
                }
                {...item}
              />
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
  )
}
