import { graphql } from "msw";

const mockCartItemSchema = {
  schema: {
    properties: {
      productId: {
        type: "string",
        path: "$.productId"
      },
      priceType: {
        type: "string",
        enum: [
          "full",
          "clearance",
          "sale"
        ],
        path: "$.priceType"
      },
      productTagIds: {
        type: "array",
        items: [
          {
            type: "string",
            path: "$.productTagIds.[0]"
          }
        ],
        additionalItems: false,
        path: "$.productTagIds"
      }
    }
  },
  schemaName: "CartItem"
};

const getIntrospectSchemaHandler = graphql.query("getIntrospectSchema", (req, res, ctx) =>
  res(ctx.data({ introspectSchema: mockCartItemSchema })));


export const handlers = [
  getIntrospectSchemaHandler
];
