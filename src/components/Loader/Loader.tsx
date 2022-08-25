import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export const Loader = () =>
  <Stack width="100%" justifyContent="center" height={100} alignItems="center">
    <CircularProgress color="inherit" />
  </Stack>;
