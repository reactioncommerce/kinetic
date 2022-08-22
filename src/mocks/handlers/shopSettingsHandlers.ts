import { faker } from "@faker-js/faker";
import { graphql } from "msw";

import { Shop } from "types/shop";

const mockShop = (): Shop => ({
  _id: faker.datatype.uuid(),
  name: faker.random.word(),
  description: faker.random.words(),
  emails: [{
    address: faker.internet.email()
  }],
  storefrontUrls: {
    storefrontHomeUrl: faker.internet.url()
  },
  currency: {
    _id: faker.datatype.uuid(),
    code: faker.finance.currencyCode(),
    symbol: faker.finance.currencySymbol(),
    format: faker.finance.currencyName()
  },
  language: "en",
  shopLogoUrls: {
    primaryShopLogoUrl: faker.internet.url()
  },
  addressBook: [{
    address1: faker.address.street(),
    fullName: faker.random.words(),
    postal: faker.address.zipCode(),
    city: faker.address.city(),
    country: "VN",
    isCommercial: false,
    phone: faker.phone.number(),
    region: faker.address.state()
  }]
});


export const shop: Shop = mockShop();

const getShopHandler = graphql.query("getShop", (req, res, ctx) => res(ctx.data({ shop })));

const updateShopHandler = graphql.mutation("updateShop", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

export const handlers = [
  getShopHandler,
  updateShopHandler
];
