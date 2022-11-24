import Stack from "@mui/material/Stack";
import { Field } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { SelectField } from "@components/SelectField";
import { CONDITION_PROPERTIES_OPTIONS, OPERATOR_OPTIONS } from "../constants";
import { InputWithLabel } from "@components/TextField";
import { AutocompleteField } from "@components/AutocompleteField";

type ConditionFieldProps = {
  name: string
}


export const ConditionField = ({ name }:ConditionFieldProps) =>
  (
    <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 } }} flexGrow={1}>
      <Field
        component={SelectField}
        name={`${name}.path`}
        placeholder="Property"
        ariaLabel="Property"
        hiddenLabel
        options={CONDITION_PROPERTIES_OPTIONS}
        displayEmpty
      />
      <Field
        component={SelectField}
        name={`${name}.operator`}
        options={OPERATOR_OPTIONS}
        ariaLabel="Operator"
        hiddenLabel
        placeholder="Operator"
        displayEmpty
      />
      <Field
        component={AutocompleteField}
        name={`${name}.value`}
        freeSolo
        multiple
        options={[]}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <InputWithLabel
            {...params}
            name="value"
            placeholder="Value"
            hiddenLabel
          />
        )}
      />
    </Stack>
  )
;

