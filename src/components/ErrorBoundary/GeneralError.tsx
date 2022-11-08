import Typography from "@mui/material/Typography";

import { FullHeightLayout } from "@containers/Layouts";
import { AppLogo } from "@components/AppLogo";

type GeneralErrorProps = {
  title?: string
  description?: string
}

export const GeneralError = ({ title = "Something went wrong.", description = "Email you shop owner to get access." }:GeneralErrorProps) => (
  <FullHeightLayout maxWidth="md">
    <AppLogo theme="dark" sx={{ mb: 3 }} />
    <Typography component="h1" variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="subtitle1" gutterBottom color="grey.700" noWrap>{description}</Typography>
  </FullHeightLayout>
);
