import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TablePaginationProps as MuiTablePaginationProps } from "@mui/material/TablePagination";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import IconButton from "@mui/material/IconButton";

type TablePaginationProps = Omit<MuiTablePaginationProps, "rowsPerPageOptions" | "onRowsPerPageChange" | "onPageChange"> & {
  pageCount: number
  rowsLength: number
  onRowsPerPageChange: (newRowsPerPage: number) => void
  rowsPerPageOptions: number[]
  onPageChange: (page: number) => void
  disabledPrevButton: boolean
  disabledNextButton: boolean
  onClickNextPage: () => void
  onClickPreviousPage: () => void
}

export default function TablePagination({
  rowsPerPageOptions = [10, 25, 50, 100],
  pageCount,
  onPageChange,
  page,
  rowsPerPage,
  count,
  onRowsPerPageChange,
  rowsLength,
  disabledNextButton,
  disabledPrevButton,
  onClickNextPage,
  onClickPreviousPage
}: TablePaginationProps) {
  return (
    <Stack sx={{ backgroundColor: "background.default", padding: 2 }} direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center">
        <Typography variant="caption" color="grey.700">
          {page * rowsPerPage + 1}-{page * rowsPerPage + rowsLength} of {count}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
        <Typography variant="caption" color="grey.700">Rows/page: </Typography>
        <Select
          variant="standard"
          input={<InputBase />}
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          sx={{
            "fontSize": "0.75rem",
            "& .MuiSelect-select": {
              paddingLeft: 1,
              paddingRight: 3,
              textAlign: "right",
              textAlignLast: "right"
            }
          }}
        >
          {rowsPerPageOptions.map((rowsPerPageOption) => (
            <MenuItem
              key={rowsPerPageOption.toString()}
              value={rowsPerPageOption}
            >
              {rowsPerPageOption}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography variant="caption" color="grey.700">
          Page
        </Typography>
        <InputBase sx={{ "mx": 1, "width": "40px", "fontSize": "0.75rem", "& .MuiInputBase-input": { padding: 0 } }}
          type="number" defaultValue={page + 1} onChange={(event) => {
            const currentPage = event.target.value ? Number(event.target.value) - 1 : 0;
            onPageChange(currentPage);
          }}
        />
        <Typography variant="caption" color="grey.700">
          of {pageCount}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
        <IconButton size="small" aria-label="Go To Previous Page" sx={{ mr: 1 }} disabled={disabledPrevButton} onClick={onClickPreviousPage}>
          <WestIcon fontSize="inherit" />
        </IconButton>
        <IconButton size="small" aria-label="Go To Next Page" disabled={disabledNextButton} onClick={onClickNextPage}>
          <EastIcon fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
