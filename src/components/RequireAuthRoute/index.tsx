import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { useAccount } from '@containers/AccountProvider';

export const RequireAuthRoute = () => {
  const { account } = useAccount();
  const location = useLocation();

  return account ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
