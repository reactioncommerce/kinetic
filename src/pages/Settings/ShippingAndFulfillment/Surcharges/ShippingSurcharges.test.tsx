import "@testing-library/jest-dom";
import { shippingMethods, shippingSurcharges } from "@mocks/handlers/shippingHandlers";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, within } from "@utils/testUtils";

import ShippingSurcharges from ".";


describe("Shipping Surcharges", () => {
  it("should render shipping surcharges table", async () => {
    renderWithProviders(<ShippingSurcharges/>);
    await screen.findByText("Shipping Surcharges");
    await waitFor(() => {
      shippingSurcharges.forEach((surcharge) => {
        expect(screen.getByText(surcharge.messagesByLanguage?.[0]?.content || "--")).toBeInTheDocument();
        expect(screen.getAllByText("0 Destinations")[0]).toBeInTheDocument();
        expect(screen.getAllByText(surcharge.methodIds?.length === 1 ? "1 Method" : `${surcharge.methodIds?.length} Methods`)[0]).toBeInTheDocument();
        expect(screen.getByText(surcharge.amount.displayAmount)).toBeInTheDocument();
      });
    });
  });

  it("should successfully create a new shipping method", async () => {
    renderWithProviders(<ShippingSurcharges/>);
    await screen.findByText("Shipping Surcharges");

    fireEvent.click(screen.getAllByText("Add")[0]);
    expect(screen.getByText("Add Shipping Surcharge")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    const user = userEvent.setup();

    fireEvent.mouseDown(screen.getByPlaceholderText("Type to enter a country"));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Vietnam"));

    expect(screen.getByText("Vietnam")).toBeInTheDocument();

    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByLabelText("Amount")).toBeInvalid();
    expect(screen.getByLabelText("Customer Message")).toBeInvalid();


    await user.type(screen.getByLabelText("Amount"), "0.5");
    await user.type(screen.getByLabelText("Customer Message"), "Customer Message");
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Add Shipping Surcharge")).not.toBeInTheDocument();
    });
  });

  it("should successfully delete a shipping method", async () => {
    renderWithProviders(<ShippingSurcharges/>);
    await screen.findByText("Shipping Surcharges");
    const firstRow = await screen.findByText(shippingSurcharges[0].amount.displayAmount);
    fireEvent.click(firstRow);
    expect(screen.getByText("Edit Shipping Surcharge")).toBeInTheDocument();
    await screen.findByText(shippingMethods[0].name);
    await screen.findByText(shippingMethods[1].name);

    expect(screen.getByText("Delete")).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Shipping Surcharge")).not.toBeInTheDocument();
    });
  });
});
