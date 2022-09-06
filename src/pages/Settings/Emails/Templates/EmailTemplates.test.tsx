import "@testing-library/jest-dom";
import { emailTemplates } from "@mocks/handlers/transactionalEmailHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";

import EmailTemplates from ".";


describe("Email Templates", () => {
  it("should render email templates table", async () => {
    renderWithProviders(<EmailTemplates/>);
    await screen.findByText("Email Templates");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    emailTemplates.forEach((template) => {
      expect(screen.getByText(template.title ?? "")).toBeInTheDocument();
      expect(screen.getByText(template.name ?? "")).toBeInTheDocument();
      expect(screen.getByText(template.subject ?? "")).toBeInTheDocument();
      expect(screen.getAllByText("en")).toHaveLength(emailTemplates.length);
    });
  });
});
