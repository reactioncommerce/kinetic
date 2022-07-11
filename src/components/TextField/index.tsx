import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { FieldProps, getIn } from "formik";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Collapse from "@mui/material/Collapse";
import { uniqueId } from "lodash-es";
import { useRef } from "react";

type CustomTextFieldProps = {
  helperText?: string
}

export type TextFieldProps = FieldProps &
  FormControlProps &
  Omit<OutlinedInputProps, "name" | "value" | "error" | "margin"> &
  CustomTextFieldProps

export const TextField = ({
  field: { onBlur: fieldOnBlur, ...restFieldProps },
  form: { isSubmitting, touched, errors },
  fullWidth = true,
  size = "small",
  margin = "normal",
  required,
  label,
  onBlur,
  ...props
}: TextFieldProps) => {
  const fieldError = getIn(errors, restFieldProps.name) as string;
  const showError = getIn(touched, restFieldProps.name) && !!fieldError;

  const helperText = showError ? fieldError : props.helperText;

  const fieldId = useRef(uniqueId("text-field")).current;
  const helperTextId = useRef(uniqueId("helper-text")).current;

  const _onBlur = onBlur ?? ((event) => fieldOnBlur(event ?? restFieldProps.name));

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
      <FormLabel htmlFor={fieldId}>
        {label}
      </FormLabel>
      <OutlinedInput
        id={fieldId}
        onBlur={_onBlur}
        aria-describedby={helperTextId}
        {...props}
        {...restFieldProps}
      />
      <Collapse in={!!helperText}>
        {helperText && <FormHelperText id={helperTextId}>{helperText}</FormHelperText>}
      </Collapse>
    </FormControl>
  );
};
