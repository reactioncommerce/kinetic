import { customers } from "@mocks/handlers/customersHandlers";

import { formatDate } from "@utils/common";
import { renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved } from "@utils/testUtils";

import Customers from ".";

describe("Customers", () => {
  it("should render Customers table", async () => {
    renderWithProviders(<Customers/>);
    await screen.findByText("Customers");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    customers.forEach((customer) => {
      expect(screen.getByText(customer.primaryEmailAddress)).toBeInTheDocument();
      expect(screen.getByText(customer.userId)).toBeInTheDocument();
      expect(screen.getByText(formatDate(customer.createdAt))).toBeInTheDocument();
    });
    expect(screen.getByRole("columnheader", { name: "Registered" })).toHaveAttribute("aria-sort", "ascending");
    userEvent.click(screen.getByText("Registered"));
    await waitFor(() => {
      expect(screen.getByRole("columnheader", { name: "Registered" })).toHaveAttribute("aria-sort", "descending");
    });
  });
});
