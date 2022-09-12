import "@testing-library/jest-dom";
import { emailLogs } from "@mocks/handlers/transactionalEmailHandlers";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";
import { formatDateTime } from "@utils/common";

import EmailLogs from ".";


describe("Email Logs", () => {
  it("should render email logs table", async () => {
    renderWithProviders(<EmailLogs/>);
    await screen.findByText("Email Logs");
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

    emailLogs.forEach((emailLog) => {
      expect(screen.getByText(emailLog.data.to)).toBeInTheDocument();
      expect(screen.getByText(emailLog.data.subject)).toBeInTheDocument();
      expect(screen.getByText(formatDateTime(emailLog.updated))).toBeInTheDocument();
    });

    const totalCompletedEmailLogs = emailLogs.filter(({ status }) => status === "completed").length;

    expect(screen.getAllByText("SENT")).toHaveLength(totalCompletedEmailLogs);
  });
});
