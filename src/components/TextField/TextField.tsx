import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { FieldProps, getIn } from "formik";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Collapse from "@mui/material/Collapse";
import { uniqueId } from "lodash-es";
import { forwardRef, useRef } from "react";
import { Typography } from "@mui/material";

type CustomTextFieldProps = {
  helperText?: string
  ariaLabel?: string
}

export type TextFieldProps = FieldProps &
  FormControlProps &
  Omit<OutlinedInputProps, "name" | "value" | "error" | "margin"> &
  CustomTextFieldProps

export const TextField = forwardRef(({
  field: { onBlur: fieldOnBlur, onChange: fieldOnChange, ...restFieldProps },
  form: { isSubmitting, touched, errors },
  fullWidth = true,
  size = "small",
  margin = "normal",
  required,
  label,
  onBlur,
  helperText,
  hiddenLabel,
  ariaLabel,
  onChange,
  ...props
}: TextFieldProps, ref) => {
  const fieldError = getIn(errors, restFieldProps.name) as string;
  const showError = getIn(touched, restFieldProps.name) && !!fieldError;

  const _helperText = showError ? fieldError : helperText;

  const fieldId = useRef(uniqueId("text-field")).current;
  const helperTextId = useRef(uniqueId("helper-text")).current;

  const _onBlur = onBlur ?? ((event) => fieldOnBlur(event ?? restFieldProps.name));

  const _onChange = onChange ?? fieldOnChange;

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={showError}
      required={required}
      margin={margin}
      disabled={props.disabled ?? isSubmitting}
      variant="standard"
    >
      {!hiddenLabel && (
        <FormLabel htmlFor={fieldId} component={Typography} noWrap>
          {label}
        </FormLabel>
      )}
      <OutlinedInput
        id={fieldId}
        onBlur={_onBlur}
        aria-describedby={helperTextId}
        inputProps={{ "aria-label": ariaLabel }}
        ref={ref}
        onChange={_onChange}
        {...props}
        {...restFieldProps}
      />
      <Collapse in={!!_helperText}>
        {_helperText && <FormHelperText id={helperTextId}>{_helperText}</FormHelperText>}
      </Collapse>
    </FormControl>
  );
});
