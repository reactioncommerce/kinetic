import { disabledPromotions, enabledPromotions } from "@mocks/handlers/promotionsHandlers";

import { renderWithProviders, screen, userEvent, waitForElementToBeRemoved, within } from "@utils/testUtils";
import { PromotionType } from "types/promotions";

import { CALCULATION_TYPE_OPTIONS, PROMOTION_TYPE_OPTIONS } from "./constants";

import Promotions from ".";


describe("Promotions", () => {
  it("should render Promotions table", async () => {
    renderWithProviders(<Promotions/>);
    await screen.findAllByText("Promotions");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    enabledPromotions.forEach((promotion, index) => {
      expect(screen.getByText(promotion.label)).toBeInTheDocument();
      expect(screen.getByText(promotion.referenceId)).toBeInTheDocument();
      expect(screen.getAllByText(PROMOTION_TYPE_OPTIONS[promotion.promotionType as PromotionType].label)[index]).toBeInTheDocument();
      expect(screen.getAllByText(promotion.actions[0]?.actionParameters?.discountCalculationType ?
        CALCULATION_TYPE_OPTIONS[promotion.actions[0].actionParameters.discountCalculationType]?.label
        : "Unknown")
        [index]).toBeInTheDocument();
    });

    expect(within(screen.getByRole("tablist")).getByText("Active")).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByRole("table")).getAllByText("Active")).toHaveLength(enabledPromotions.length);

    await userEvent.click(within(screen.getByRole("tablist")).getByText("View All"));

    expect(within(screen.getByRole("tablist")).getByText("View All")).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByRole("table")).getAllByText("Active")).toHaveLength(enabledPromotions.length);
    expect(within(screen.getByRole("table")).getAllByText("Disabled")).toHaveLength(disabledPromotions.length);
  });
});
