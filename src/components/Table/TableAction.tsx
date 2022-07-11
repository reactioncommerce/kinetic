import Button, { ButtonProps } from "@mui/material/Button";

type TableActionProps = ButtonProps

export const TableAction = (props: TableActionProps) => (
  <Button variant="outlined" color="secondary" size="small" {...props} />
);
