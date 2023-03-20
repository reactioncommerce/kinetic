import { TimePicker, TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import { FieldProps, getIn } from "formik";

import { InputWithLabel } from "@components/TextField";


type TimePickerFieldProps = TimePickerProps<unknown, Date> & FieldProps
export const DEFAULT_TIME_FORMAT = "hh:mm a";

export const TimePickerField = ({
  field,
  form: { isSubmitting, errors, setFieldValue },
  onChange,
  disabled,
  onAccept,
  inputFormat = DEFAULT_TIME_FORMAT,
  ...props
}: TimePickerFieldProps) => {
  const {
    onChange: fieldOnChange,
    onBlur: fieldOnBlur,
    multiple: _multiple,
    ...restFieldProps
  } = field;

  const fieldError = getIn(errors, restFieldProps.name) as string;
  const helperText = fieldError ?? undefined;

  const _onChange =
    onChange ?? ((value) => setFieldValue(restFieldProps.name, value));


  const _onAccept = (value: Date | null) => {
    onAccept?.(value) ?? setFieldValue(restFieldProps.name, value);
  };

  return (
    <TimePicker
      {...props}
      {...restFieldProps}
      onChange={_onChange}
      disabled={disabled ?? isSubmitting}
      inputFormat={inputFormat}
      onAccept={_onAccept}
      mask="__:__ _M"
      renderInput={
        ({ inputRef, ...params }) =>
          <InputWithLabel
            {...params}
            ref={inputRef}
            error={!!helperText}
            helperText={helperText}
          />
      }
    />
  );
};
