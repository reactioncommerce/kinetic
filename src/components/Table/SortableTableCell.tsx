import TableSortLabel from "@mui/material/TableSortLabel";
import TableCell from "@mui/material/TableCell";
import { flexRender, Header } from "@tanstack/react-table";

type SortableTableCellProps<T> = {
  header: Header<T, unknown>
}

export const SortableTableCell = <T, >({ header }: SortableTableCellProps<T>) => {
  const sortDirection = header.column.getIsSorted();
  return (
    <TableCell
      key={header.id} sx={{ whiteSpace: "nowrap" }} {...header.column.columnDef?.meta}
      sortDirection={sortDirection ?? false}
    >
      <TableSortLabel
        active={!!sortDirection}
        direction={sortDirection || "asc"}
        onClick={header.column.getToggleSortingHandler()}
      >
        {header.isPlaceholder
          ? null
          : flexRender(
            header.column.columnDef.header,
            header.getContext()
          )}
      </TableSortLabel>
    </TableCell>
  );
};
