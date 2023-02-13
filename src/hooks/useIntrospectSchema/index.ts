import { startCase } from "lodash-es";

import { useGetIntrospectSchemaQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { FieldProperty, SchemaProperties } from "types/schema";

const normalizeSchemaProperties = (schemaProperties: SchemaProperties, filterFn?: (property: FieldProperty) => boolean) => {
  const normalizedResults = Object.entries(schemaProperties).map(([field, property]) => ({ label: startCase(field), value: property.path, ...property }));

  return filterFn ? normalizedResults.filter(filterFn) : normalizedResults;
};

export const useIntrospectSchema = ({ schemaName, filterFn }:{schemaName: string, filterFn?: (property: FieldProperty) => boolean}) => {
  const { data, isLoading } = useGetIntrospectSchemaQuery(client, { schemaName });
  const schemaProperties: SchemaProperties = data?.introspectSchema.schema.properties;

  return { schemaProperties: schemaProperties ? normalizeSchemaProperties(schemaProperties, filterFn) : [], originalSchema: schemaProperties, isLoading };
};
