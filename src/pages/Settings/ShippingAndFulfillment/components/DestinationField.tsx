import Typography from "@mui/material/Typography";
import { Field } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { AutocompleteField } from "@components/AutocompleteField";
import { countries, CountryType } from "@utils/countries";
import { InputWithLabel } from "@components/TextField";

type DestinationFieldProps = {
  isInvalid?: boolean
  errors?: string
}

export const DestinationField = ({ isInvalid, errors }: DestinationFieldProps) => (
  <>
    <Typography variant="h6" gutterBottom>
        Destinations
    </Typography>
    <Field
      name="destination.country"
      multiple
      component={AutocompleteField}
      options={countries}
      isOptionEqualToValue={(option: CountryType, value: CountryType) => option.code === value.code}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <InputWithLabel
          {...params}
          name="country"
          error={isInvalid}
          helperText={errors}
          label="Country"
          placeholder="Type to enter a country"
        />
      )}
    />
    <Field
      name="destination.postal"
      multiple
      component={AutocompleteField}
      freeSolo
      options={[]}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <InputWithLabel
          {...params}
          name="postal"
          error={isInvalid}
          helperText={errors}
          label="Postal Code"
          placeholder="Type to enter a zip code"
        />
      )}
    />
    <Field
      name="destination.region"
      multiple
      component={AutocompleteField}
      freeSolo
      options={[]}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <InputWithLabel
          {...params}
          name="autocomplete"
          error={isInvalid}
          helperText={errors}
          label="Region"
          placeholder="Type to enter a region"
        />
      )}
    />
  </>
);
