import Typography from "@mui/material/Typography";

type MethodCellProps = {
  data?: string[]
}

export const MethodCell = ({ data = [] }: MethodCellProps) => (
  <Typography noWrap variant="body2">
    {data.length === 1
      ? "1 Method"
      : `${data.length} Methods`}
  </Typography>
);
