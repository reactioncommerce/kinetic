import "@testing-library/jest-dom";
import { groups } from "@mocks/handlers/userAndPermissionHandlers";
import { startCase } from "lodash-es";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import Groups from ".";


describe("Groups", () => {
  it("should render Groups table", async () => {
    renderWithProviders(<Groups/>);
    await screen.findByText("Groups");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    groups.forEach((group) => {
      expect(screen.getByText(startCase(group.name))).toBeInTheDocument();
    });
  });

  it("should successfully update a group", async () => {
    renderWithProviders(<Groups/>);
    await screen.findByText("Groups");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText(startCase(groups[0].name)));
    expect(screen.getByText("Edit Group")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    expect(within(drawer).getByRole("textbox", { name: "Name" })).toHaveValue(groups[0].name);

    expect(within(drawer).getByLabelText("Add Address Books")).toBeChecked();
    const inviteGroupCheckbox = await within(drawer).findByText("Invite Group");
    expect(inviteGroupCheckbox).not.toBeChecked();

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Search for resources"), "Emails");
    expect(screen.getByText("Emails")).not.toBeChecked();
    await user.click(screen.getByText("Emails"));
    expect(screen.getByText("(1 of 1 selected)")).toBeInTheDocument();
    expect(screen.queryByText("Accounts")).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("Name"));

    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByLabelText("Name")).toBeInvalid();
    await user.type(screen.getByLabelText("Name"), "New Group");
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Group")).not.toBeInTheDocument();
    });
  });
});
