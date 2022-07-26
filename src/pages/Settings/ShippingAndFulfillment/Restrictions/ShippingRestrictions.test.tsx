import "@testing-library/jest-dom";
import { shippingMethods, shippingRestrictions } from "@mocks/handlers/shippingHandlers";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";
import { RestrictionTypeEnum } from "@graphql/types";

import ShippingRestrictions from ".";


describe("Shipping Restrictions", () => {
  it("should render shipping restrictions table", async () => {
    renderWithProviders(<ShippingRestrictions />);
    await screen.findByText("Shipping Restrictions");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    shippingRestrictions.forEach((restriction) => {
      const conditionColumnData = restriction.attributes?.length === 0 ?
        "0 Conditions" :
        `${restriction.attributes?.[0]?.property} ${restriction.attributes?.[0]?.operator} ${restriction.attributes?.[0]?.value}`;
      expect(screen.getByText(conditionColumnData)).toBeInTheDocument();
      expect(screen.getAllByText("0 Destinations")[0]).toBeInTheDocument();
      expect(screen.getAllByText(restriction.methodIds?.length === 1 ? "1 Method" : `${restriction.methodIds?.length} Methods`)[0]).toBeInTheDocument();
      const typeColumnData = restriction.type === RestrictionTypeEnum.Allow ? "ALLOW" : "DENY";
      expect(screen.getByText(typeColumnData)).toBeInTheDocument();
    });
  });

  it("should successfully create a new shipping restriction", async () => {
    renderWithProviders(<ShippingRestrictions/ >);
    await screen.findByText("Shipping Restrictions");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add Shipping Restriction")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    const user = userEvent.setup();


    const drawer = screen.getByRole("presentation");
    await user.click(within(drawer).getByText("Add"));

    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByPlaceholderText("Property")).toBeInvalid();
    expect(screen.getByPlaceholderText("Value")).toBeInvalid();

    expect(screen.getByText("Add Shipping Restriction")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Property"), "price");
    await user.type(screen.getByPlaceholderText("Value"), "10");

    fireEvent.mouseDown(screen.getByPlaceholderText("Type to enter a country"));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Vietnam"));

    expect(screen.getByText("Vietnam")).toBeInTheDocument();

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Add Shipping Restriction")).not.toBeInTheDocument();
    });
  });

  it("should successfully delete a shipping restriction", async () => {
    renderWithProviders(<ShippingRestrictions/>);
    await screen.findByText("Shipping Restrictions");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("ALLOW"));
    expect(screen.getByText("Edit Shipping Restriction")).toBeInTheDocument();
    await screen.findByText(shippingMethods[0].name);
    await screen.findByText(shippingMethods[1].name);

    expect(screen.getByText("Delete")).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Shipping Restriction")).not.toBeInTheDocument();
    });
  });
});
