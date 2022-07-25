import Typography from "@mui/material/Typography";
import { Field } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";
import { InputWithLabel } from "@components/TextField";

type ShippingMethodsFieldProps = {
  shippingMethodOptions?: SelectOptionType[]
  isLoading: boolean
  isInvalid?: boolean
  errors?: string
}

export const ShippingMethodsField = ({ shippingMethodOptions = [], isLoading, isInvalid, errors }: ShippingMethodsFieldProps) => (
  <>
    <Typography variant="h6" gutterBottom>
      Shipping Methods
    </Typography>
    <Field
      name="methods"
      multiple
      component={AutocompleteField}
      options={shippingMethodOptions}
      loading={isLoading}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <InputWithLabel
          {...params}
          name="methodIds"
          error={isInvalid}
          helperText={errors}
          label="Methods"
          hiddenLabel
          placeholder="Type to select shipping method(s)"
        />
      )}
    />
  </>
);
