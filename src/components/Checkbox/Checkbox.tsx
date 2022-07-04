import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps
} from "@mui/material/Checkbox";
import { FieldProps } from "formik";

export interface CheckboxProps
  extends FieldProps,
    Omit<
      MuiCheckboxProps,
      | "name"
      | "value"
      | "error"
      | "form"
      | "checked"
      | "defaultChecked"
      // Excluded for conflict with Field type
      | "type"
    > {
  type?: string;
}

export function fieldToCheckbox({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting },
  type,
  onBlur,
  ...props
}: CheckboxProps): MuiCheckboxProps {
  return {
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

export const Checkbox = (props: CheckboxProps) => (
  <MuiCheckbox {...fieldToCheckbox(props)} />
);
