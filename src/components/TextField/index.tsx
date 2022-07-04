import MuiTextField, {
  TextFieldProps as MuiTextFieldProps
} from "@mui/material/TextField";
import { FieldProps, getIn } from "formik";

type TextFieldProps = FieldProps &
  Omit<MuiTextFieldProps, "name" | "value" | "error">;

function fieldToTextField({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting, touched, errors },
  onBlur,
  helperText,
  ...props
}: TextFieldProps): MuiTextFieldProps {
  const fieldError = getIn(errors, field.name) as string;
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    error: showError,
    helperText: showError ? fieldError : helperText,
    disabled: disabled ?? isSubmitting,
    onBlur:
      onBlur ??
      function (error) {
        fieldOnBlur(error ?? field.name);
      },
    ...field,
    ...props
  };
}

export const TextField = ({ children, ...props }: TextFieldProps) => (
  <MuiTextField {...fieldToTextField(props)}>{children}</MuiTextField>
);
