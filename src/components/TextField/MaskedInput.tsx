import { InputBaseComponentProps } from "@mui/material";
import { ForwardedRef, forwardRef, RefCallback, useMemo } from "react";
import { IMaskInput, IMask } from "react-imask";


type MaskedTextFieldProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}


export const renderMaskedInput = (mask: IMask.Masked<any>["mask"], unmask: boolean) => forwardRef<
HTMLInputElement,
Omit<InputBaseComponentProps, "onChange"> & MaskedTextFieldProps
>((props: MaskedTextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { onChange, ...others } = props;
  return (
    <IMaskInput
      {...others}
      mask={mask}
      unmask={unmask}
      inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
      onAccept={(value) => onChange({ target: { name: props.name, value: String(value) } })}
    />
  );
});

export const useRenderMaskedInput = (mask: IMask.Masked<any>["mask"], unmask: boolean) => useMemo(() => renderMaskedInput(mask, unmask), [mask, unmask]);
