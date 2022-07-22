import "@testing-library/jest-dom";
import { shippingSurcharges } from "@mocks/handlers/shippingHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

import ShippingSurcharges from ".";


describe("Shipping Surcharges", () => {
  it("should render shipping surcharges table", async () => {
    renderWithProviders(<ShippingSurcharges/>);
    await screen.findByText("Shipping Surcharges");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    shippingSurcharges.forEach((surcharge) => {
      expect(screen.getByText(surcharge.messagesByLanguage?.[0]?.content || "--")).toBeInTheDocument();
      expect(screen.getAllByText("0 Destinations")[0]).toBeInTheDocument();
      expect(screen.getAllByText(`${surcharge.methodIds?.length} Methods`)[0]).toBeInTheDocument();
      expect(screen.getByText(surcharge.amount.displayAmount)).toBeInTheDocument();
    });
  });
});
