import { fireEvent, renderWithProviders, screen, userEvent, waitForElementToBeRemoved } from "@utils/testUtils";

import Users from ".";

describe("Users Reset Password", () => {
  it("should successfully send reset password email", async () => {
    renderWithProviders(<Users/>);
    await screen.findByText("Users");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getAllByLabelText("more")[0]);
    const user = userEvent.setup();

    expect(screen.getByText("Send Password Reset")).toBeInTheDocument();

    await user.click(screen.getByText("Send Password Reset"));

    expect(screen.queryByText("Send Password Reset")).not.toBeInTheDocument();
    expect(screen.getByText("Reset password email has been sent successfully")).toBeInTheDocument();
  });
});
