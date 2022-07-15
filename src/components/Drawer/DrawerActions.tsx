import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

type DrawerActionsProps = {
  left?: JSX.Element | null;
  right?: JSX.Element | null;
};

export const DrawerActions = ({ left, right }: DrawerActionsProps) => (
  <Paper
    component={Stack}
    width="100%"
    px={3}
    py={2}
    variant="outlined"
    square
    justifyContent="space-between"
    alignItems="center"
    direction="row"
  >
    <Box>{left}</Box>
    {right}
  </Paper>
);
