import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { Account } from "@graphql/types";

const account: Partial<Account> = {
  _id: faker.datatype.uuid(),
  primaryEmailAddress: faker.internet.email(),
  adminUIShops: [
    {
      _id: faker.datatype.uuid(),
      name: faker.company.companyName(),
      language: faker.random.locale(),
      shopType: "primary",
      currency: {
        _id: faker.datatype.uuid(),
        code: faker.datatype.string(),
        format: faker.datatype.string(),
        symbol: faker.datatype.string()
      }
    }
  ]
};

const getViewerHandlers = graphql.query("getViewer", (req, res, ctx) =>
  res(ctx.data({ viewer: account })));

export const handlers = [getViewerHandlers];
