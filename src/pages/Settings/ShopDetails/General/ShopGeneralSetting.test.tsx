import { shop } from "@mocks/handlers/shopSettingsHandlers";

import { decodeOpaqueId } from "@utils/decodedOpaqueId";
import { fireEvent, renderWithProviders, screen, userEvent, waitFor } from "@utils/testUtils";

import ShopGeneralSettings from ".";

describe("Shop General Settings", () => {
  it("should render shop general settings section", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Details");

    expect(screen.getByText(shop.name)).toBeInTheDocument();
    expect(screen.getByText(shop.description ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop.emails?.[0]?.address ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop.storefrontUrls?.storefrontHomeUrl ?? "--")).toBeInTheDocument();
    expect(screen.getByText(shop._id)).toBeInTheDocument();
  });

  it("should update shop details successfully", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Details");
    fireEvent.click(screen.getAllByText("Edit")[0]);
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

  it("should render shop primary address settings section", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Primary Address");

    expect(screen.getByText(shop.addressBook?.[0]?.fullName || "Not provided")).toBeInTheDocument();
    expect(screen.getByText(shop.addressBook?.[0]?.phone || "Not provided")).toBeInTheDocument();
    expect(screen.getByText(shop.addressBook?.[0]?.address1 || "Not provided")).toBeInTheDocument();
    expect(screen.getByText(shop.addressBook?.[0]?.city || "Not provided")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Connecticut")).toBeInTheDocument();
    expect(screen.getByText(shop.addressBook?.[0]?.postal || "Not provided")).toBeInTheDocument();
  });


  it("should update shop primary address successfully", async () => {
    renderWithProviders(<ShopGeneralSettings/>);
    await screen.findByText("Primary Address");
    fireEvent.click(screen.getAllByText("Edit")[1]);
    expect(screen.getByText("Edit Primary Address")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("Legal Name"));
    await user.type(screen.getByLabelText("Legal Name"), "Roberts 50 USA LLC");

    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText(shop.addressBook?.[0]?.phone || "Not provided")).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Phone Number"));
    await user.type(screen.getByLabelText("Phone Number"), "0324835435");
    expect(screen.getByLabelText("Phone Number")).toHaveDisplayValue("032-483-5435");

    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Primary Address")).not.toBeInTheDocument();
    });
  });
});
