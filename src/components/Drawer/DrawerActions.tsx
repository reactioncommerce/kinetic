import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

type DrawerActionsProps = {
  left?: JSX.Element;
  right?: JSX.Element;
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
    {left}
    {right}
  </Paper>
);
