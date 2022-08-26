import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import { SubHeader, SubHeaderItemProps } from "@components/AppHeader";
import { Loader } from "@components/Loader";

type PageLayoutProps = {
  headers?: SubHeaderItemProps[]
  noPadding?: boolean
}

export const PageLayout = ({ headers, noPadding = false }: PageLayoutProps) => (
  <Suspense fallback={<Loader/>}>
    {headers ? <SubHeader items={headers} /> : null}
    <Container sx={{ ...(!noPadding && { padding: "20px 30px" }) }} maxWidth={false}>
      <Outlet/>
    </Container>
  </Suspense>
);
