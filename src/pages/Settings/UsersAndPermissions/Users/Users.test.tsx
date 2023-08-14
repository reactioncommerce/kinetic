import "@testing-library/jest-dom";
import { groups, users } from "@mocks/handlers/userAndPermissionHandlers";
import { startCase } from "lodash-es";

import { cleanup, fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import Users from ".";


describe("Users", () => {
  afterEach(cleanup);

  it("should render Users table", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"), { timeout: 3000 });

    users.forEach((user) => {
      expect(screen.getByText(user.name ?? "--")).toBeInTheDocument();
      expect(screen.getByText(user.primaryEmailAddress)).toBeInTheDocument();
      expect(screen.getByText(startCase(user.groups.nodes[0].name))).toBeInTheDocument();
    });
  });

  it("should successfully invite new user", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"), { timeout: 3000 });

    fireEvent.click(screen.getByText("Invite"));
    expect(screen.getByText("Invite User")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    groups.forEach((group) => {
      expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
    });

    const user = userEvent.setup();

    expect(screen.getByText("Invite User")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Name"), "user");
    await user.click(screen.getByText("Send Invite"));

    expect(screen.getByLabelText("Email Address")).toBeInvalid();
    expect(screen.getByLabelText("Allow access to admin UI")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email Address"), "user@email.org");

    await user.click(screen.getByText("Send Invite"));
    await waitFor(() => {
      expect(screen.queryByText("Invite User")).not.toBeInTheDocument();
    });
  });

  it("should successfully update user group", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"), { timeout: 3000 });

    fireEvent.click(screen.getByText(users[0].name));
    expect(screen.getByText("Edit User")).toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    await waitFor(() => {
      groups.forEach((group) => {
        expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
      });
    });

    expect(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: `${startCase(users[0].groups.nodes[0].name)} ${users[0].groups.nodes[0].description}` }))
      .toBeChecked();

    const user = userEvent.setup();

    await user.click(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: `${startCase(groups[1].name)} ${groups[1].description}` }));

    expect(within(screen.getByRole("radiogroup"))
      .getByRole("radio", { name: `${startCase(groups[1].name)} ${groups[1].description}` }))
      .toBeChecked();
    expect(screen.getByLabelText("Email Address")).toBeDisabled();
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.queryByLabelText("Allow access to admin UI")).toBeDisabled();

    await user.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
    });
  });

  it.skip("should successfully send reset password email", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"), { timeout: 3000 });

    fireEvent.click(screen.getAllByLabelText("more")[0]);
    expect(screen.getByText("Send Password Reset")).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(screen.getAllByLabelText("more")[0]);
    await user.click(screen.getByText("Send Password Reset"));

    expect(screen.queryByText("Send Password Reset")).not.toBeInTheDocument();
    expect(screen.getByText("Reset password email has been sent successfully")).toBeInTheDocument();
  });
});

