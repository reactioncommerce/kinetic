import Paper from "@mui/material/Paper";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const AccessDenied = () => (
  <Paper variant="outlined" component={Stack} justifyContent="center" direction="column" minHeight={350} alignItems="center" gap={2}>
    <AdminPanelSettingsIcon sx={{ fontSize: "64px", color: "grey.500" }}/>
    <Typography variant="h6">You need permission to view this page.</Typography>
    <Typography variant="body2">Email you shop owner to get access</Typography>
  </Paper>
);
