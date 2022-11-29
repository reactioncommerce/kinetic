import { enabledPromotions } from "@mocks/handlers/promotionsHandlers";
import { Route, Routes } from "react-router-dom";
import { format } from "date-fns";

import { AppLayout } from "@containers/Layouts";
import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";


import PromotionDetails from ".";

const promotion = enabledPromotions[0];
describe("Promotion Details", () => {
  it("should display promotion details", async () => {
    renderWithProviders(<Routes>
      <Route element={<AppLayout/>}>
        <Route path="promotions/:promotionId" element={<PromotionDetails/>}/>
      </Route>
    </Routes>, { initialEntries: [`/promotions/${promotion._id}`] });
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));
    expect(screen.getAllByText(promotion.name)).toHaveLength(2);
    expect(screen.getByLabelText("Promotion Name")).toHaveValue(promotion.name);
    expect(screen.getAllByText("Order Discount")).toHaveLength(2);
    expect(screen.getByText("% Off")).toBeInTheDocument();
    expect(screen.queryByText("Add Action")).not.toBeInTheDocument();
    expect(screen.getByText("Add Trigger")).toBeInTheDocument();
    expect(screen.getByLabelText("Discount Value")).toHaveValue(promotion.actions[0].actionParameters?.discountValue);
    expect(screen.getByLabelText("Stack All")).toBeInTheDocument();
    expect(screen.getByLabelText("Available From")).toHaveValue(format(promotion.startDate, "MM/dd/yyyy"));
    expect(screen.getByLabelText("Available To")).toHaveValue(format(promotion.endDate, "MM/dd/yyyy"));
    expect(screen.getByLabelText("Checkout Label")).toHaveValue(promotion.label);
  });
});
