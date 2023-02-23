import { Route, Routes } from "react-router-dom";
import { account } from "@mocks/handlers/accountHandlers";

import { renderWithProviders, screen, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import { AppLayout } from "./AppLayout";
import { PageLayout } from "./PageLayout";


describe("AppLayout", () => {
  it("should render layout with breadcrumbs", async () => {
    renderWithProviders(<Routes>
      <Route element={<AppLayout/>}>
        <Route path="customers" element={<div>This is customers page</div>} />
      </Route>
    </Routes>, { initialEntries: ["/customers"] });
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));
    const breadcrumbElement = screen.getByLabelText("breadcrumb");
    await waitFor(() => {
      expect(within(breadcrumbElement).getByText(account.adminUIShops?.[0]?.name || "Kinetic")).toBeInTheDocument();
    });
    expect(within(breadcrumbElement).getByText("Customers")).toBeInTheDocument();
  });

  it("should render breadcrumbs with sub headers value if matching breadcrumb item is not provided", async () => {
    renderWithProviders(<Routes>
      <Route element={<AppLayout/>}>
        <Route path="customers" element={<PageLayout headers={[{ key: "general", header: "General", path: "general" }]}/>}>
          <Route path="general" element={<div>This is customers page</div>} />
        </Route>
      </Route>
    </Routes>, { initialEntries: ["/customers/general"] });
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));
    const breadcrumbElement = screen.getByLabelText("breadcrumb");
    await waitFor(() => {
      expect(within(breadcrumbElement).getByText(account.adminUIShops?.[0]?.name || "Kinetic")).toBeInTheDocument();
    });
    expect(within(breadcrumbElement).getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("This is customers page")).toBeInTheDocument();
    const generalItem = await within(screen.getByLabelText("breadcrumb")).findByText("General");
    expect(generalItem).toBeInTheDocument();
  });

  it("should render breadcrumbs with provided title", async () => {
    renderWithProviders(<Routes>
      <Route element={<AppLayout breadcrumbs={(currentBreadcrumbs) => ({ ...currentBreadcrumbs, "/customers": "Customize" })}/>}>
        <Route path="customers" element={<div>This is customers page</div>} />
      </Route>
    </Routes>, { initialEntries: ["/customers"] });
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));
    const breadcrumbElement = screen.getByLabelText("breadcrumb");
    await waitFor(() => {
      expect(within(breadcrumbElement).getByText(account.adminUIShops?.[0]?.name || "Kinetic")).toBeInTheDocument();
    });
    expect(within(breadcrumbElement).queryByText("Customers")).not.toBeInTheDocument();
    expect(within(breadcrumbElement).getByText("Customize")).toBeInTheDocument();
  });
});
