import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";

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
    <Container sx={{ padding: "20px 30px" }} maxWidth={false}>
      <Outlet/>
    </Container>

  </>
);

export default ShippingConfiguration;
