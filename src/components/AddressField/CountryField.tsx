import { Field, FieldProps } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { countries } from "@utils/countries";
import { InputWithLabel } from "@components/TextField";
import { SelectOptionType } from "types/common";

type CountryFieldProps = {
  name: string
  label: string
  placeholder?: string
}

export const CountryField = <T extends SelectOptionType, >({ name, label, placeholder }: CountryFieldProps) => (
  <Field
    name={name}
  >
    {(props: FieldProps<T>) =>
      <AutocompleteField
        {...props}
        options={countries}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <InputWithLabel
            {...params}
            name={name}
            error={props.meta.touched && !!props.meta.error}
            helperText={(props.meta.touched && props.meta.error) || undefined}
            label={label}
            placeholder={placeholder}
          />
        )}
      />
    }
  </Field>
);
