import { useLocation, Navigate, Outlet } from 'react-router-dom'

import { useAccount } from '@containers/AccountProvider'

export const RequireAuthRoute = () => {
  const { account } = useAccount()
  const location = useLocation()

  const resetToken = new URLSearchParams(location.search).get('resetToken')

  if (resetToken) return <Navigate to={`/password-reset?resetToken=${resetToken}`} />

  return account ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
}
