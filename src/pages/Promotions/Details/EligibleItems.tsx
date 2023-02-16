import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FieldArray, getIn, useFormikContext } from "formik";
import { useState } from "react";

import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { Promotion } from "types/promotions";
import { isArrayType, useIntrospectSchema } from "@hooks/useIntrospectSchema";
import { FieldProperty, Type } from "types/schema";

import { ConditionField } from "./ConditionField";
import { ConditionOperators } from "./ConditionOperators";

type EligibleItemsProps = {
  inclusionFieldName: string
  exclusionFieldName: string
}

const initialValue = { fact: "item", path: null, value: [], operator: "" };

const filterSchemaFn = (fieldProperty: FieldProperty) =>
  fieldProperty.type !== Type.Array || (isArrayType(fieldProperty) && fieldProperty.items[0].type === Type.String);

export const EligibleItems = ({ inclusionFieldName, exclusionFieldName }: EligibleItemsProps) => {
  const { setFieldValue, values } = useFormikContext<Promotion>();

  const currentInclusionRules = getIn(values, inclusionFieldName);
  const currentExclusionRules = getIn(values, exclusionFieldName);

  const [conditionOperator, setConditionOperator] =
  useState<Record<string, string>>({
    [inclusionFieldName]: currentInclusionRules?.any ? "any" : "all",
    [exclusionFieldName]: currentExclusionRules?.any ? "any" : "all"
  });


  const getFieldNameWithCondition = (name: string) => `${name}.${conditionOperator[name]}`;

  const handleChangeOperator = (name:string, value: string) => {
    const currentValues = getIn(values, getFieldNameWithCondition(name));
    setFieldValue(name, { [value]: currentValues });
    setConditionOperator((current) => ({ ...current, [name]: value }));
  };

  const _inclusionFieldName = getFieldNameWithCondition(inclusionFieldName);
  const _exclusionFieldName = getFieldNameWithCondition(exclusionFieldName);

  const { schemaProperties, isLoading } = useIntrospectSchema({
    schemaName: "CartItem",
    filterFn: filterSchemaFn,
    enabled: !!(getIn(values, _inclusionFieldName)?.length || getIn(values, _exclusionFieldName)?.length)
  });

  return (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle2">Eligible Items</Typography>
      <FieldArray
        name={_inclusionFieldName}
        render={(props) => (
          <Paper sx={{ py: 1, backgroundColor: "grey.100" }}>
            {getIn(props.form.values, _inclusionFieldName, []).length ?
              <Typography variant="subtitle2" sx={{ pl: 5.7 }}>
                Including products based on
                <ConditionOperators
                  value={conditionOperator[inclusionFieldName]}
                  onChange={(event) => handleChangeOperator(inclusionFieldName, String(event.target.value))}
                /> of the following conditions
              </Typography>
              :
              <Typography variant="subtitle2" sx={{ pl: 5.7 }}>Including all products</Typography>
            }
            <FieldArrayRenderer
              {...props}
              addButtonProps={{ children: "Add Condition", sx: { ml: 5.7 } }}
              initialValue={initialValue}
              renderFieldItem={(index) => (
                <ConditionField
                  name={`${_inclusionFieldName}[${index}]`}
                  index={index}
                  operator={conditionOperator[inclusionFieldName]}
                  schemaProperties={schemaProperties}
                  isLoadingSchema={isLoading}
                />
              )}
            />
          </Paper>
        )}
      />

      <FieldArray
        name={_exclusionFieldName}
        render={(props) => (
          <Paper sx={{ py: 1, backgroundColor: "grey.100" }}>
            {getIn(props.form.values, _exclusionFieldName, []).length ?
              <Typography variant="subtitle2" sx={{ pl: 5.7 }}>Excluding products based on
                <ConditionOperators
                  value={conditionOperator[exclusionFieldName]}
                  onChange={(event) => handleChangeOperator(exclusionFieldName, String(event.target.value))}
                /> of the following conditions</Typography>
              : <Typography variant="subtitle2" sx={{ pl: 5.7 }}>Excluding no products</Typography>
            }
            <FieldArrayRenderer
              {...props}
              addButtonProps={{ children: "Add Condition", sx: { ml: 5.7 } }}
              initialValue={initialValue}
              renderFieldItem={(index) => (
                <ConditionField
                  name={`${_exclusionFieldName}[${index}]`}
                  index={index}
                  operator={conditionOperator[exclusionFieldName]}
                  schemaProperties={schemaProperties}
                  isLoadingSchema={isLoading}
                />
              )}
            />
          </Paper>
        )}
      />
    </Stack>
  );
};
