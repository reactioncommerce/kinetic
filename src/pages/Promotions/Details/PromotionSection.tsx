import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type PromotionSectionProps = {
  title: string
  children: ReactNode
}

export const PromotionSection = ({ title, children }: PromotionSectionProps) => (
  <Container maxWidth={false}>
    <Paper variant="outlined" sx={{ py: 1 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ pl: 2 }}>{title}</Typography>
      <Divider/>
      <Box px={2} pb={1}>
        {children}
      </Box>
    </Paper>
  </Container>
);
