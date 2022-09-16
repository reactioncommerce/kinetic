import "@testing-library/jest-dom";
import { taxServices } from "@mocks/handlers/checkoutSettingsHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

import TaxServices from ".";


describe("Tax Services", () => {
  it("should render list of tax services", async () => {
    renderWithProviders(<TaxServices/>);
    await screen.findByText("Tax Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    taxServices.forEach((tax) => {
      expect(screen.getByText(tax.displayName)).toBeInTheDocument();
    });
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
