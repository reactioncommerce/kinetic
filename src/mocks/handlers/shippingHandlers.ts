import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { FulfillmentGroup, ShippingMethod } from "types/shippingMethod";
import { FulfillmentType } from "@graphql/types";
import { Surcharge } from "types/surcharges";

const mockShippingMethods = () => ({
  _id: faker.datatype.uuid(),
  fulfillmentTypes: [FulfillmentType.Shipping],
  group: FulfillmentGroup.Ground,
  handling: faker.datatype.float(),
  isEnabled: faker.datatype.boolean(),
  name: faker.random.words(),
  label: faker.random.words(),
  rate: faker.datatype.float()
});

const mockShippingSurcharges = () => ({
  _id: faker.datatype.uuid(),
  amount: {
    amount: faker.datatype.float(),
    currency: {
      _id: faker.datatype.uuid(),
      code: "usd",
      symbol: "$",
      format: ""
    },
    displayAmount: `$${faker.datatype.float()}`
  },
  messagesByLanguage: [{
    content: faker.random.words(),
    language: "en"
  }],
  methodIds: [faker.datatype.uuid(), faker.datatype.uuid()]
});

export const shippingMethods: ShippingMethod[] = [mockShippingMethods(), mockShippingMethods()];

export const shippingSurcharges: Surcharge[] = [mockShippingSurcharges(), mockShippingSurcharges()];

const getShippingMethodsHandlers = graphql.query("getShippingMethods", (req, res, ctx) =>
  res(ctx.data({ flatRateFulfillmentMethods: { nodes: shippingMethods } })));

const getShippingSurchargesHandlers = graphql.query("getShippingSurcharges", (req, res, ctx) =>
  res(ctx.data({ surcharges: { nodes: shippingSurcharges } })));

export const handlers = [getShippingMethodsHandlers, getShippingSurchargesHandlers];
