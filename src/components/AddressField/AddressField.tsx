import { useFormikContext } from "formik";

import { SelectOptionType } from "types/common";

import { CountryField, CountryFieldProps } from "./CountryField";
import { RegionField, RegionFieldProps } from "./RegionField";

type AddressFieldProps = {
  countryFieldProps: CountryFieldProps
  regionFieldProps: RegionFieldProps
}

export const AddressField = ({ countryFieldProps, regionFieldProps }: AddressFieldProps) => {
  const { setFieldValue } = useFormikContext();

  const onCountryFieldChange = (value: SelectOptionType | null) => {
    setFieldValue(countryFieldProps.name, value);
    setFieldValue(regionFieldProps.name, null);
  };

  return (
    <>
      <CountryField onChange={onCountryFieldChange} {...countryFieldProps}/>
      <RegionField {...regionFieldProps}/>
    </>
  );
};
