import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { currencyDefinition } from "@utils/currency";
import { Account } from "@graphql/types";

export const account: Partial<Account> = {
  _id: faker.datatype.uuid(),
  primaryEmailAddress: faker.internet.email(),
  adminUIShops: [
    {
      _id: faker.datatype.uuid(),
      name: faker.company.companyName(),
      shopType: "primary",
      currency: {
        _id: faker.datatype.uuid(),
        code: "USD",
        ...currencyDefinition.USD
      },
      language: "en"
    }
  ],
  groups: {
    nodes: [{
      _id: faker.datatype.uuid(),
      name: "system manager",
      slug: "system-manager",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      permissions: [
        "reaction:legacy:addressValidationRules/create",
        "reaction:legacy:taxRates/create",
        "reaction:legacy:taxRates/update",
        "reaction:legacy:addressValidationRules/update",
        "reaction:legacy:shops/update",
        "reaction:legacy:taxes/update:settings",
        "reaction:legacy:email-templates/update",
        "reaction:legacy:shippingMethods/read",
        "reaction:legacy:shippingMethods/update",
        "reaction:legacy:shippingMethods/create",
        "reaction:legacy:shippingMethods/delete",
        "reaction:legacy:shippingRestrictions/update",
        "reaction:legacy:shippingRestrictions/create",
        "reaction:legacy:shippingRestrictions/delete",
        "reaction:legacy:surcharges/update",
        "reaction:legacy:surcharges/create",
        "reaction:legacy:surcharges/delete",
        "reaction:legacy:groups/update",
        "reaction:legacy:accounts/invite:group",
        "reaction:legacy:promotions/update",
        "reaction:legacy:promotions/create"
      ]
    }],
    totalCount: 1,
    pageInfo: { hasNextPage: false, hasPreviousPage: false }
  }
};

const getViewerHandlers = graphql.query("getViewer", (req, res, ctx) =>
  res(ctx.data({ viewer: account })));

export const handlers = [getViewerHandlers];
