import { startCase } from "lodash-es";
import { useMemo } from "react";

import { SelectOptionType } from "types/common";
import { useGetIntrospectSchemaQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { FieldProperty, SchemaProperties, Type } from "types/schema";

export type FieldPropertySelectOption = SelectOptionType & FieldProperty

export const isObjectType = (fieldProperty: FieldProperty): fieldProperty is FieldProperty<Type.Object> => fieldProperty.type === Type.Object;

export const isArrayType = (fieldProperty: FieldProperty): fieldProperty is FieldProperty<Type.Array> => fieldProperty.type === Type.Array;

const normalizeSchemaProperties = ({ schemaProperties = {}, filterFn, prependFieldName }:
  { schemaProperties?: SchemaProperties,
    filterFn?: (property: FieldPropertySelectOption) => boolean,
    prependFieldName?: string
  }) : FieldPropertySelectOption[] => {
  const normalizedResults = Object.entries(schemaProperties).flatMap(([field, fieldProperty]) => {
    if (isObjectType(fieldProperty) && Object.keys(fieldProperty.properties).length) {
      return normalizeSchemaProperties({ schemaProperties: fieldProperty.properties, filterFn, prependFieldName: field });
    }
    return [{ label: startCase(prependFieldName ? `${prependFieldName} ${field}` : field), value: fieldProperty.path, ...fieldProperty }];
  });

  return filterFn ? normalizedResults.filter(filterFn) : normalizedResults;
};

export const useIntrospectSchema = ({ schemaName, filterFn, enabled }:
  {schemaName: string, filterFn?: (property: FieldProperty) => boolean, enabled: boolean}) => {
  const { data, isLoading } = useGetIntrospectSchemaQuery(client, { schemaName }, { enabled });

  const schemaProperties = useMemo(() => {
    const properties = data?.introspectSchema.schema.properties;
    return normalizeSchemaProperties({ schemaProperties: properties, filterFn });
  }, [data, filterFn]);

  return { schemaProperties, originalSchema: data?.introspectSchema.schema.properties, isLoading };
};
