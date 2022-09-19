import "@testing-library/jest-dom";
import { taxServices } from "@mocks/handlers/checkoutSettingsHandlers";

import { fireEvent, renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

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


  it("should be able to update tax method", async () => {
    renderWithProviders(<TaxServices/>);
    await screen.findByText("Tax Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    const moreBtn = screen.getAllByRole("button", { name: "more" })[0];

    fireEvent.click(moreBtn);
    expect(screen.getByText("Set as Primary Method")).toBeInTheDocument();
    expect(screen.getByText("Set as Fallback Method")).toBeInTheDocument();
  });
});
