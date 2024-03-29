import "@testing-library/jest-dom";
import { taxServices } from "@mocks/handlers/checkoutSettingsHandlers";

import { renderWithProviders, screen, userEvent, waitForElementToBeRemoved } from "@utils/testUtils";

import TaxServices from ".";


describe("Tax Services", () => {
  it("should render list of tax services", async () => {
    renderWithProviders(<TaxServices/>);
    await screen.findByText("Tax Methods");
    await waitForElementToBeRemoved(() => screen.queryAllByRole("progressbar"));

    taxServices.forEach((tax) => {
      expect(screen.getByText(tax.displayName)).toBeInTheDocument();
    });
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });


  it("should be able to update tax method", async () => {
    renderWithProviders(<TaxServices/>);
    await screen.findByText("Tax Methods");
    await waitForElementToBeRemoved(() => screen.queryAllByRole("progressbar"));

    const moreBtn = screen.getAllByRole("button", { name: "more" })[0];
    const user = userEvent.setup();

    await user.click(moreBtn);
    expect(screen.getByText("Remove as Primary Method")).toBeInTheDocument();
    expect(screen.getByText("Set as Fallback Method")).toBeInTheDocument();
    await user.click(screen.getByText("Set as Fallback Method"));
    expect(screen.getByText(`Set ${taxServices[0].displayName} as Fallback Method successfully.`)).toBeInTheDocument();

    const secondMoreBtn = screen.getAllByRole("button", { name: "more" })[1];
    await user.click(secondMoreBtn);
    expect(screen.getByText("Remove as Fallback Method")).toBeInTheDocument();
    expect(screen.getByText("Set as Primary Method")).toBeInTheDocument();

    await user.click(screen.getByText("Remove as Fallback Method"));
    expect(screen.getByText("Remove as Fallback Method successfully.")).toBeInTheDocument();
  });
});
