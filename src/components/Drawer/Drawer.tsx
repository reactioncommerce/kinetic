import Paper from "@mui/material/Paper";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import { DrawerActions } from "./DrawerActions";
import { DrawerContent } from "./DrawerContent";

type DrawerProps = MuiDrawerProps & {
  title: string;
};

const Drawer = ({
  anchor = "right",
  PaperProps,
  title,
  children,
  ...props
}: DrawerProps) => (
  <MuiDrawer
    anchor={anchor}
    PaperProps={{
      sx: {
        width: 620,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column"
      },
      ...PaperProps
    }}
    {...props}
  >
    <Paper variant="outlined" square sx={{ padding: 3 }}>
      <Typography variant="subtitle1">{title}</Typography>
    </Paper>
    {children}
  </MuiDrawer>
);

Drawer.Content = DrawerContent;
Drawer.Actions = DrawerActions;

export default Drawer;