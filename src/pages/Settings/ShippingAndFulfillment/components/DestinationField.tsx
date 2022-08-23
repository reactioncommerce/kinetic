import Typography from "@mui/material/Typography";
import { Field } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { countries } from "@utils/countries";
import { InputWithLabel } from "@components/TextField";
import { DestinationRestrictions, SurchargeDestinationRestrictions } from "@graphql/types";
import { filterNodes } from "@utils/common";

type DestinationFieldProps = {
  isInvalid?: boolean
  errors?: string
}

export const getInitialDestinationValue = (destination?: DestinationRestrictions | SurchargeDestinationRestrictions | null) => (destination ? {
  region: filterNodes(destination.region),
  postal: filterNodes(destination.postal),
  country: filterNodes(destination.country).map((countryCode) =>
    ({ code: countryCode, label: countries.find(({ value }) => value === countryCode)?.label ?? "Unknown" }))
} : {
  country: [],
  postal: [],
  region: []
});

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
      isOptionEqualToValue={isOptionEqualToValue}
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
