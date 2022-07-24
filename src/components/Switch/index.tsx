import MuiSwitch, { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import CheckIcon from "@mui/icons-material/Check";
import { FieldProps } from "formik";

export interface SwitchProps
  extends FieldProps,
    Omit<
      MuiSwitchProps,
      | "checked"
      | "name"
      | "value"
      | "defaultChecked"
      | "form"
      | "type"
      | "checkedIcon"
    > {
  type?: string;
}

export const Switch = ({
  type = "checkbox",
  disabled,
  field: { onBlur: fieldOnBlur, ...fieldProps },
  form: { isSubmitting },
  onBlur,
  ...props
}: SwitchProps) => {
  const _onBlur = onBlur ?? ((event) => fieldOnBlur(event ?? fieldProps.name));

  return (
    <MuiSwitch
      checkedIcon={<CheckIcon sx={{ width: "18px", height: "18px" }} />}
      type={type} disabled={disabled ?? isSubmitting}
      onBlur={_onBlur}
      checked={fieldProps.value}
      {...fieldProps}
      {...props}/>
  );
};
