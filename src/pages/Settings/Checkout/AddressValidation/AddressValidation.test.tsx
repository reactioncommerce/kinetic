import "@testing-library/jest-dom";
import { addressValidationServices } from "@mocks/handlers/checkoutSettingsHandlers";

import { renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import AddressValidationService from ".";


describe("AddressValidationService", () => {
  it("should render list of address validation services", async () => {
    renderWithProviders(<AddressValidationService />);
    await screen.findByText("Address Validation Services");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    addressValidationServices.forEach((service) => {
      expect(screen.getByText(service.displayName)).toBeInTheDocument();
    });

    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("All Countries")).toBeInTheDocument();
  });


  it("should be able to update address validation service", async () => {
    renderWithProviders(<AddressValidationService />);
    await screen.findByText("Address Validation Services");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    const editBtn = screen.getAllByText("Edit")[0];
    const user = userEvent.setup();

    await user.click(editBtn);
    const drawer = screen.getByRole("presentation");

    expect(within(drawer).getByText("Edit Address Validation Service")).toBeInTheDocument();

    expect(within(drawer).getByLabelText("Name")).toHaveValue(addressValidationServices[0].displayName);
    expect(within(drawer).getByText("Canada")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Country"));

    await user.click(within(screen.getByRole("listbox")).getByText("United States"));

    await user.tab();

    expect(screen.getByLabelText("Country")).toBeInvalid();

    await user.click(screen.getByLabelText("Country"));

    await user.click(within(screen.getByRole("listbox")).getByText("Vietnam"));

    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Add Shipping Method")).not.toBeInTheDocument();
    });
  });
});
