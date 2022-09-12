import Box from "@mui/material/Box";
import { SxProps } from "@mui/material/styles";

import fullWhiteLogo from "../../full-white-logo.svg";
import fullLogo from "../../full-logo.svg";

type AppLogoProps = {
  theme: "light" | "dark";
  sx?: SxProps;
};

export const AppLogo = ({ theme, sx }: AppLogoProps) => (
  <Box
    sx={{ width: "fit-content", height: "2.5rem", ...sx }}
    component="img"
    src={theme === "light" ? fullWhiteLogo : fullLogo}
    alt="Kinetic Logo"/>
);
