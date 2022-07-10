import { Outlet } from "react-router-dom";

import { SubHeader, SubHeaderItemProps } from "@components/AppHeader";

const headers: SubHeaderItemProps[] = [
  {
    label: "Methods",
    href: "methods",
    key: "methods"
  },
  {
    label: "Restrictions",
    href: "restrictions",
    key: "restrictions"
  },
  {
    label: "Surcharges",
    href: "surcharges",
    key: "surcharges"
  }
];

const ShippingConfiguration = () => (
  <>
    <SubHeader items={headers} />
    <Outlet/>
  </>
);

export default ShippingConfiguration;
