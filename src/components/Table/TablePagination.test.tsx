import "@testing-library/jest-dom";

import { fireEvent, render, screen, within } from "@utils/testUtils";

import { TablePagination, TablePaginationProps } from "./TablePagination";


describe("TablePagination", () => {
  const defaultProps: TablePaginationProps = {
    rowsPerPageOptions: [10, 25, 50, 100],
    pageCount: 2,
    onPageChange: vi.fn(),
    page: 0,
    rowsPerPage: 10,
    count: 15,
    onRowsPerPageChange: vi.fn(),
    disabledNextButton: false,
    disabledPrevButton: true,
    onClickNextPage: vi.fn(),
    onClickPreviousPage: vi.fn()
  };

  it("should render page 1", async () => {
    render(<TablePagination {...defaultProps}/>);
    expect(screen.getByText("1–10 of 15")).toBeInTheDocument();
    expect(screen.getByLabelText("Rows/page:")).toHaveTextContent("10");
    fireEvent.mouseDown(screen.getByLabelText("Rows/page:"));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("25"));
    expect(defaultProps.onRowsPerPageChange).toHaveBeenCalledWith(25);

    expect(screen.getByLabelText("Go To Previous Page")).toBeDisabled();
  });

  it("should render page 2", async () => {
    render(<TablePagination {...defaultProps} page={1} />);
    expect(screen.getByText("11–15 of 15")).toBeInTheDocument();
    expect(screen.getByLabelText("Rows/page:")).toHaveTextContent("10");
  });
});
