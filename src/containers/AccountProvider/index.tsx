import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "react-use";
import { noop } from "lodash-es";
import { FullPageLoader } from "@components/Loader/FullPageLoader";
import { useLocation, useNavigate } from "react-router-dom";

import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { GetViewerQuery, useGetViewerQuery } from "@graphql/generates";
import { formatErrorResponse } from "@utils/errorHandlers";
import { ErrorCode } from "types/common";
import { filterNodes } from "@utils/common";

type AccountContextValue = {
  account: GetViewerQuery["viewer"] | null
  setAccessToken: (token: string) => void
  removeAccessToken: () => void
  refetchAccount: () => void
  availableRoles: string[]
}

const AccountContext = createContext<AccountContextValue>({
  account: null,
  setAccessToken: noop,
  removeAccessToken: noop,
  refetchAccount: noop,
  availableRoles: []
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

  const { setShop, shopId } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectUrl = (new URLSearchParams(location.search)).get("redirectUrl");

  const { data, isLoading, refetch } = useGetViewerQuery(client, undefined, {
    retry: false,
    useErrorBoundary: false,
    onError: (error) => {
      const { code, status } = formatErrorResponse(error);

      if (status === 401) removeAccessToken();
      if (code === ErrorCode.Forbidden) {
        removeAccessToken();
        navigate("/access-denied");
      }
    },
    onSuccess: (response) => {
      if (response.viewer === null) {
        setShop();
        return;
      }

      if (!shopId) {
        const primaryShop = response.viewer?.adminUIShops?.find((shop) => shop?.shopType === "primary");
        setShop(primaryShop);
      }
      redirectUrl && navigate(redirectUrl);
    }
  });

  useEffect(() => {
    refetch();
  }, [accessToken, refetch]);

  if (isLoading) {
    return (
      <FullPageLoader />
    );
  }

  const availableRoles = [...new Set(filterNodes(data?.viewer?.groups?.nodes?.map((group) => filterNodes(group?.permissions)).flat()))];

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
