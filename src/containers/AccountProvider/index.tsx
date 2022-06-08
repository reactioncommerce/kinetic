import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { client } from '../../graphql/graphql-request-client';

import { GetViewerQuery, useGetViewerQuery } from './viewer.generated';

type AccountContextValue = {
  account: GetViewerQuery['viewer'] | null;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
};

const AccountContext = createContext<AccountContextValue>({
  account: null,
  setAccessToken: () => {},
  removeAccessToken: () => {}
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
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>('accounts:accessToken');

  if (accessToken) {
    client.setHeader('Authorization', accessToken);
  } else {
    client.setHeaders({});
  }

  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined);

  useEffect(() => {
    refetch();
  }, [accessToken, refetch]);

  if (isLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <AccountContext.Provider
      value={{ account: data?.viewer ?? null, setAccessToken, removeAccessToken }}>
      {children}
    </AccountContext.Provider>
  );
};
