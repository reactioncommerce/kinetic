import { Navigate, Outlet } from 'react-router-dom'

import { useAccount } from '@containers/AccountProvider'

export const UnauthenticatedRoute = () => {
  const { account } = useAccount()

  if (account) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
