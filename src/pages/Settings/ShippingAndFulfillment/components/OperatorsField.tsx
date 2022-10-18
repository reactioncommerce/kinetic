import Stack from "@mui/material/Stack";
import { Field } from "formik";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Operator } from "types/operator";

type OperatorsFieldProps = {
  index: number
}

const operatorLabelsMap = {
  [Operator.eq]: "equals",
  [Operator.gt]: "greater than",
  [Operator.lt]: "less than",
  [Operator.ne]: "not equal to",
  [Operator.match]: "matches",
  [Operator.includes]: "includes"
};

export const OperatorsField = ({ index }: OperatorsFieldProps) => (
  <Stack direction="row" gap={3}>
    <Field
      component={TextField}
      name={`attributes[${index}].property`}
      placeholder="Property"
      ariaLabel="Property"
      hiddenLabel
    />
    <Field
      component={SelectField}
      name={`attributes[${index}].operator`}
      options={Object.values(Operator).map((value) => ({ value, label: operatorLabelsMap[value] }))}
      ariaLabel="Operator"
      hiddenLabel
    />
    <Field
      component={TextField}
      name={`attributes[${index}].value`}
      placeholder="Value"
      ariaLabel="Value"
      hiddenLabel
    />
  </Stack>
);
