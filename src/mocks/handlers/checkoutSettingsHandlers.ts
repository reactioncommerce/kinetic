import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { AddressValidationRule,
  AddressValidationService,
  PaymentMethod,
  ShopSettings,
  TaxCode,
  TaxRate,
  TaxService,
  TaxSource }
  from "@graphql/types";

const mockPaymentMethod = (isEnabled: boolean): PaymentMethod => ({
  name: faker.lorem.word(),
  isEnabled,
  pluginName: faker.lorem.words(),
  displayName: faker.lorem.words(),
  canRefund: false
});

const mockTaxService = (): TaxService => ({
  name: faker.lorem.word(),
  pluginName: faker.lorem.word(),
  displayName: faker.lorem.word()
});

const mockTaxCode = (): TaxCode => ({
  label: faker.datatype.string(),
  code: faker.datatype.string()
});

const mockTaxRate = (sourceType: TaxSource, taxCode?: TaxCode): Omit<TaxRate, "shop"> => ({
  _id: faker.datatype.uuid(),
  rate: faker.datatype.float({ max: 100 }),
  sourcing: sourceType,
  taxCode: taxCode?.code
});

export const taxCodes = [mockTaxCode(), mockTaxCode()];

export const taxRates = [
  mockTaxRate(TaxSource.Destination, taxCodes[0]),
  mockTaxRate(TaxSource.Origin, taxCodes[1]),
  { ...mockTaxRate(TaxSource.Origin), country: "US", postal: "1234" }];

const mockAddressValidationService = (): AddressValidationService => ({
  name: faker.lorem.word(),
  displayName: faker.lorem.words(),
  supportedCountryCodes: ["VN", "US", "CA"]
});

const mockAddressValidationRules = (serviceName: string, countryCodes?: string[]): AddressValidationRule => ({
  _id: faker.datatype.uuid(),
  createdAt: faker.date.recent(),
  serviceName,
  shopId: faker.datatype.uuid(),
  updatedAt: faker.date.recent(),
  countryCodes
});

export const paymentMethods = [mockPaymentMethod(true), mockPaymentMethod(true), mockPaymentMethod(false)];

export const taxServices = [mockTaxService(), mockTaxService()];

export const addressValidationServices = [mockAddressValidationService(), mockAddressValidationService(), mockAddressValidationService()];

export const addressValidationRules =
[mockAddressValidationRules(addressValidationServices[0].name, ["CA"]), mockAddressValidationRules(addressValidationServices[1].name, ["US"])];

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

const getTaxRatesHandler = graphql.query("getTaxRates", (req, res, ctx) =>
  res(ctx.data({ taxRates: { nodes: taxRates, totalCount: taxRates.length } })));

const getTaxCodesHandler = graphql.query("getTaxCodes", (req, res, ctx) =>
  res(ctx.data({ taxCodes })));


const updateTaxRateHandler = graphql.mutation(
  "updateTaxRate",
  (req, res, ctx) => res(ctx.data({ input: req.variables.input }))
);

const createTaxRateHandler = graphql.mutation(
  "createTaxRate",
  (req, res, ctx) => res(ctx.data({ input: req.variables.input }))
);

const deleteTaxRateHandler = graphql.mutation(
  "deleteTaxRate",
  (req, res, ctx) => res(ctx.data({ input: req.variables.input }))
);


const getAddressValidationServicesHandler = graphql.query("getAddressValidationService", (req, res, ctx) =>
  res(ctx.data({ addressValidationServices })));

const getAddressValidationRulesHandler = graphql.query("getAddressValidationRules", (req, res, ctx) =>
  res(ctx.data({ addressValidationRules: { nodes: addressValidationRules, totalCount: addressValidationRules.length } })));

const updateValidationRuleHandler = graphql.mutation(
  "updateAddressValidationRule",
  (req, res, ctx) => {
    const { input } = req.variables;
    return res(ctx.data({ input }));
  }
);

const createValidationRuleHandler = graphql.mutation(
  "createAddressValidationRule",
  (req, res, ctx) => {
    const { input } = req.variables;
    return res(ctx.data({ input }));
  }
);


export const handlers = [
  getPaymentMethodsHandler,
  getTaxServicesHandler,
  getShopTaxesSettingHandler,
  updateTaxServiceHandler,
  getTaxRatesHandler,
  getTaxCodesHandler,
  updateTaxRateHandler,
  createTaxRateHandler,
  deleteTaxRateHandler,
  getAddressValidationServicesHandler,
  getAddressValidationRulesHandler,
  updateValidationRuleHandler,
  createValidationRuleHandler
];
