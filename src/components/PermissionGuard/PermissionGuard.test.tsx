import { renderWithProviders, screen } from "@utils/testUtils";

import { PermissionGuard } from ".";

describe("PermissionGuard", () => {
  it("should display AccessDenied component if current account is not allowed to access resource", async () => {
    renderWithProviders(<PermissionGuard permissions={["shops/create"]}>
      <div>Shop</div>
    </PermissionGuard>);
    const accessDeniedComponent = await screen.findByText("You need permission to view this page.");
    expect(accessDeniedComponent).toBeInTheDocument();
  });

  it("should display children component if current account is allowed to access resource", async () => {
    renderWithProviders(<PermissionGuard permissions={["accounts/invite:group"]}>
      <div>Shop</div>
    </PermissionGuard>);
    expect(screen.queryByText("You need permission to view this page.")).not.toBeInTheDocument();
    const children = await screen.findByText("Shop");
    expect(children).toBeInTheDocument();
  });

  it("should check all provided permissions", async () => {
    renderWithProviders(<PermissionGuard permissions={["accounts/invite:group", "accounts/read"]}>
      <div>Shop</div>
    </PermissionGuard>);
    const accessDeniedComponent = await screen.findByText("You need permission to view this page.");
    expect(accessDeniedComponent).toBeInTheDocument();
  });
});
