import { SubHeaderItemProps } from "@components/AppHeader";
import { PageLayout } from "@containers/Layouts";

const headers: SubHeaderItemProps[] = [
  {
    label: "Methods",
    href: "",
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
  <PageLayout headers={headers} />
);

export default ShippingConfiguration;
