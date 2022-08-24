import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { Field, FieldProps, useFormikContext } from "formik";
import { useMemo } from "react";

import { InputWithLabel } from "@components/TextField";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";
import { locales } from "@utils/countries";

type RegionFieldProps = {
  name: string
  label: string
  placeholder?: string
  countryFieldName?: string
}

export const RegionField =
 <FormValues extends Record<string, SelectOptionType | null>, >
  ({ name, label, placeholder, countryFieldName = "country" }: RegionFieldProps) => {
   const {
     values,
     setFieldValue
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

   const handleInputChange = (value: string) => {
     if (value && !regionOptions.length) {
       setFieldValue(name, { label: value, value });
     }
   };


   return (
     <Field
       name={name}
     >
       {(props: FieldProps<FormValues>) =>
         <AutocompleteField
           {...props}
           freeSolo={!regionOptions.length}
           options={regionOptions}
           onInputChange={(_, value) => handleInputChange(value)}
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
           )}/>}
     </Field>
   );
 };
