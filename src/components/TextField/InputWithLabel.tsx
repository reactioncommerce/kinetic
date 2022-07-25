import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { uniqueId } from "lodash-es";
import { forwardRef, useRef } from "react";
import Collapse from "@mui/material/Collapse";
import FormHelperText from "@mui/material/FormHelperText";
import { TextFieldProps } from "@mui/material";


export const InputWithLabel = forwardRef((
  {
    fullWidth = true,
    size = "small",
    margin = "normal",
    required,
    label,
    helperText,
    hiddenLabel,
    error,
    disabled,
    InputProps,
    inputProps,
    placeholder
  }: TextFieldProps,
  ref
) => {
  const fieldId = useRef(uniqueId("text-field")).current;
  const helperTextId = useRef(uniqueId("helper-text")).current;

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={error}
      required={required}
      margin={margin}
      disabled={disabled}
      variant="standard"
    >
      {!hiddenLabel && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
      <OutlinedInput
        id={fieldId}
        aria-describedby={helperTextId}
        error={error}
        disabled={disabled}
        ref={ref}
        inputProps={inputProps}
        placeholder={placeholder}
        {...InputProps}
      />
      <Collapse in={!!helperText}>
        {helperText && (
          <FormHelperText id={helperTextId}>{helperText}</FormHelperText>
        )}
      </Collapse>
    </FormControl>
  );
});
