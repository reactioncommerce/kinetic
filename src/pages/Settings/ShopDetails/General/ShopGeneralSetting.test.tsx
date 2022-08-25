import { shop } from "@mocks/handlers/shopSettingsHandlers";

import { decodeOpaqueId } from "@utils/decodedOpaqueId";
import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved } from "@utils/testUtils";

import ShopGeneralSettings from ".";

describe("Shop General Settings", () => {
  it("should render shipping methods table", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Details");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));
    expect(screen.getByText(shop.name)).toBeInTheDocument();
    expect(screen.getByText(shop.description ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop.emails?.[0]?.address ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop.storefrontUrls?.storefrontHomeUrl ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop._id)).toBeInTheDocument();
  });

  it("should update shop details successfully", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Details");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Shop Details")).toBeInTheDocument();

    expect(screen.getByText(shop.name)).toBeInTheDocument();
    expect(screen.getByText(shop.description ?? "Not provided")).toBeInTheDocument();
    expect(screen.getByText(shop.emails?.[0]?.address ?? "Not provided")).toBeInTheDocument();
    expect(screen.getByText(shop.storefrontUrls?.storefrontHomeUrl ?? "Not provided")).toBeInTheDocument();
    expect(screen.getByText(decodeOpaqueId(shop._id)?.id || "Not provided")).toBeInTheDocument();
    expect(screen.getByLabelText("Shop Logo URL")).toHaveDisplayValue(shop.shopLogoUrls?.primaryShopLogoUrl ?? "");

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("Name"));
    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByText("Edit Shop Details")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInvalid();
    await user.type(screen.getByLabelText("Name"), "Shop Name");
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Shop Details")).not.toBeInTheDocument();
    });
  });
});
