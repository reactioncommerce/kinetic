import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { EmailTemplate, EmailVariables } from "types/email";

const emailTemplate = (): EmailTemplate => ({
  _id: faker.datatype.uuid(),
  title: faker.random.word(),
  name: faker.word.noun(),
  subject: faker.lorem.sentence(),
  language: "en",
  template: faker.lorem.paragraphs()
});

export const emailVariables: EmailVariables = {
  storefrontAccountProfileUrl: faker.internet.url(),
  storefrontHomeUrl: faker.internet.url(),
  storefrontLoginUrl: faker.internet.url(),
  storefrontOrdersUrl: faker.internet.url(),
  storefrontOrderUrl: faker.internet.url()
};

export const emailTemplates = new Array(3).fill(0).map(() => emailTemplate());

const getEmailTemplatesHandler = graphql.query("getEmailTemplates", (req, res, ctx) =>
  res(ctx.data({ emailTemplates: { nodes: emailTemplates, totalCount: emailTemplates.length } })));

const updateEmailTemplateHandler = graphql.mutation("updateEmailTemplate", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const getEmailVariablesHandler = graphql.query("getEmailVariables", (req, res, ctx) =>
  res(ctx.data({ shop: { storefrontUrls: emailVariables } })));

const updateEmailVariableConfigHandler = graphql.mutation("updateEmailVariables", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

export const handlers = [getEmailTemplatesHandler, updateEmailTemplateHandler, getEmailVariablesHandler, updateEmailVariableConfigHandler];
