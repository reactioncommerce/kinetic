import { disabledPromotions, enabledPromotions } from "@mocks/handlers/promotionsHandlers";
import { Route, Routes } from "react-router-dom";
import { format } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AppLayout } from "@containers/Layouts";
import { renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";
import { DEFAULT_DATE_TIME_FORMAT } from "@components/DateTimePickerField";

import PromotionDetails from ".";

const promotion = disabledPromotions[0];

describe("Promotion Details", () => {
  it("should display promotion details", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${promotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });

    expect(screen.getByLabelText("Promotion Name")).toHaveValue(promotion.name);
    expect(screen.getAllByText("Order Discount")).toHaveLength(2);
    expect(screen.getByText("% Off")).toBeInTheDocument();
    expect(screen.queryByText("Add Action")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Trigger" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Discount Value")).toHaveValue(promotion.actions[0].actionParameters?.discountValue);
    expect(screen.getByLabelText("Stack with Any")).toBeInTheDocument();
    expect(screen.getByLabelText("Available From")).toHaveValue(format(promotion.startDate, DEFAULT_DATE_TIME_FORMAT));
    expect(screen.getByLabelText("Available To")).toHaveValue(format(promotion.endDate, DEFAULT_DATE_TIME_FORMAT));
    expect(screen.getByLabelText("Checkout Label")).toHaveValue(promotion.label);
  }, 50000);

  it("should update promotion details successfully", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${promotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });
    expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("Promotion Name"));
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Promotion Name"), "The North Face $5 Special");
    await user.click(screen.getByLabelText("Calculate Type"));
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(within(screen.getByRole("listbox")).queryByText("Free Shipping")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Promotion Type"));
    await user.click(within(screen.getByRole("listbox")).getByText("Shipping Discount"));
    await user.click(screen.getByLabelText("Calculate Type"));
    await user.click(within(screen.getByRole("listbox")).getByText("Free Shipping"));
    await user.type(screen.getByLabelText("Trigger Value"), "12");
    await user.click(screen.getAllByText("Add Condition")[0]);
    await user.click(screen.getByLabelText("Property"));
    await user.click(within(screen.getByRole("listbox")).getByText("Vendor"));
    await user.click(screen.getByLabelText("Operator"));
    await user.click(within(screen.getByRole("listbox")).getByText("Is"));
    await user.type(screen.getByPlaceholderText("Enter Values"), "value{enter}");
    await user.click(screen.getByText("Save Changes"));
  }, 50000);

  it("should not able to change some active promotion properties", async () => {
    const activePromotion = enabledPromotions[0];
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${activePromotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });
    expect(screen.getByLabelText("Available From")).toBeDisabled();
    expect(screen.getByLabelText("Promotion Type")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText("Available To")).not.toBeDisabled();
  }, 50000);

  it("should duplicate a promotion successfully", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${promotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });
    expect(screen.getByLabelText("Promotion Name")).toHaveValue(promotion.name);

    const user = userEvent.setup();
    await user.click(screen.getByText("Actions"));
    await user.click(within(screen.getByRole("menu")).getByText("Duplicate"));
    await waitFor(() => {
      expect(screen.getByLabelText("Promotion Name")).toHaveValue(enabledPromotions[0].name);
    });
  }, 50000);

  it("should be able to create a coupon promotion", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${promotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });
    const user = userEvent.setup();
    await user.click(screen.getByText("Remove Trigger"));
    await user.click(within(screen.getByRole("dialog")).getByText("Delete"));
    await user.click(screen.getByText("Add Trigger"));
    await user.click(screen.getByLabelText("Select Trigger Type"));
    await user.click(within(screen.getByRole("listbox")).getByText("Coupon is used (Standard)"));
    expect(screen.getByLabelText("Give your coupon a name")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Enter the coupon code (avoid characters like I, L, 0, and O)"), "TET2023");
    await user.click(screen.getByText("Save Changes"));
  }, 50000);


  it("should change trigger value field based on trigger type", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path="promotions/:promotionId" element={
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <PromotionDetails/>
            </LocalizationProvider>}/>
        </Route>
      </Routes>
      , { initialEntries: [`/promotions/${promotion._id}`] }
    );
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }), { timeout: 3000 });
    const user = userEvent.setup();
    expect(screen.getByText("Cart Value is greater than")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Trigger Value"), "12");

    await user.click(screen.getByLabelText("Select Trigger Type"));
    await user.click(within(screen.getByRole("listbox")).getByText("Item is in cart"));
    expect(screen.getByText("Minimum number of items required to trigger promotion")).toBeInTheDocument();
  }, 50000);
});
