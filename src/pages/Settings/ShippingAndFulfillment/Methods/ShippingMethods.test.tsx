import "@testing-library/jest-dom";
import { shippingMethods } from "@mocks/handlers/shippingHandlers";

import { render, screen, waitForElementToBeRemoved } from "@utils/test-utils";

import ShippingMethods from ".";


describe("Shipping Methods", () => {
  it("should render shipping methods table", async () => {
    render(<ShippingMethods/>);
    await screen.findByText("Shipping Methods");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    shippingMethods.forEach((method) => {
      expect(screen.getByText(method.name)).toBeInTheDocument();
      expect(screen.getByText(method.label)).toBeInTheDocument();
      expect(screen.getAllByText(method.group)[0]).toBeInTheDocument();
      expect(screen.getByText(method.rate)).toBeInTheDocument();
      const enabledText = method.isEnabled ? "ENABLED" : "DISABLED";
      expect(screen.getAllByText(enabledText)[0]).toBeInTheDocument();
    });
  });
});
