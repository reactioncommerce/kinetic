import Stack from "@mui/material/Stack";
import { FastField, Field, useFormikContext } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { memo, SyntheticEvent } from "react";

import { SelectField } from "@components/SelectField";
import { CONDITION_OPERATORS, OPERATOR_OPTIONS } from "../constants";
import { InputWithLabel } from "@components/TextField";
import { AutocompleteField } from "@components/AutocompleteField";
import { useIntrospectSchema } from "@hooks/useIntrospectSchema";
import { Type } from "types/schema";
import { Promotion } from "types/promotions";
import { SelectOptionType } from "types/common";

type ConditionFieldProps = {
  name: string
  index: number
  operator: string
}

export const ConditionField = memo(({ name, index, operator }: ConditionFieldProps) => {
  const { schemaProperties, isLoading } = useIntrospectSchema({ schemaName: "CartItem", filterFn: ({ type }) => type !== Type.Array });
  const { setFieldValue } = useFormikContext<Promotion>();
  const onPathChange = (_: SyntheticEvent, selectedOption: SelectOptionType | null) => {
    setFieldValue(`${name}.path`, selectedOption ? selectedOption.value : null);
  };

  const getOptionLabel = (optionValue: string | SelectOptionType) => {
    if (typeof optionValue === "string") return schemaProperties.find((option) => option.value === optionValue)?.label || "";
    return optionValue.label;
  };

  return (
    <Stack direction="row" gap={1} alignItems="center" pl={1}>
      <Stack flexBasis="30px">
        {index > 0 ? <Typography color="grey.700" variant="caption">
          {CONDITION_OPERATORS[operator]?.fieldPrefix?.toUpperCase()}
        </Typography> : null}
      </Stack>
      <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 } }} flexGrow={1}>
        <Field
          name={`${name}.path`}
          component={AutocompleteField}
          options={schemaProperties}
          loading={isLoading}
          isOptionEqualToValue={(option: SelectOptionType, value: string) => (value ? option.value === value : false)}
          onChange={onPathChange}
          getOptionLabel={getOptionLabel}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <InputWithLabel
              {...params}
              name={`${name}.path`}
              placeholder="Property"
              ariaLabel="Property"
              hiddenLabel
            />
          )}
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
          autoSelect
          renderInput={(params: AutocompleteRenderInputParams) => (
            <InputWithLabel
              {...params}
              name="value"
              placeholder="Enter Values"
              hiddenLabel
            />
          )}
        />
      </Stack>
    </Stack>
  );
});

