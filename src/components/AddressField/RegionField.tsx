import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { Field, FieldProps, useFormikContext } from "formik";

import { InputWithLabel } from "@components/TextField";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";
import { locales, CountryType } from "@utils/countries";

type RegionFieldProps = {
  name: string
  label: string
  placeholder?: string
  countryFieldName?: string
}

const validateRegion = (states: CountryType["states"]) => (region: SelectOptionType) => {
  let error;
  if (states && region && !states[region.value]) {
    error = "Please select a valid region";
  }
  return error;
};

export const RegionField =
 <FormValues extends Record<string, SelectOptionType | null>, >
  ({ name, label, placeholder, countryFieldName = "country" }: RegionFieldProps) => {
   const {
     values,
     setFieldValue
   } = useFormikContext<FormValues>();

   const country = values[countryFieldName];
   const states = country?.value && locales[country.value] ? locales[country.value].states : undefined;

   const regionOptions: SelectOptionType[] = [];
   if (states) {
     Object.keys(states).forEach((key) => {
       regionOptions.push({ value: key, label: states[key].name });
     });
   }

   const handleInputChange = (value: string) => {
     if (value && !regionOptions.length) {
       setFieldValue(name, { label: value, value });
     }
   };


   return (
     <Field
       name={name}
       validate={validateRegion(states)}
     >
       {(props: FieldProps<FormValues>) =>
         <AutocompleteField
           {...props}
           freeSolo={!regionOptions.length}
           options={regionOptions}
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
