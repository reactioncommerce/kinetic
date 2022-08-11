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

    const user = userEvent.setup();

    await user.clear(screen.getByLabelText("Name"));

    await user.click(screen.getByText("Save Changes"));
    expect(screen.getByLabelText("Name")).toBeInvalid();
    await user.type(screen.getByLabelText("Name"), "New Group");
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Group")).not.toBeInTheDocument();
    });
  });

  // it("should successfully update user group", async () => {
  //   renderWithProviders(<Users/>);
  //   await screen.findByText("Users");
  //   await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  //   fireEvent.click(screen.getByText(users[0].name));
  //   expect(screen.getByText("Edit User")).toBeInTheDocument();

  //   const drawer = screen.getByRole("presentation");

  //   groups.forEach((group) => {
  //     expect(within(drawer).getByText(startCase(group.name))).toBeInTheDocument();
  //   });


  //   expect(within(screen.getByRole("radiogroup"))
  //     .getByRole("radio", { name: startCase(users[0].groups.nodes[0].name) }))
  //     .toBeChecked();

  //   const user = userEvent.setup();

  //   await user.click(within(screen.getByRole("radiogroup"))
  //     .getByRole("radio", { name: startCase(groups[1].name) }));

  //   expect(within(screen.getByRole("radiogroup"))
  //     .getByRole("radio", { name: startCase(groups[1].name) }))
  //     .toBeChecked();
  //   expect(screen.getByLabelText("Email Address")).toBeDisabled();
  //   expect(screen.getByLabelText("Name")).toBeDisabled();

  //   await user.click(screen.getByText("Save Changes"));
  //   await waitFor(() => {
  //     expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
  //   });
  // });
});
