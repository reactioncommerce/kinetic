import Paper from "@mui/material/Paper";

import { TableHeader } from "./TableHeader";

type TableContainerProps = {
  children: JSX.Element | JSX.Element[]
}

const TableContainer = ({ children }: TableContainerProps) => (
  <Paper variant="outlined" sx={{ bgcolor: "background.default" }}>
    {children}
  </Paper>
);

TableContainer.Header = TableHeader;

export default TableContainer;
