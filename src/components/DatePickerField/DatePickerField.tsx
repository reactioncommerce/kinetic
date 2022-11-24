import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FieldProps, getIn } from "formik";

import { InputWithLabel } from "@components/TextField";

type DatePickerFieldProps = DatePickerProps<unknown, Date> & FieldProps
export const DatePickerField = ({
  field,
  form: { isSubmitting, setFieldValue, errors },
  onChange,
  disabled,
  renderInput,
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
    onChange ?? ((value) => setFieldValue(restFieldProps.name, value));


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
