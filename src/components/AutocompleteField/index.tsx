import MuiAutocomplete, {
  AutocompleteProps as MuiAutocompleteProps
} from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import { FieldProps } from "formik";

import { SelectOptionType } from "types/common";

interface AutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends FieldProps,
    Omit<
      MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
      "name" | "value" | "defaultValue"
    > {
  type?: string;
}

export const isOptionEqualToValue = (option: SelectOptionType, value: SelectOptionType): boolean => option.value === value.value;

export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  field,
  form: { isSubmitting, setFieldValue },
  type,
  onChange,
  onBlur,
  disabled,
  ...props
}: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    onChange: fieldOnChange,
    onBlur: fieldOnBlur,
    multiple: _multiple,
    ...restFieldProps
  } = field;

  const _onBlur =
    onBlur ?? ((event) => fieldOnBlur(event ?? restFieldProps.name));

  const _onChange =
    onChange ?? ((event, value) => setFieldValue(restFieldProps.name, value));

  return (
    <MuiAutocomplete
      onBlur={_onBlur}
      onChange={_onChange}
      disabled={disabled ?? isSubmitting}
      ChipProps={{
        deleteIcon: <ClearIcon fontSize="small"/>
      }}
      {...restFieldProps}
      {...props}
    />
  );
}
