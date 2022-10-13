import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { GetViewerQuery } from "@graphql/generates";

const account: GetViewerQuery["viewer"] = {
  _id: faker.datatype.uuid(),
  primaryEmailAddress: faker.internet.email(),
  adminUIShops: [
    {
      _id: faker.datatype.uuid(),
      name: faker.company.companyName(),
      shopType: "primary"
    }
  ],
  groups: {
    nodes: [{
      _id: faker.datatype.uuid(),
      name: "system manager",
      permissions: [
        "reaction:legacy:addressValidationRules/create",
        "reaction:legacy:taxRates/create",
        "reaction:legacy:taxRates/update",
        "reaction:legacy:addressValidationRules/update",
        "reaction:legacy:shops/update",
        "reaction:legacy:taxes/update",
        "reaction:legacy:email-templates/update",
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
        "reaction:legacy:accounts/invite:group"
      ]
    }]
  }
};

const getViewerHandlers = graphql.query("getViewer", (req, res, ctx) =>
  res(ctx.data({ viewer: account })));

export const handlers = [getViewerHandlers];
