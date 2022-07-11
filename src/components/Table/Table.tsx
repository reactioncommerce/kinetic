import TableContainer from "@mui/material/TableContainer";
import MuiTable, { TableProps as MuiTableProps } from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    align: TableCellProps["align"]
  }
}


type TableProps<T> = MuiTableProps & {
  columns: ColumnDef<T>[]
  data: T[]
}

export function Table<T>({ stickyHeader = true, data, columns }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <TableContainer sx={{ maxHeight: 400 }}>
      <MuiTable stickyHeader={stickyHeader}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} {...header.column.columnDef?.meta}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody sx={{ bgcolor: "background.paper" }}>
          {table.getRowModel().rows.map((row) => (
            <TableRow hover key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} {...{ ...cell.column.columnDef?.meta }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
