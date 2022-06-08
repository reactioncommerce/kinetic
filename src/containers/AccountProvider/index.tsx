import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { client } from '../../graphql/graphql-request-client';

import { GetViewerQuery, useGetViewerQuery } from './viewer.generated';

type AccountContextValue = {
  account: GetViewerQuery['viewer'] | null;
  isAccountLoading: boolean;
  setAccessToken: (token: string) => void;
};

const AccountContext = createContext<AccountContextValue>({
  account: null,
  isAccountLoading: false,
  setAccessToken: () => {}
});

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};

type AccountProviderProps = {
  children: JSX.Element;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [accessToken, setAccessToken] = useLocalStorage<string>('accounts:accessToken');
  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined, { enabled: false });

  useEffect(() => {
    if (accessToken) {
      client.setHeader('Authorization', accessToken);
    } else {
      client.setHeaders({});
    }
    refetch();
  }, [accessToken, refetch]);

  const value = { account: data?.viewer ?? null, isAccountLoading: isLoading, setAccessToken };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
