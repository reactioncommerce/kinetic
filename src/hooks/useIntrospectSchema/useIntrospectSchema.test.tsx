import { QueryClient, QueryClientProvider } from "react-query";
import { cartItemProperties } from "@mocks/handlers/introspectSchemaHandlers";

import { renderHook, waitFor } from "@utils/testUtils";

import { useIntrospectSchema } from ".";

const client = new QueryClient();
const wrapper = ({ children }: {children: JSX.Element}) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

describe("useIntrospectSchema", () => {
  it("should return normalize schema data", async () => {
    const { result } = renderHook(() => useIntrospectSchema({ schemaName: "CartItem", enabled: true }), { wrapper });
    await waitFor(() => {
      expect(result.current.schemaProperties).toEqual([
        { label: "Product Id", value: "$.productId", ...cartItemProperties.productId },
        { label: "Price Type", value: "$.priceType", ...cartItemProperties.priceType },
        { label: "Product Tag Ids", value: "$.productTagIds", ...cartItemProperties.productTagIds },
        { label: "Parcel Containers", value: "$.parcel.containers", ...cartItemProperties.parcel.properties.containers },
        { label: "Parcel Length", value: "$.parcel.length", ...cartItemProperties.parcel.properties.length },
        { label: "Attributes Label", value: "$.attributes.[0].label", ...cartItemProperties.attributes.items[0].properties.label },
        { label: "Attributes Value", value: "$.attributes.[0].value", ...cartItemProperties.attributes.items[0].properties.value }
      ]);
    });
  });
});
