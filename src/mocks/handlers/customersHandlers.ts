import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { Customer } from "types/customers";

const date = new Date("2022-02-28");

const customer = (index: number): Customer => {
  const copyDate = new Date(date.getTime());
  copyDate.setDate(copyDate.getDate() + index);
  return {
    _id: faker.datatype.uuid(),
    name: faker.word.noun(),
    userId: faker.datatype.uuid(),
    primaryEmailAddress: faker.internet.email(),
    createdAt: copyDate
  };
};

export const customers = new Array(3).fill(0).map((_, index) => customer(index));


const getCustomersHandler = graphql.query("getCustomers", (req, res, ctx) =>
  res(ctx.data({ customers: { nodes: customers, totalCount: customers.length } })));

export const handlers = [getCustomersHandler];
