import { SxProps } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import React from "react";

type DrawerContentProps = {
  children: JSX.Element | (JSX.Element | null)[] | null;
  sx?: SxProps;
};

export const DrawerContent = ({ children, sx }: DrawerContentProps) => (
  <Paper
    sx={{
      bgcolor: "background.default",
      flex: 1,
      padding: 3,
      ...sx
    }}
  >
    {children}
  </Paper>
);
