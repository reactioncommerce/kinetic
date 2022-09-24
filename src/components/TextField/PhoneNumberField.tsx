import { useRenderMaskedInput } from "./MaskedInput";
import { TextField, TextFieldProps } from "./TextField";

type PhoneNumberFieldProps = TextFieldProps

export const PhoneNumberField = ({ field, ...props }: PhoneNumberFieldProps) => {
  const numberInput = useRenderMaskedInput("000-000-0000", false);

  return (
    <TextField field={field} {...props} inputComponent={numberInput}/>
  );
};
