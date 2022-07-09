import Container, { ContainerProps } from "@mui/material/Container";

type FullHeightLayoutProps = {
  children: JSX.Element | JSX.Element[];
  maxWidth?: ContainerProps["maxWidth"]
};

export const FullHeightLayout = ({ children, maxWidth = false }: FullHeightLayoutProps) => (
  <Container
    component="main"
    maxWidth={maxWidth}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      justifyContent: "center"
    }}>
    {children}
  </Container>
);
