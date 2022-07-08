import Box from "@mui/material/Box";
import { SxProps } from "@mui/material/styles";

type AppLogoProps = {
  theme: "light" | "dark";
  sx?: SxProps;
};

export const AppLogo = ({ theme, sx }: AppLogoProps) => (
  <Box
    sx={{ width: "fit-content", height: "2.5rem", ...sx }}
    component="img"
    src={theme === "light" ? "/src/full-white-logo.svg" : "/src/full-logo.svg" }
    alt="Kinetic Logo"/>
);
