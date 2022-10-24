import { createContext, useContext, useState } from "react";
import { noop } from "lodash-es";

import { Shop } from "types/shop";

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

  return <ShopContext.Provider value={{ shopId: shop?._id, setShop, shop }}>{children}</ShopContext.Provider>;
};
