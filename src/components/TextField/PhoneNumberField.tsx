import { InputBaseComponentProps } from "@mui/material";
import { ForwardedRef, forwardRef, RefCallback } from "react";
import { IMaskInput } from "react-imask";

import { TextField, TextFieldProps } from "./TextField";

type PhoneNumberFieldProps = TextFieldProps

type TextMaskCustomProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<
HTMLInputElement,
Omit<InputBaseComponentProps, "onChange"> & TextMaskCustomProps
>((props: TextMaskCustomProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000-000-0000"
      inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
      onAccept={(value) => onChange({ target: { name: props.name, value: String(value) } })}
      overwrite
    />
  );
});

export const PhoneNumberField = ({ field, ...props }: PhoneNumberFieldProps) => (
  <TextField field={field} {...props} inputComponent={TextMaskCustom}/>
);
