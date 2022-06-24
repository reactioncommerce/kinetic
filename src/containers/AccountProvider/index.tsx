import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import get from 'lodash/get'
import noop from 'lodash/noop'

import { client } from '../../graphql/graphql-request-client'
import { APIErrorResponse } from '../../types/common'
import { useShop } from '@containers/ShopProvider'
import { GetViewerQuery, useGetViewerQuery } from '../../graphql/generates'

type AccountContextValue = {
  account: GetViewerQuery['viewer'] | null

  setAccessToken: (token: string) => void

  removeAccessToken: () => void

  refetchAccount: () => void
}

const AccountContext = createContext<AccountContextValue>({
  account: null,

  setAccessToken: noop,

  removeAccessToken: noop,

  refetchAccount: noop,
})

export const useAccount = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider')
  }

  return context
}

type AccountProviderProps = {
  children: JSX.Element
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('accounts:accessToken')

  if (accessToken) {
    client.setHeader('Authorization', `Bearer ${accessToken}`)
  } else {
    client.setHeaders({})
  }

  const { setShopId, shopId } = useShop()

  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined, {
    retry: false,

    onError: error => {
      const unauthorized = (error as APIErrorResponse).response.status === 401

      if (unauthorized) removeAccessToken()
    },

    onSuccess: data => {
      !shopId && setShopId(get(data, 'viewer.adminUIShops[0]._id'))
    },
  })

  useEffect(() => {
    refetch()
  }, [accessToken, refetch])

  if (isLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <AccountContext.Provider
      value={{
        account: data?.viewer ?? null,

        setAccessToken,

        removeAccessToken,

        refetchAccount: refetch,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
