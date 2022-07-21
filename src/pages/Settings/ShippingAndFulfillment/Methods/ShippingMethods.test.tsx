import "@testing-library/jest-dom";
import { shippingMethods } from "@mocks/handlers/shippingHandlers";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved } from "@utils/testUtils";

import ShippingMethods from ".";


describe("Shipping Methods", () => {
  it("should render shipping methods table", async () => {
    renderWithProviders(<ShippingMethods/>);
    await screen.findByText("Shipping Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    shippingMethods.forEach((method) => {
      expect(screen.getByText(method.name)).toBeInTheDocument();
      expect(screen.getByText(method.label)).toBeInTheDocument();
      expect(screen.getAllByText(method.group)[0]).toBeInTheDocument();
      expect(screen.getByText(`$${method.rate + method.handling}`)).toBeInTheDocument();
      const enabledText = method.isEnabled ? "ENABLED" : "DISABLED";
      expect(screen.getAllByText(enabledText)[0]).toBeInTheDocument();
    });
  });

  it("should successfully create a new shipping method", async () => {
    renderWithProviders(<ShippingMethods/>);
    await screen.findByText("Shipping Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add Shipping Method")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByText("Add Shipping Method")).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInvalid();
    expect(screen.getByLabelText("Label")).toBeInvalid();

    await user.type(screen.getByLabelText("Name"), "New Shipping Method");
    await user.type(screen.getByLabelText("Label"), "Shipping Label");

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Add Shipping Method")).not.toBeInTheDocument();
    });
  });

  it("should successfully delete a shipping method", async () => {
    renderWithProviders(<ShippingMethods/>);
    await screen.findByText("Shipping Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText(shippingMethods[0].name));
    expect(screen.getByText("Edit Shipping Method")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Shipping Method")).not.toBeInTheDocument();
    });
  });
});
