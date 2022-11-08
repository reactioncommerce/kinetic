import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel, { FormControlLabelProps as MuiFormControlLabelProps } from "@mui/material/FormControlLabel";
import { FieldProps } from "formik";

import { CheckboxProps, fieldToCheckbox } from "./Checkbox";

export interface CheckboxWithLabelProps extends FieldProps, CheckboxProps {
  labelProps: Omit<MuiFormControlLabelProps, "checked" | "name" | "value" | "control">
}

export const CheckboxWithLabel = ({ labelProps, ...props }: CheckboxWithLabelProps) => (
  <FormControlLabel control={<MuiCheckbox {...fieldToCheckbox(props)}/>} {...labelProps} />
);
