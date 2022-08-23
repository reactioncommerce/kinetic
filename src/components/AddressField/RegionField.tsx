import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { Field, useFormikContext } from "formik";
import React, { useMemo } from "react";

import { InputWithLabel } from "@components/TextField";
import { AutocompleteField } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";
import { locales } from "@utils/countries";

type RegionFieldProps = {
  name: string
  isInvalid?: boolean
  error?: string
  label: string
  placeholder?: string
  multiple?: boolean
  countryFieldName?: string
}
export const RegionField =
 <FormValues extends Record<string, SelectOptionType | null>, >
  ({ name, isInvalid, error, label, placeholder, multiple, countryFieldName = "country" }: RegionFieldProps) => {
   const {
     values
   } = useFormikContext<FormValues>();

   const country = values[countryFieldName];

   const regionOptions = useMemo(() => {
     const options: SelectOptionType[] = [];
     const states = country?.value && locales[country.value] ? locales[country.value].states : undefined;
     if (states) {
       Object.keys(states).forEach((key) => {
         options.push({ value: key, label: states[key].name });
       });
     }

     return options;
   }, [country?.value]);

   return (
     <Field
       name={name}
       multiple={multiple}
       component={AutocompleteField}
       freeSolo
       options={regionOptions}
       renderInput={(params: AutocompleteRenderInputParams) => (
         <InputWithLabel
           {...params}
           name={name}
           error={isInvalid}
           helperText={error}
           label={label}
           placeholder={placeholder}
         />
       )}
     />
   );
 };
