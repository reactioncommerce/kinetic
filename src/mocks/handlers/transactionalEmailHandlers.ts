import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { EmailTemplate } from "types/email";

const emailTemplate = (): EmailTemplate => ({
  _id: faker.datatype.uuid(),
  title: faker.random.word(),
  name: faker.word.noun(),
  subject: faker.lorem.sentence(),
  language: "en",
  template: faker.lorem.paragraphs()
});

export const emailTemplates = new Array(3).fill(0).map(() => emailTemplate());

const getEmailTemplatesHandler = graphql.query("getEmailTemplates", (req, res, ctx) =>
  res(ctx.data({ emailTemplates: { nodes: emailTemplates, totalCount: emailTemplates.length } })));

const updateEmailTemplateHandler = graphql.mutation("updateEmailTemplate", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

export const handlers = [getEmailTemplatesHandler, updateEmailTemplateHandler];
