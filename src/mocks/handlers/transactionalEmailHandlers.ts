import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { EmailLog, EmailTemplate } from "types/email";

const emailTemplate = (): EmailTemplate => ({
  _id: faker.datatype.uuid(),
  title: faker.random.word(),
  name: faker.word.noun(),
  subject: faker.lorem.sentence(),
  language: "en",
  template: faker.lorem.paragraphs()
});

export const emailTemplates = new Array(3).fill(0).map(() => emailTemplate());

const emailLog = (status: string): EmailLog => ({
  _id: faker.datatype.uuid(),
  status,
  updated: faker.date.recent(),
  data: {
    subject: faker.lorem.sentence(),
    to: faker.internet.email()
  }
}
);

export const emailLogs = new Array(3).fill(0).map((_, index) => emailLog(index % 2 !== 0 ? "failed" : "completed"));

const getEmailTemplatesHandler = graphql.query("getEmailTemplates", (req, res, ctx) =>
  res(ctx.data({ emailTemplates: { nodes: emailTemplates, totalCount: emailTemplates.length } })));

const updateEmailTemplateHandler = graphql.mutation("updateEmailTemplate", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const getEmailLogsHandler = graphql.query("getEmailLogs", (req, res, ctx) =>
  res(ctx.data({ emailJobs: { nodes: emailLogs, totalCount: emailLogs.length } })));

export const handlers = [getEmailTemplatesHandler, updateEmailTemplateHandler, getEmailLogsHandler];
