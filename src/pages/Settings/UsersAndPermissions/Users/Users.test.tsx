import "@testing-library/jest-dom";
import { groups, users } from "@mocks/handlers/userAndPermissionHandlers";
import { startCase } from "lodash-es";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import Users from ".";


describe("Users", () => {
  it("should render Users table", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    users.forEach((user) => {
      expect(screen.getByText(user.name ?? "--")).toBeInTheDocument();
      expect(screen.getByText(user.primaryEmailAddress)).toBeInTheDocument();
      expect(screen.getByText(startCase(user.groups.nodes[0].name))).toBeInTheDocument();
    });
  });

  it("should successfully invite new user", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("Invite"));
    expect(screen.getByText("Invite User")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    groups.forEach((group) => {
      expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
    });

    const user = userEvent.setup();

    await user.click(screen.getByText("Send Invite"));
    expect(screen.getByText("Invite User")).toBeInTheDocument();

    expect(screen.getByLabelText("Email Address")).toBeInvalid();

    await user.type(screen.getByLabelText("Email Address"), "user@email.org");

    await user.click(screen.getByText("Send Invite"));
    await waitFor(() => {
      expect(screen.queryByText("Invite User")).not.toBeInTheDocument();
    });
  });

  it("should successfully update user group", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText(users[0].name));
    expect(screen.getByText("Edit User")).toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    groups.forEach((group) => {
      expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
    });


    expect(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: startCase(users[0].groups.nodes[0].name) }))
      .toBeChecked();

    const user = userEvent.setup();

    await user.click(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: startCase(groups[1].name) }));

    expect(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: startCase(groups[1].name) }))
      .toBeChecked();
    expect(screen.getByLabelText("Email Address")).toBeDisabled();
    expect(screen.getByLabelText("Name")).toBeDisabled();

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
    });
  });
});
