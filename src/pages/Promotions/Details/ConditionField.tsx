import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import { SelectField } from "@components/SelectField";
import { CONDITION_OPERATORS, CONDITION_PROPERTIES_OPTIONS, OPERATOR_OPTIONS } from "../constants";
import { InputWithLabel } from "@components/TextField";
import { AutocompleteField } from "@components/AutocompleteField";

type ConditionFieldProps = {
  name: string
  index: number
  operator: string
}

export const ConditionField = memo(({ name, index, operator }: ConditionFieldProps) =>
  (
    <Stack direction="row" gap={1} alignItems="center" pl={1}>
      <Stack flexBasis="30px">
        {index > 0 ? <Typography color="grey.700" variant="caption">
          {CONDITION_OPERATORS[operator]?.fieldPrefix?.toUpperCase()}
        </Typography> : null}
      </Stack>
      <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 } }} flexGrow={1}>
        <FastField
          component={SelectField}
          name={`${name}.path`}
          placeholder="Property"
          ariaLabel="Property"
          hiddenLabel
          options={CONDITION_PROPERTIES_OPTIONS}
          displayEmpty
        />
        <FastField
          component={SelectField}
          name={`${name}.operator`}
          options={OPERATOR_OPTIONS}
          ariaLabel="Operator"
          hiddenLabel
          placeholder="Operator"
          displayEmpty
        />
        <FastField
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
    </Stack>
  ));

