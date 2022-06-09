import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAccount } from '@containers/AccountProvider';

export const RequireShopRoute = () => {
  const { account } = useAccount();
  const location = useLocation();

  return account?.adminUIShops?.length ? (
    <Outlet />
  ) : (
    <Navigate to="/new-shop" state={{ from: location }} replace />
  );
};
