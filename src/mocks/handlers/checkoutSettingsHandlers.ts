import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { PaymentMethod } from "@graphql/types";

const mockPaymentMethod = (): PaymentMethod => ({
  name: faker.lorem.word(),
  isEnabled: faker.datatype.boolean(),
  pluginName: faker.lorem.word(),
  displayName: faker.lorem.word(),
  canRefund: false
});

export const paymentMethods = [mockPaymentMethod(), mockPaymentMethod(), mockPaymentMethod()];

const getPaymentMethodsHandler = graphql.query("getPaymentMethods", (req, res, ctx) =>
  res(ctx.data({ paymentMethods })));

export const handlers = [
  getPaymentMethodsHandler
];
