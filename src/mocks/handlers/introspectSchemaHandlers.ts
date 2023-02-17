import { graphql } from "msw";

export const mockCartItemSchema = {
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
      },
      parcel: {
        type: "object",
        properties: {
          containers: {
            type: "string",
            path: "$.parcel.containers"
          },
          length: {
            type: "number",
            path: "$.parcel.length"
          }
        },
        required: [],
        additionalProperties: false,
        path: "$.parcel"
      }
    }
  },
  schemaName: "CartItem"
};

export const cartItemProperties = mockCartItemSchema.schema.properties;
const getIntrospectSchemaHandler = graphql.query("getIntrospectSchema", (req, res, ctx) =>
  res(ctx.data({ introspectSchema: mockCartItemSchema })));


export const handlers = [
  getIntrospectSchemaHandler
];
