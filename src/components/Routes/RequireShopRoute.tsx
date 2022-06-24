import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useShop } from '@containers/ShopProvider'

export const RequireShopRoute = () => {
  const { shopId } = useShop()
  const location = useLocation()

  return shopId ? <Outlet /> : <Navigate to="/new-shop" state={{ from: location }} replace />
}
