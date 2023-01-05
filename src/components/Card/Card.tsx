import { PropsWithChildren } from "react";
import MuiCard from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export type CardProps = {
  title: string
  action?: JSX.Element
  divider?: boolean
}

export const Card = ({ title, action, children, divider }: PropsWithChildren<CardProps>) => (
  <MuiCard variant="outlined">
    <CardHeader title={title} action={action} />
    {divider ? <Divider/> : null}
    <Box px={2} pb={1}>
      {children}
    </Box>
  </MuiCard>
);
