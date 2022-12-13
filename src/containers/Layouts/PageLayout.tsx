import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Paper from "@mui/material/Paper";

import { SubHeader, SubHeaderItemProps } from "@components/AppHeader";
import { Loader } from "@components/Loader";
import { ErrorBoundary } from "@components/ErrorBoundary";

type PageLayoutProps = {
  headers?: SubHeaderItemProps[]
  noPadding?: boolean
}

export const PageLayout = ({ headers, noPadding = false }: PageLayoutProps) => (
  <Suspense fallback={<Loader/>}>
    {headers ? <SubHeader items={headers} /> : null}
    <Container sx={{ ...(!noPadding && { padding: "20px 30px" }) }} maxWidth={false}>
      <ErrorBoundary>
        <Outlet/>
      </ErrorBoundary>
    </Container>
  </Suspense>
);
