import InputLabel from '@mui/material/InputLabel';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import { FieldProps, getIn } from 'formik';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import uniqueid from 'lodash/uniqueid';
import { useRef } from 'react';

type CustomTextFieldProps = {
  label: string;
  helperText?: string;
};

type TextFieldProps = FieldProps &
  FormControlProps &
  Omit<OutlinedInputProps, 'name' | 'value' | 'error'> &
  CustomTextFieldProps;

function fieldToTextField({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting, touched, errors },
  onBlur,
  helperText,
  ...props
}: TextFieldProps): OutlinedInputProps & CustomTextFieldProps {
  const fieldError = getIn(errors, field.name) as string;
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    error: showError,
    helperText: showError ? fieldError : helperText,
    disabled: disabled ?? isSubmitting,
    onBlur:
      onBlur ??
      function (e) {
        fieldOnBlur(e ?? field.name);
      },
    ...field,
    ...props
  };
}

export const TextField = (props: TextFieldProps) => {
  const { helperText, label, fullWidth, size, error, required, margin, ...restInputProps } =
    fieldToTextField(props);
  const fieldId = useRef(uniqueid('text-field')).current;
  const helperTextId = useRef(uniqueid('helper-text')).current;

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={error}
      required={required}
      margin={margin}
      variant="standard">
      <InputLabel sx={{ color: 'grey.900', fontSize: '1.25rem' }} shrink htmlFor={fieldId}>
        {label}
      </InputLabel>
      <OutlinedInput
        sx={{
          'label + &': { marginTop: '25px' }
        }}
        id={fieldId}
        {...restInputProps}
        aria-describedby={helperTextId}
      />
      {helperText && <FormHelperText id={helperTextId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
