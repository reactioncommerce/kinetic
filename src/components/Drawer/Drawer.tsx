import Paper from "@mui/material/Paper";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

type DrawerProps = MuiDrawerProps & {
  title: string
}

export const Drawer = ({ anchor = "right", PaperProps, title, children, ...props }: DrawerProps) => (
  <MuiDrawer
    anchor={anchor}
    PaperProps={{ sx: { width: 620, maxWidth: "100%", display: "flex", flexDirection: "column" }, ...PaperProps }}
    {...props}>
    <Paper variant="outlined" square sx={{ padding: "20px" }}>
      <Typography variant="subtitle1">{title}</Typography>
    </Paper>
    <Paper sx={{ bgcolor: "background.default", flex: "1", padding: "20px" }}>
      {children}
    </Paper>
  </MuiDrawer>
);
