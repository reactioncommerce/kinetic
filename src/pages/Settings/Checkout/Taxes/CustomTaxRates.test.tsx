import "@testing-library/jest-dom";
import { taxCodes, taxRates } from "@mocks/handlers/checkoutSettingsHandlers";
import { startCase } from "lodash-es";

import { renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";
import { TaxSource } from "@graphql/types";

import { CustomTaxRates } from "./CustomTaxRates";


describe("Custom Tax Rates", () => {
  it("should render list of custom tax rates", async () => {
    renderWithProviders(<CustomTaxRates/>);
    await screen.findByText("Custom Tax Rates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    taxRates.forEach((taxRate) => {
      expect(screen.getByText(`${parseFloat(String(taxRate.rate))}%`)).toBeInTheDocument();
      const sourceType = taxRate.sourcing === TaxSource.Destination ? "Destination" : "Origin";
      expect(screen.getAllByText(`${sourceType} conditions`)[0]).toBeInTheDocument();
    });

    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText(taxCodes[0].label)).toBeInTheDocument();
    expect(screen.getByText(taxCodes[1].label)).toBeInTheDocument();
  });


  it("should be able to update custom tax rate", async () => {
    renderWithProviders(<CustomTaxRates/>);
    await screen.findByText("Custom Tax Rates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    const editBtn = screen.getAllByText("Edit")[0];
    const user = userEvent.setup();

    await user.click(editBtn);
    expect(screen.getByText("Edit Custom Tax Rate")).toBeInTheDocument();
    expect(screen.getByLabelText("Rate")).toHaveValue(`${taxRates[0].rate}%`);
    expect(screen.getByLabelText("Type")).toHaveValue(startCase(taxRates[0].sourcing));

    await user.click(screen.getByLabelText("Type"));

    await user.click(within(screen.getByRole("listbox")).getByText("Origin"));

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Custom Tax Rate")).not.toBeInTheDocument();
    });
  });

  it("should be able to create custom tax rate", async () => {
    renderWithProviders(<CustomTaxRates/>);
    await screen.findByText("Custom Tax Rates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    const addBtn = screen.getByText("Add");
    const user = userEvent.setup();

    await user.click(addBtn);
    expect(screen.getByText("Add Custom Tax Rate")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Rate"), "2");
    await user.tab();
    expect(screen.getByLabelText("Rate")).toHaveValue("2%");

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Custom Tax Rate")).not.toBeInTheDocument();
    });
  });
});
