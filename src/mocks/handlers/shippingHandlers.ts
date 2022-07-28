import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { FulfillmentGroup, ShippingMethod } from "types/shippingMethod";
import { FulfillmentType, RestrictionTypeEnum } from "@graphql/types";
import { Surcharge } from "types/surcharges";
import { ShippingRestriction } from "types/shippingRestrictions";


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

const mockShippingSurcharges = (methodIds?: string[]) => ({
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
  methodIds: methodIds ?? [faker.datatype.uuid(), faker.datatype.uuid()]
});

const mockShippingRestrictions = (methodIds?: string[]) => ({
  attributes: [{
    property: "price",
    operator: "eq",
    value: faker.datatype.float().toString(),
    propertyType: "string"
  }],
  _id: faker.datatype.uuid(),
  type: RestrictionTypeEnum.Allow,
  methodIds: methodIds ?? [faker.datatype.uuid(), faker.datatype.uuid()]
});

export const shippingMethods: ShippingMethod[] = [mockShippingMethods(), mockShippingMethods()];

export const shippingSurcharges: Surcharge[] = [mockShippingSurcharges(shippingMethods.map(({ _id }) => _id))];
export const shippingRestrictions: ShippingRestriction[] =
[mockShippingRestrictions(shippingMethods.map(({ _id }) => _id)), { ...mockShippingRestrictions(), type: RestrictionTypeEnum.Deny, attributes: [] }];

const getShippingMethodsHandlers = graphql.query("getShippingMethods", (req, res, ctx) =>
  res(ctx.data({ flatRateFulfillmentMethods: { nodes: shippingMethods } })));

const getShippingSurchargesHandlers = graphql.query("getShippingSurcharges", (req, res, ctx) =>
  res(ctx.data({ surcharges: { nodes: shippingSurcharges } })));

const createShippingMethodHandler = graphql.mutation("createFlatRateFulfillmentMethod", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const deleteShippingMethodHandler = graphql.mutation("deleteFlatRateFulfillmentMethodMutation", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});


const createShippingSurchargeHandler = graphql.mutation("createShippingSurcharge", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const deleteShippingSurchargeHandler = graphql.mutation("deleteShippingSurcharge", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const getShippingRestrictionsHandlers = graphql.query("getShippingRestrictions", (req, res, ctx) =>
  res(ctx.data({ getFlatRateFulfillmentRestrictions: { nodes: shippingRestrictions } })));

const createShippingRestrictionHandler = graphql.mutation("createShippingRestriction", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const deleteShippingRestrictionHandler = graphql.mutation("deleteShippingRestriction", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

export const handlers = [
  getShippingMethodsHandlers,
  getShippingSurchargesHandlers,
  createShippingMethodHandler,
  deleteShippingMethodHandler,
  createShippingSurchargeHandler,
  deleteShippingSurchargeHandler,
  createShippingRestrictionHandler,
  deleteShippingRestrictionHandler,
  getShippingRestrictionsHandlers
];
