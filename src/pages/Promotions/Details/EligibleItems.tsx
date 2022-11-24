import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FieldArray, useFormikContext } from "formik";
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import { get } from "lodash-es";
import { useState } from "react";

import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { CONDITION_OPERATORS } from "../constants";

import { ConditionField } from "./ConditionField";
import { ConditionOperators } from "./ConditionOperators";

type EligibleItemsProps = {
  inclusionFieldName: string
  exclusionFieldName: string
}

export const EligibleItems = ({ inclusionFieldName, exclusionFieldName }: EligibleItemsProps) => {
  const { setFieldValue, values } = useFormikContext();

  const currentInclusionRules = get(values, inclusionFieldName);
  const currentExclusionRules = get(values, exclusionFieldName);

  const [conditionOperator, setConditionOperator] =
  useState<Record<string, string>>({
    [inclusionFieldName]: currentInclusionRules?.any ? "any" : "all",
    [exclusionFieldName]: currentExclusionRules?.any ? "any" : "all"
  });


  const getFieldNameWithCondition = (name: string) => `${name}.${conditionOperator[name]}`;

  const handleChangeOperator = (name:string, value: string) => {
    const currentValues = get(values, getFieldNameWithCondition(name));
    setFieldValue(name, { [value]: currentValues });
    setConditionOperator((current) => ({ ...current, [name]: value }));
  };

  const _inclusionFieldName = getFieldNameWithCondition(inclusionFieldName);
  const _exclusionFieldName = getFieldNameWithCondition(exclusionFieldName);

  return (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle2">Eligible Items</Typography>
      <FieldArray
        name={_inclusionFieldName}
        render={(props) => (
          <Paper sx={{ py: 1, backgroundColor: "grey.100" }}>
            {get(props.form.values, _inclusionFieldName, []).length ?
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
              initialValue={{ fact: "item", path: "", value: [], operator: "" }}
              renderFieldItem={(index) => (
                <Stack direction="row" gap={1} alignItems="center" pl={1}>
                  <Stack flexBasis="30px">
                    {index > 0 ? <Typography color="grey.700" variant="caption">
                      {CONDITION_OPERATORS[conditionOperator[inclusionFieldName]]?.fieldPrefix?.toUpperCase()}
                    </Typography> : null}
                  </Stack>

                  <ConditionField name={`${_inclusionFieldName}[${index}]`} />
                </Stack>
              )}
            />
          </Paper>
        )}
      />

      <FieldArray
        name={_exclusionFieldName}
        render={(props) => (
          <Paper sx={{ py: 1, backgroundColor: "grey.100" }}>
            {get(props.form.values, _exclusionFieldName, []).length ?
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
              initialValue={{ fact: "item", path: "", value: [], operator: "" }}
              renderFieldItem={(index) => (
                <Stack direction="row" gap={1} alignItems="center" pl={1}>
                  <Stack flexBasis="30px">
                    {index > 0 ? <Typography color="grey.700" variant="caption">
                      {CONDITION_OPERATORS[conditionOperator[exclusionFieldName]]?.fieldPrefix?.toUpperCase()}
                    </Typography> : null}
                  </Stack>

                  <ConditionField name={`${_exclusionFieldName}[${index}]`} />
                </Stack>
              )}
            />
          </Paper>
        )}
      />
    </Stack>
  );
};
