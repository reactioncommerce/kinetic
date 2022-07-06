import { createContext, useContext, useState } from "react";
import noop from "lodash/noop";

type ShopContextProps = {
  shopId?: string
  setShopId: (shopId?: string) => void
}

const ShopContext = createContext<ShopContextProps>({ shopId: undefined, setShopId: noop });

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
  const [shopId, setShopId] = useState<string>();

  return <ShopContext.Provider value={{ shopId, setShopId }}>{children}</ShopContext.Provider>;
};
