import Stack from "@mui/material/Stack";
import { Field } from "formik";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Operator } from "types/operator";

export const OperatorsField = ({ index }:{index: number}) => (
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
      options={Object.values(Operator).map((value) => ({ value, label: value }))}
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
