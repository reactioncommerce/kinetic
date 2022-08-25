import MuiAutocomplete, {
  AutocompleteProps as MuiAutocompleteProps, AutocompleteRenderInputParams
} from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import { FieldProps, getIn } from "formik";

import { SelectOptionType } from "types/common";

interface AutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends FieldProps,
    Omit<
      MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
      "name" | "value" | "defaultValue" | "renderInput"
    > {
  type?: string;
  renderInput: (props: AutocompleteRenderInputParams & {
    error: boolean
    helperText?: string
  }) => JSX.Element
}

export const isOptionEqualToValue = (option: SelectOptionType, value: SelectOptionType): boolean => option.value === value.value;

export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  field,
  form: { isSubmitting, setFieldValue, errors, touched },
  type,
  onChange,
  onBlur,
  disabled,
  renderInput,
  fullWidth = true,
  ...props
}: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    onChange: fieldOnChange,
    onBlur: fieldOnBlur,
    multiple: _multiple,
    ...restFieldProps
  } = field;

  const fieldError = getIn(errors, restFieldProps.name) as string;
  const showError: boolean = getIn(touched, restFieldProps.name) && !!fieldError;

  const helperText = showError ? fieldError : undefined;

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
      fullWidth={fullWidth}
      renderInput={(inputProps) => renderInput({ ...inputProps, error: showError, helperText })}
      {...restFieldProps}
      {...props}
    />
  );
}
