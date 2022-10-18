import { faker } from "@faker-js/faker";
import { graphql } from "msw";

import { currencyDefinition } from "@utils/currency";
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
    code: "USD",
    ...currencyDefinition.USD
  },
  language: "en",
  shopLogoUrls: {
    primaryShopLogoUrl: faker.internet.url()
  },
  baseUOL: "ft",
  baseUOM: "lb",
  unitsOfLength:
  [{ default: true, label: "Inches", uol: "in" }, { default: null, label: "Centimeters", uol: "cm" }, { default: null, label: "Feet", uol: "ft" }],
  unitsOfMeasure:
   [
     { default: true, label: "Ounces", uom: "oz" },
     { default: null, label: "Pounds", uom: "lb" },
     { default: null, label: "Grams", uom: "g" },
     { default: null, label: "Kilograms", uom: "kg" }
   ],
  timezone: "Asia/Barnaul",
  addressBook: [{
    address1: faker.address.street(),
    fullName: faker.random.words(),
    postal: faker.address.zipCode(),
    city: faker.address.city(),
    country: "US",
    isCommercial: false,
    phone: faker.phone.number(),
    region: "CT"
  }],
  allowGuestCheckout: true
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
