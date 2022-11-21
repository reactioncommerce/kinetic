import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const EligibleItems = () => (
  <Stack direction="column" gap={1}>
    <Typography variant="subtitle2">Eligible Items</Typography>
    <Paper sx={{ py: 1, px: 3, backgroundColor: "grey.100" }}>
      <Typography variant="subtitle2" sx={{ pb: 1.5 }}>Including all products</Typography>
      <Button variant="outlined" color="secondary" size="small">Add Condition</Button>
    </Paper>
    <Paper sx={{ py: 1, px: 3, backgroundColor: "grey.100" }}>
      <Typography variant="subtitle2" sx={{ pb: 1.5 }}>Excluding no products</Typography>
      <Button variant="outlined" color="secondary" size="small">Add Condition</Button>
    </Paper>
  </Stack>

);
