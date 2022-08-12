import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

import { SubHeader, SubHeaderItemProps } from "@components/AppHeader";

type PageLayoutProps = {
  headers?: SubHeaderItemProps[]
  noPadding?: boolean
}

export const PageLayout = ({ headers, noPadding = false }: PageLayoutProps) => (
  <>
    {headers ? <SubHeader items={headers} /> : null}
    <Container sx={{ ...(!noPadding && { padding: "20px 30px" }) }} maxWidth={false}>
      <Outlet/>
    </Container>
  </>
);
