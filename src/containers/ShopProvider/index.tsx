import { createContext, useContext, useEffect, useState } from "react";
import { noop } from "lodash-es";
import { useNavigate } from "react-router-dom";

import { Shop } from "types/shop";
import { decodeOpaqueId } from "@utils/decodedOpaqueId";
import { useAccount } from "@containers/AccountProvider";

type ShopContextProps = {
  shopId?: string
  setShop: (shop?: Shop | null) => void
  shop?: Shop | null
}

const ShopContext = createContext<ShopContextProps>({ shopId: undefined, setShop: noop });

export const useShop = () => {
  const shopContext = useContext(ShopContext);
  if (!shopContext) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return shopContext;
};

type ShopProviderProps = {
  children: JSX.Element
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const [shop, setShop] = useState<Shop | null>();
  const { account } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (account === null) {
      setShop(null);
      return;
    }

    if (!shop?._id) {
      const primaryShop = account?.adminUIShops?.find((accountShop) => accountShop?.shopType === "primary");
      primaryShop ? setShop(primaryShop) : navigate("/new-shop");
    }
  }, [account, navigate, shop?._id]);

  return <ShopContext.Provider
    value={{
      shopId: decodeOpaqueId(shop?._id)?.id,
      setShop,
      shop
    }}>
    {children}
  </ShopContext.Provider>;
};
