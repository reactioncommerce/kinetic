import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FieldProps, getIn } from "formik";
import { format } from "date-fns";

import { InputWithLabel } from "@components/TextField";

type DatePickerFieldProps = DatePickerProps<unknown, Date> & FieldProps & {
  dateFormat?: string
}
export const DatePickerField = ({
  field,
  form: { isSubmitting, setFieldValue, errors },
  onChange,
  disabled,
  renderInput,
  dateFormat = "MM/dd/yyyy",
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
    onChange ?? ((value) => setFieldValue(restFieldProps.name, value ? format(value, dateFormat) : null));


  return (
    <DatePicker
      {...props}
      {...restFieldProps}
      disabled={disabled ?? isSubmitting}
      onChange={_onChange}
      onClose={() => fieldOnBlur(restFieldProps.name)}
      renderInput={({ inputRef, ...params }) =>
        <InputWithLabel
          {...params}
          ref={inputRef}
          error={!!helperText}
          helperText={helperText} />}
    />
  );
};
