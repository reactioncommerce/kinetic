import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { FulfillmentGroup, ShippingMethod } from "types/shippingMethod";
import { FulfillmentType } from "@graphql/types";

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

export const shippingMethods: ShippingMethod[] = [mockShippingMethods(), mockShippingMethods()];

const getShippingMethodsHandlers = graphql.query("getShippingMethods", (req, res, ctx) =>
  res(ctx.data({ flatRateFulfillmentMethods: { nodes: shippingMethods } })));

const createShippingMethodHandler = graphql.mutation("createFlatRateFulfillmentMethod", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const deleteShippingMethodHandler = graphql.mutation("deleteFlatRateFulfillmentMethodMutation", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});


export const handlers = [getShippingMethodsHandlers, createShippingMethodHandler, deleteShippingMethodHandler];
