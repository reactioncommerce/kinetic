import Container from "@mui/material/Container";

type FullHeightLayoutProps = {
  children: JSX.Element | JSX.Element[];
};

export const FullHeightLayout = ({ children }: FullHeightLayoutProps) => (
  <Container
    component="main"
    maxWidth={false}
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
