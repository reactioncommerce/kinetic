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
  flexRender,
  PaginationState,
  TableState
} from "@tanstack/react-table";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { Dispatch, SetStateAction } from "react";
import { ceil } from "lodash-es";

import { TablePagination } from "./TablePagination";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    align?: TableCellProps["align"];
  }
}

type TableProps<T> = MuiTableProps & {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (data: T) => void;
  loading?: boolean;
  totalCount?: number;
  tableState: Partial<TableState>;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  emptyPlaceholder?: JSX.Element
  maxHeight?: number
};

export function Table<T>({
  stickyHeader = true,
  data,
  columns,
  onRowClick,
  loading = false,
  totalCount = data.length,
  tableState,
  onPaginationChange,
  emptyPlaceholder,
  maxHeight
}: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: tableState,
    pageCount: tableState.pagination?.pageSize ? ceil(totalCount / tableState.pagination.pageSize) : -1,
    onPaginationChange
  });

  const tableBodyContent = table.getRowModel().rows.length === 0 ? (
    <TableRow>
      <TableCell colSpan={table.getAllColumns().length} sx={{ height: "300px" }} align="center">{emptyPlaceholder ?? "No Data"}</TableCell>
    </TableRow>
  ) : (
    table.getRowModel().rows.map((row) => (
      <TableRow
        hover
        key={row.id}
        onClick={() => onRowClick?.(row.original)}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            {...{ ...cell.column.columnDef?.meta }}
          >
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </TableCell>
        ))}
      </TableRow>
    ))
  );

  return (
    <Paper>
      <TableContainer sx={{ maxHeight }}>
        <MuiTable stickyHeader={stickyHeader}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} sx={{ whiteSpace: "nowrap" }} {...header.column.columnDef?.meta}>
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  align="center"
                >
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            ) : tableBodyContent}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        count={totalCount}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        onPageChange={(newPage) => table.setPageIndex(newPage)}
        onRowsPerPageChange={table.setPageSize}
        disabledNextButton={!table.getCanNextPage()}
        disabledPrevButton={!table.getCanPreviousPage()}
        onClickNextPage={table.nextPage}
        onClickPreviousPage={table.previousPage}
      />
    </Paper>
  );
}
