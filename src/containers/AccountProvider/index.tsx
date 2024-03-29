import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "react-use";
import { noop } from "lodash-es";
import { FullPageLoader } from "@components/Loader/FullPageLoader";
import { useLocation, useNavigate } from "react-router-dom";

import { client } from "@graphql/graphql-request-client";
import { GetViewerQuery, useGetViewerQuery } from "@graphql/generates";
import { formatErrorResponse } from "@utils/errorHandlers";
import { ErrorCode } from "types/common";
import { filterNodes } from "@utils/common";

type AccountContextValue = {
  account: GetViewerQuery["viewer"] | null
  setAccessToken: (token: string) => void
  removeAccessToken: () => void
  refetchAccount: () => void
  availableRoles: Record<string, boolean>
}

const AccountContext = createContext<AccountContextValue>({
  account: null,
  setAccessToken: noop,
  removeAccessToken: noop,
  refetchAccount: noop,
  availableRoles: {}
});

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }

  return context;
};

type AccountProviderProps = {
  children: JSX.Element | null
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>("accounts:accessToken");

  if (accessToken) {
    client.setHeader("Authorization", `Bearer ${accessToken}`);
  } else {
    client.setHeaders({});
  }

  const location = useLocation();
  const navigate = useNavigate();
  const redirectUrl = (new URLSearchParams(location.search)).get("redirectUrl");

  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined, {
    retry: false,
    useErrorBoundary: (error) => {
      if (!formatErrorResponse(error)) {
        return true;
      }
      return false;
    },
    onError: (error) => {
      const formattedError = formatErrorResponse(error);
      if (!formattedError) {
        return;
      }
      const { code, status } = formattedError;

      if (status === 401) removeAccessToken();
      if (code === ErrorCode.Forbidden) {
        removeAccessToken();
        navigate("/access-denied");
      }
    },
    onSuccess: () => {
      redirectUrl && navigate(redirectUrl);
    }
  });

  const availableRoles = useMemo(() => {
    const roles = filterNodes(data?.viewer?.groups?.nodes?.map((group) => filterNodes(group?.permissions)).flat());
    const allowedRoles: Record<string, boolean> = {};
    roles.forEach((role) => { allowedRoles[role] = true; });
    return allowedRoles;
  }, [data?.viewer?.groups]);

  useEffect(() => {
    refetch();
  }, [accessToken, refetch]);

  if (isLoading) {
    return (
      <FullPageLoader />
    );
  }

  return (
    <AccountContext.Provider
      value={{
        account: data?.viewer ?? null,
        setAccessToken,
        removeAccessToken,
        refetchAccount: refetch,
        availableRoles
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
