import "@testing-library/jest-dom";
import { paymentMethods } from "@mocks/handlers/checkoutSettingsHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

import PaymentMethods from ".";


describe("Payment Methods", () => {
  it("should render list of payment methods", async () => {
    renderWithProviders(<PaymentMethods/>);
    await screen.findByText("Payment Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    paymentMethods.forEach((pm) => {
      expect(screen.getByText(pm.displayName)).toBeInTheDocument();
    });

    const enabledMethods = paymentMethods.filter((pm) => pm.isEnabled);
    expect(screen.getAllByText("Enabled")).toHaveLength(enabledMethods.length);

    expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(enabledMethods.length);
  });
});
