import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

import { AppLogo } from "@components/AppLogo";
import { FullHeightLayout } from "@containers/Layouts";
import { useAccount } from "@containers/AccountProvider";

const AccessDenied = () => {
  const { removeAccessToken } = useAccount();
  const navigate = useNavigate();

  const handleClickSignIn = () => {
    removeAccessToken();
    navigate("/login", { replace: true });
  };

  return (
    <FullHeightLayout maxWidth="xs">
      <AppLogo theme="dark" sx={{ mb: "50px" }} />
      <Typography component="h1" variant="h4" gutterBottom>
  Access Denied
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="grey.700" noWrap>
  You need permission to access the admin interface.
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="grey.700" noWrap>Email your shop owner to get access.</Typography>
      <Link component="button" onClick={handleClickSignIn} variant="body2" underline="none" sx={{ mt: 2 }}>
    Sign in to another account
      </Link>
    </FullHeightLayout>
  );
};

export default AccessDenied;
