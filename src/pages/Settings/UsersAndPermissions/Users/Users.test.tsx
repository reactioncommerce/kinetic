import "@testing-library/jest-dom";
import { users } from "@mocks/handlers/userAndPermissionHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

import Users from ".";


describe("Users", () => {
  it("should render Users table", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    users.forEach((user) => {
      expect(screen.getByText(user.name ?? "--")).toBeInTheDocument();
      expect(screen.getByText(user.primaryEmailAddress)).toBeInTheDocument();
      expect(screen.getByText(user.groups.nodes[0].name)).toBeInTheDocument();
    });
  });
});
