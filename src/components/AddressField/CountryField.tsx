import { Field, FieldProps } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { countries } from "@utils/countries";
import { InputWithLabel } from "@components/TextField";

type CountryFieldProps = {
  name: string
  isInvalid?: boolean
  error?: string
  label: string
  multiple?: boolean
  placeholder?: string
}

export const CountryField = <T, >({ name, isInvalid, error, label, multiple, placeholder }: CountryFieldProps) => (
  <Field
    name={name}
  >
    {(props: FieldProps<T>) =>
      <AutocompleteField
        {...props}
        multiple={multiple}
        options={countries}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <InputWithLabel
            {...params}
            name={name}
            error={isInvalid || !!props.meta.error}
            helperText={error || props.meta.error || undefined}
            label={label}
            placeholder={placeholder}
          />
        )}
      />
    }
  </Field>
);
