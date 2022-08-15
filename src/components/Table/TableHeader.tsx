import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type TableHeaderProps = {
  title: string
  action?: JSX.Element
}

export const TableHeader = ({ title, action }: TableHeaderProps) => (
  <Stack justifyContent="space-between" alignItems="center" direction="row" padding="20px" pb={0}>
    <Typography variant="h6">{title}</Typography>
    {action}
  </Stack>
);
