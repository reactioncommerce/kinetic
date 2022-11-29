import FormControl, { FormControlProps } from "@mui/material/FormControl";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Collapse from "@mui/material/Collapse";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import { FieldProps, getIn } from "formik";
import { uniqueId } from "lodash-es";
import { useRef } from "react";

type CustomSelectFieldProps = {
  helperText?: string;
  options: Array<{ value: string | number; label: string }>;
  ariaLabel?: string
};

type SelectFieldProps = FieldProps &
  Omit<FormControlProps, "onChange"> &
  Omit<SelectProps, "name" | "value" | "error" | "margin"> &
  CustomSelectFieldProps;

export const SelectField = ({
  field,
  form: { isSubmitting, touched, errors, setFieldValue },
  fullWidth = true,
  size = "small",
  margin = "normal",
  required,
  label,
  onBlur,
  options,
  helperText,
  hiddenLabel,
  ariaLabel,
  placeholder,
  onChange,
  ...props
}: SelectFieldProps) => {
  const { onChange: fieldOnChange, onBlur: fieldOnBlur, ...restFieldProps } = field;
  const fieldError = getIn(errors, restFieldProps.name) as string;
  const showError = getIn(touched, restFieldProps.name) && !!fieldError;
  const _helperText = showError ? fieldError : helperText;

  const fieldId = useRef(uniqueId("select-field")).current;
  const helperTextId = useRef(uniqueId("helper-text")).current;

  const _onBlur =
    onBlur ?? ((event) => fieldOnBlur(event ?? restFieldProps.name));
  const _onChange =
    onChange ?? ((event: SelectChangeEvent<string | number>) => setFieldValue(restFieldProps.name, event.target.value));

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={showError}
      required={required}
      margin={margin}
      disabled={props.disabled ?? isSubmitting}
    >
      {!hiddenLabel && (
        <FormLabel htmlFor={fieldId}>
          {label}
        </FormLabel>
      )}
      <Select
        id={fieldId}
        onBlur={_onBlur}
        aria-describedby={helperTextId}
        inputProps={{ "aria-label": ariaLabel }}
        onChange={_onChange}
        {...props}
        {...restFieldProps}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      <Collapse in={!!_helperText}>
        {_helperText && (
          <FormHelperText id={helperTextId}>{_helperText}</FormHelperText>
        )}
      </Collapse>
    </FormControl>
  );
};
