import { startCase } from "lodash-es";

import { SelectOptionType } from "types/common";
import { useGetIntrospectSchemaQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { FieldProperty, SchemaProperties, Type } from "types/schema";

type MergedOptionType = SelectOptionType & FieldProperty

const normalizeSchemaProperties = ({ schemaProperties, filterFn, prependFieldName }:
  { schemaProperties: SchemaProperties,
    filterFn?: (property: MergedOptionType) => boolean,
    prependFieldName?: string
  }) : MergedOptionType[] => {
  const normalizedResults = Object.entries(schemaProperties).flatMap(([field, property]) => {
    if (property.type === Type.Object && Object.keys((property as FieldProperty<Type.Object>).properties).length) {
      const objectNestedProperties = property.properties as SchemaProperties;
      return normalizeSchemaProperties({ schemaProperties: objectNestedProperties, filterFn, prependFieldName: field });
    }
    return [{ label: startCase(prependFieldName ? `${prependFieldName} ${field}` : field), value: property.path, ...property }];
  });

  return filterFn ? normalizedResults.filter(filterFn) : normalizedResults;
};

export const useIntrospectSchema = ({ schemaName, filterFn }:{schemaName: string, filterFn?: (property: FieldProperty) => boolean}) => {
  const { data, isLoading } = useGetIntrospectSchemaQuery(client, { schemaName });
  const schemaProperties: SchemaProperties = data?.introspectSchema.schema.properties;

  return { schemaProperties: schemaProperties ? normalizeSchemaProperties({ schemaProperties, filterFn }) : [], originalSchema: schemaProperties, isLoading };
};
