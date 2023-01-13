import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { FieldProps, getIn } from "formik";

import { InputWithLabel } from "@components/TextField";

type DateTimePickerFieldProps = DateTimePickerProps<unknown, Date> & FieldProps

export const DEFAULT_DATE_TIME_FORMAT = "MM/dd/yyyy KK:mm aa";
export const DateTimePickerField = ({
  field,
  form: { isSubmitting, setFieldValue, errors },
  onChange,
  disabled,
  renderInput,
  onAccept,
  inputFormat = DEFAULT_DATE_TIME_FORMAT,
  ...props
}: DateTimePickerFieldProps) => {
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
    <DateTimePicker
      {...props}
      {...restFieldProps}
      inputFormat={inputFormat}
      disabled={disabled ?? isSubmitting}
      onChange={_onChange}
      onAccept={_onAccept}
      renderInput={({ inputRef, ...params }) =>
        <InputWithLabel
          {...params}
          ref={inputRef}
          error={!!helperText}
          helperText={helperText}
        />}
    />
  );
};
