import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { Field, FieldProps, getIn, useFormikContext } from "formik";
import { useEffect, useState } from "react";

import { InputWithLabel } from "@components/TextField";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";
import { locales, countriesWithoutState } from "@utils/countries";

export type RegionFieldProps = {
  name: string
  label: string
  placeholder?: string
  countryFieldName?: string
  required?: boolean
}

const validateRegion = (country: SelectOptionType | null) => (region: SelectOptionType) => {
  let error;
  if (country && !countriesWithoutState.includes(country.value) && !region) {
    error = "This field is required";
  }
  return error;
};

export const RegionField =
 <FormValues extends Record<string, SelectOptionType | null>, >
  ({ name, label, placeholder, countryFieldName = "country", required = true }: RegionFieldProps) => {
   const {
     values,
     setFieldValue
   } = useFormikContext<FormValues>();
   const fieldValue = getIn(values, name)?.value;
   const [inputValue, setInputValue] = useState(fieldValue || "");

   const country = getIn(values, countryFieldName);
   const states = country?.value && locales[country.value] ? locales[country.value].states : undefined;

   useEffect(() => {
     if (!fieldValue) {
       setInputValue("");
     }
   }, [fieldValue]);

   const regionOptions: SelectOptionType[] = [];
   if (states) {
     Object.keys(states).forEach((key) => {
       regionOptions.push({ value: key, label: states[key].name });
     });
   }

   const handleInputChange = (value: string) => {
     setInputValue(value);
     if (value && !regionOptions.length) {
       setFieldValue(name, { label: value, value });
     }
   };


   return (
     <Field
       name={name}
       validate={required ? (value: SelectOptionType) => validateRegion(country)(value) : undefined}
     >
       {(props: FieldProps<FormValues>) =>
         <AutocompleteField
           {...props}
           freeSolo={!regionOptions.length}
           options={regionOptions}
           inputValue={inputValue}
           onInputChange={(_, value) => handleInputChange(value)}
           isOptionEqualToValue={regionOptions.length ? isOptionEqualToValue : () => true}
           renderInput={(params: AutocompleteRenderInputParams) => (
             <InputWithLabel
               {...params}
               name={name}
               error={props.meta.touched && !!props.meta.error}
               helperText={(props.meta.touched && props.meta.error) || undefined}
               label={label}
               placeholder={placeholder}
             />
           )}/>}
     </Field>
   );
 };
