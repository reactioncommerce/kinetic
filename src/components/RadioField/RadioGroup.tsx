import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import MuiRadioGroup, {
  RadioGroupProps as MuiRadioGroupProps
} from "@mui/material/RadioGroup";
import { FieldProps } from "formik";
import { useRef } from "react";
import { uniqueId } from "lodash-es";


type RadioGroupProps
  = FieldProps &
    Omit<MuiRadioGroupProps, "name" | "value"> & {
      label: string
    }

export const RadioGroup = ({
  field: { onBlur: fieldOnBlur, ...field },
  form,
  onBlur,
  label,
  ...props
}:RadioGroupProps) => {
  const labelId = useRef(uniqueId("radio-field")).current;

  const _onBlur =
      onBlur ??
      ((event) => {
        fieldOnBlur(event ?? field.name);
      });

  return (
    <FormControl>
      <FormLabel id={labelId}>{label}</FormLabel>
      <MuiRadioGroup onBlur={_onBlur} aria-labelledby={labelId} {...field} {...props} />
    </FormControl>

  );
};
