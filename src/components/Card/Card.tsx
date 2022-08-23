import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { PropsWithChildren } from "react";

export type CardProps = {
  title: string
  action?: JSX.Element
}

export const Card = ({ title, action, children }: PropsWithChildren<CardProps>) => (
  <Paper variant="outlined" sx={{ padding: 2 }}>
    <Stack alignItems="center" justifyContent="space-between" direction="row" mb={2}>
      <Typography variant="subtitle1">{title}</Typography>
      {action}
    </Stack>
    {children}
  </Paper>
);
