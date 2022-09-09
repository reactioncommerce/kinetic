import "@testing-library/jest-dom";
import { emailTemplates, emailVariables } from "@mocks/handlers/transactionalEmailHandlers";

import { fireEvent, renderWithProviders, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from "@utils/testUtils";

import EmailTemplates from ".";


describe("Email Templates", () => {
  it("should render email templates table", async () => {
    renderWithProviders(<EmailTemplates/>);
    await screen.findByText("Email Templates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    emailTemplates.forEach((template) => {
      expect(screen.getByText(template.title ?? "")).toBeInTheDocument();
      expect(screen.getByText(template.name ?? "")).toBeInTheDocument();
      expect(screen.getAllByText("en")).toHaveLength(emailTemplates.length);
    });
  });

  it("should update email template successfully", async () => {
    renderWithProviders(<EmailTemplates/>);
    await screen.findByText("Email Templates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText(emailTemplates[0].title ?? ""));
    expect(screen.getByText("Edit Email Template")).toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    expect(within(drawer).getByLabelText("Title")).toHaveValue(emailTemplates[0].title);
    expect(within(drawer).getByLabelText("Name")).toBeDisabled();
    expect(within(drawer).getByLabelText("Language")).toBeDisabled();
    expect(within(drawer).getByLabelText("Subject")).toBeInTheDocument();
    expect(within(drawer).getByLabelText("Template")).toHaveValue(emailTemplates[0].template);

    const user = userEvent.setup();

    await user.clear(within(drawer).getByLabelText("Title"));
    await user.click(screen.getByText("Save Changes"));
    await user.type(within(drawer).getByLabelText("Title"), "New Title");
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Edit Email Template")).not.toBeInTheDocument();
    });
  });

  it("should update email variables configure successfully", async () => {
    renderWithProviders(<EmailTemplates/>);
    await screen.findByText("Email Templates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    fireEvent.click(screen.getByText("Configure"));
    expect(screen.getByText("Configure Email Templates")).toBeInTheDocument();

    const drawer = screen.getByRole("presentation");

    expect(within(drawer).getByLabelText("Homepage URL")).toHaveValue(emailVariables.storefrontHomeUrl);
    expect(within(drawer).getByLabelText("Login URL")).toHaveValue(emailVariables.storefrontLoginUrl);
    expect(within(drawer).getByLabelText("Single Order Page URL")).toHaveValue(emailVariables.storefrontOrderUrl);
    expect(within(drawer).getByLabelText("Orders Page URL")).toHaveValue(emailVariables.storefrontOrdersUrl);
    expect(within(drawer).getByLabelText("Account Profile Page URL")).toHaveValue(emailVariables.storefrontAccountProfileUrl);

    const user = userEvent.setup();

    await user.clear(within(drawer).getByLabelText("Homepage URL"));
    await user.type(within(drawer).getByLabelText("Homepage URL"), "https://slingshotstore.com/");
    await user.clear(within(drawer).getByLabelText("Single Order Page URL"));
    await user.clear(within(drawer).getByLabelText("Account Profile Page URL"));
    await user.type(within(drawer).getByLabelText("Account Profile Page URL"), "fakeUrl");
    await user.tab();
    expect(within(drawer).getByLabelText("Account Profile Page URL")).toBeInvalid();
    await user.clear(within(drawer).getByLabelText("Account Profile Page URL"));

    await user.type(within(drawer).getByLabelText("Homepage URL"), "https://slingshotstore.com/account");

    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText("Configure Email Templates")).not.toBeInTheDocument();
    });
  });
});
