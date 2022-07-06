import InputLabel from "@mui/material/InputLabel";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { FieldProps, getIn } from "formik";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import uniqueid from "lodash/uniqueid";
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

  const fieldId = useRef(uniqueid("text-field")).current;
  const helperTextId = useRef(uniqueid("helper-text")).current;

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
      <InputLabel sx={{ color: "grey.900", fontSize: "1.25rem" }} shrink htmlFor={fieldId}>
        {label}
      </InputLabel>
      <OutlinedInput
        sx={{
          "label + &": { marginTop: "25px" }
        }}
        id={fieldId}
        onBlur={_onBlur}
        aria-describedby={helperTextId}
        {...props}
        {...restFieldProps}
      />
      {helperText && <FormHelperText id={helperTextId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
