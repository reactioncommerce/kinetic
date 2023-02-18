import Stack from "@mui/material/Stack";
import { FastField, Field, getIn, useFormikContext } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useRef } from "react";
import * as Yup from "yup";

import { SelectField } from "@components/SelectField";
import { CONDITION_OPERATORS, OPERATOR_OPTIONS } from "../constants";
import { InputWithLabel } from "@components/TextField";
import { AutocompleteField } from "@components/AutocompleteField";
import { FieldPropertySelectOption } from "@hooks/useIntrospectSchema";
import { Promotion } from "types/promotions";
import { SelectOptionType } from "types/common";
import { Type } from "types/schema";

type ConditionFieldProps = {
  name: string
  index: number
  operator: string
  schemaProperties: FieldPropertySelectOption[]
  isLoadingSchema: boolean
}


export const ConditionField = ({ name, index, operator, isLoadingSchema, schemaProperties }: ConditionFieldProps) => {
  const { setFieldValue, values } = useFormikContext<Promotion>();

  const selectedProperty = useRef(schemaProperties.find((option) => option.value === getIn(values, `${name}.path`)) || null);
  const availableValueOptions = useRef<string[]>([]);

  const onPathChange = (_: SyntheticEvent, selectedOption: FieldPropertySelectOption | null) => {
    setFieldValue(`${name}.path`, selectedOption ? selectedOption.value : null);
    selectedProperty.current = selectedOption;

    if (selectedOption?.type === Type.Boolean) {
      availableValueOptions.current = ["true", "false"];
    } else if (selectedOption?.enum) {
      availableValueOptions.current = selectedOption.enum;
    }
  };

  const getOptionLabel = (optionValue: string | FieldPropertySelectOption) => {
    if (typeof optionValue === "string") return schemaProperties.find((option) => option.value === optionValue)?.label || "";
    return optionValue.label;
  };

  const validateConditionValue = (selectedValues: string[]) => {
    let error;
    if (selectedProperty.current?.type === Type.Number || selectedProperty.current?.type === Type.Integer) {
      if (selectedValues.some((value) => !Yup.number().isValidSync(value))) {
        error = "Please enter number values";
      }
      if (typeof selectedProperty.current?.minimum !== "undefined"
      && selectedValues.some((value) => !Yup.number().min(Number(selectedProperty.current?.minimum)).isValidSync(value))) {
        error = `All values must be greater than or equal to ${selectedProperty.current.minimum}`;
      }
    }
    if (selectedProperty.current?.format === Type.DateTime && selectedValues.some((value) => !Yup.date().isValidSync(value))) {
      error = "Please enter valid date time values";
    }
    return error;
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
          loading={isLoadingSchema}
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
        <Field
          component={AutocompleteField}
          validate={validateConditionValue}
          name={`${name}.value`}
          freeSolo={!availableValueOptions.current.length}
          multiple
          options={availableValueOptions.current}
          autoSelect
          renderInput={(params: AutocompleteRenderInputParams) => (
            <InputWithLabel
              {...params}
              name={`${name}.value`}
              placeholder="Enter Values"
              hiddenLabel
            />
          )}
        />
      </Stack>
    </Stack>
  );
};
