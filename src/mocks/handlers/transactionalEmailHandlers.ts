import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { EmailTemplate } from "types/email";

const emailTemplate = (): EmailTemplate => ({
  _id: faker.datatype.uuid(),
  title: faker.random.word(),
  name: faker.word.noun(),
  subject: faker.lorem.sentence(),
  language: "en"
});

export const emailTemplates = new Array(3).fill(0).map(() => emailTemplate());
const getEmailTemplatesHandler = graphql.query("getEmailTemplates", (req, res, ctx) =>
  res(ctx.data({ emailTemplates: { nodes: emailTemplates, totalCount: emailTemplates.length } })));

export const handlers = [getEmailTemplatesHandler];
