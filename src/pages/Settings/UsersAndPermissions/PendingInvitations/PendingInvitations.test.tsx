import "@testing-library/jest-dom";
import { groups, pendingInvitations } from "@mocks/handlers/userAndPermissionHandlers";
import { startCase } from "lodash-es";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import PendingInvitations from ".";


describe("Pending Invitations", () => {
  it("should render Pending Invitations table", async () => {
    renderWithProviders(<PendingInvitations/>);
    await screen.findByText("Pending Invitations");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    pendingInvitations.forEach((invitation) => {
      expect(screen.getByText(invitation.email ?? "--")).toBeInTheDocument();
      expect(screen.getByText(invitation.invitedBy.primaryEmailAddress)).toBeInTheDocument();
      expect(screen.getByText(startCase(invitation.groups[0].name))).toBeInTheDocument();
    });
  });

  it("should successfully invite new user", async () => {
    renderWithProviders(<PendingInvitations/>);
    await screen.findByText("Pending Invitations");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("Invite"));
    expect(screen.getByText("Invite User")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    await waitFor(() => {
      groups.forEach((group) => {
        expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
      });
    });

    const user = userEvent.setup();

    expect(screen.getByText("Send Invite")).toBeDisabled();
    expect(screen.getByText("Invite User")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email Address"), "user");
    await user.tab();
    expect(screen.getByLabelText("Email Address")).toBeInvalid();

    await user.type(screen.getByLabelText("Email Address"), "user@email.org");

    await user.click(screen.getByText("Send Invite"));
    await waitFor(() => {
      expect(screen.queryByText("Invite User")).not.toBeInTheDocument();
    });
  });
});
