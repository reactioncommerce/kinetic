import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { client } from '../../graphql/graphql-request-client';

import { useGetViewerQuery } from './viewer.generated';

export const useAccount = () => {
  const [accessToken] = useLocalStorage<string>('accounts:accessToken');
  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined, { enabled: false });

  useEffect(() => {
    if (accessToken) {
      client.setHeader('Authorization', accessToken);
    } else {
      client.setHeaders({});
    }
    refetch();
  }, [accessToken, refetch]);

  return { account: data?.viewer, isAccountLoading: isLoading };
};
