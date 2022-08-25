import { shop } from "@mocks/handlers/shopSettingsHandlers";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import LocalizationSettings from ".";

describe("Shop Localization Settings", () => {
  it("should render shop localization settings", async () => {
    renderWithProviders(<LocalizationSettings/>);
    await screen.findByText("Shop Defaults");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));
    expect(screen.getByText(shop.timezone || "Not provided")).toBeInTheDocument();
    expect(screen.getByText("USD | $ | %s%v")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Pounds")).toBeInTheDocument();
    expect(screen.getByText("Feet")).toBeInTheDocument();
  });

  it("should update shop localization successfully", async () => {
    renderWithProviders(<LocalizationSettings/>);
    await screen.findByText("Shop Defaults");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Shop Defaults")).toBeInTheDocument();

    expect(screen.getByText(shop.timezone || "Not provided")).toBeInTheDocument();
    expect(screen.getByText("USD | $ | %s%v")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Pounds")).toBeInTheDocument();
    expect(screen.getByText("Feet")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("Timezone"));
    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByLabelText("Timezone")).toBeInvalid();
    expect(screen.getByText("Edit Shop Defaults")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText("Timezone"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Africa/Asmera"));
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Shop Defaults")).not.toBeInTheDocument();
    });
  });
});
