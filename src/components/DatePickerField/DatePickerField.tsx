import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FieldProps, getIn } from "formik";
import { format, isValid } from "date-fns";

import { InputWithLabel } from "@components/TextField";

type DatePickerFieldProps = DatePickerProps<unknown, Date> & FieldProps

export const DatePickerField = ({
  field,
  form: { isSubmitting, setFieldValue, errors },
  onChange,
  disabled,
  renderInput,
  onAccept,
  inputFormat = "MM/dd/yyyy",
  ...props
}: DatePickerFieldProps) => {
  const {
    onChange: fieldOnChange,
    onBlur: fieldOnBlur,
    multiple: _multiple,
    ...restFieldProps
  } = field;

  const fieldError = getIn(errors, restFieldProps.name) as string;

  const helperText = fieldError ?? undefined;

  const _onChange =
  onChange ?? ((value) => (
    value && isValid(value) ?
      setFieldValue(restFieldProps.name, format(value, inputFormat))
      : setFieldValue(restFieldProps.name, value)));

  const _onAccept = (value: Date | null) => {
    onAccept?.(value) ?? setFieldValue(restFieldProps.name, value ? format(value, inputFormat) : null);
  };

  return (
    <DatePicker
      {...props}
      {...restFieldProps}
      disabled={disabled ?? isSubmitting}
      onChange={_onChange}
      onAccept={_onAccept}
      inputFormat={inputFormat}
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
