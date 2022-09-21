import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { PaymentMethod, ShopSettings, TaxService } from "@graphql/types";

const mockPaymentMethod = (): PaymentMethod => ({
  name: faker.lorem.word(),
  isEnabled: faker.datatype.boolean(),
  pluginName: faker.lorem.word(),
  displayName: faker.lorem.word(),
  canRefund: false
});

const mockTaxService = (): TaxService => ({
  name: faker.lorem.word(),
  pluginName: faker.lorem.word(),
  displayName: faker.lorem.word()
});

export const paymentMethods = [mockPaymentMethod(), mockPaymentMethod(), mockPaymentMethod()];

export const taxServices = [mockTaxService(), mockTaxService()];

export const shopTaxesSetting: Partial<ShopSettings> = {
  primaryTaxServiceName: taxServices[0].name,
  fallbackTaxServiceName: taxServices[1].name
};


const getPaymentMethodsHandler = graphql.query("getPaymentMethods", (req, res, ctx) =>
  res(ctx.data({ paymentMethods })));

const getTaxServicesHandler = graphql.query("getTaxServices", (req, res, ctx) =>
  res(ctx.data({ taxServices })));

const getShopTaxesSettingHandler = graphql.query("getShopTaxesSetting", (req, res, ctx) =>
  res(ctx.data({ shopSettings: shopTaxesSetting })));

const updateTaxServiceHandler = graphql.mutation(
  "updateTaxService",
  (req, res, ctx) => {
    const { input } = req.variables;
    return res(ctx.data({ input }));
  }
);

export const handlers = [
  getPaymentMethodsHandler,
  getTaxServicesHandler,
  getShopTaxesSettingHandler,
  updateTaxServiceHandler
];
