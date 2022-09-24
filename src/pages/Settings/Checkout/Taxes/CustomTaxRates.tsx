import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { startCase } from "lodash-es";
import * as Yup from "yup";
import Chip from "@mui/material/Chip";

import { useCreateTaxRateMutation, useDeleteTaxRateMutation, useGetTaxCodesQuery, useGetTaxRatesQuery, useUpdateTaxRateMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { Drawer } from "@components/Drawer";
import { TaxRate, TaxSource } from "@graphql/types";
import { SelectOptionType } from "types/common";
import { getRegion, locales } from "@utils/countries";
import { InputWithLabel, TextField, useRenderMaskedInput } from "@components/TextField";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { AddressField } from "@components/AddressField";

type CustomTaxRateFormValues = {
  rate: string
  sourcing: SelectOptionType
  country: SelectOptionType | null
  postal: string
  region: SelectOptionType | null
  taxCode: SelectOptionType | null
}

const taxRateSchema = Yup.object().shape({
  rate: Yup.string().required("This field is required")
});

const getCountry = (value?: string | null) => (value ? { label: locales[value].name, value } : null);

export const CustomTaxRates = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(false);
  const [activeTaxRate, setActiveTaxRate] = useState<Omit<TaxRate, "shop">>();

  const { data, isLoading, refetch } = useGetTaxRatesQuery(client, { shopId: shopId! });
  const taxCodesData = useGetTaxCodesQuery(client, { shopId: shopId! });
  const { mutate: create } = useCreateTaxRateMutation(client);
  const { mutate: update } = useUpdateTaxRateMutation(client);
  const { mutate: deleteTaxRate, isLoading: isDeleting } = useDeleteTaxRateMutation(client);

  const taxRateInput = useRenderMaskedInput([
    {
      mask: ""
    },
    {
      mask: "num%",
      lazy: false,
      blocks: {
        num: {
          mask: Number,
          scale: 3,
          min: 2,
          max: 100,
          radix: ".",
          mapToRadix: [","]
        }
      }
    }
  ], true);

  const handleClose = () => {
    setOpen(false);
    setActiveTaxRate(undefined);
  };

  const handleSuccess = () => {
    handleClose();
    refetch();
  };

  const handleSubmit: FormikConfig<CustomTaxRateFormValues>["onSubmit"] = (values, { setSubmitting }) => {
    const { rate, country, region, postal, sourcing, taxCode } = values;
    const input = {
      rate: Number(rate),
      shopId: shopId!,
      country: country?.value,
      region: region?.value,
      postal,
      sourcing: sourcing.value as TaxSource,
      taxCode: taxCode?.value
    };
    if (!activeTaxRate) {
      create(
        {
          input
        },
        { onSettled: () => setSubmitting(false), onSuccess: () => handleSuccess() }
      );
    } else {
      update({ input: { ...input, taxRateId: activeTaxRate._id } }, { onSettled: () => setSubmitting(false), onSuccess: () => handleSuccess() });
    }
  };

  const handleDelete = () => {
    if (activeTaxRate) {
      deleteTaxRate({ input: { shopId: shopId!, taxRateId: activeTaxRate._id } }, { onSuccess: () => handleSuccess() });
    }
  };

  const handleClickEdit = (taxRate: Omit<TaxRate, "shop">) => {
    setOpen(true);
    setActiveTaxRate(taxRate);
  };

  const taxCodeOptions = filterNodes(taxCodesData.data?.taxCodes).map((taxCode) => ({ label: taxCode.label, value: taxCode.code }));

  const country = getCountry(activeTaxRate?.country);

  const region = activeTaxRate?.region ? getRegion({ countryCode: country?.value, regionCode: activeTaxRate.region }) : null;

  const sourcingOptions = Object.values(TaxSource).map((source) => ({ label: startCase(source), value: source }));


  const initialValues: CustomTaxRateFormValues = {
    rate: activeTaxRate?.rate ? String(activeTaxRate?.rate) : "",
    country,
    sourcing: sourcingOptions.find((source) => source.value === activeTaxRate?.sourcing) || sourcingOptions[0],
    postal: activeTaxRate?.postal || "",
    region,
    taxCode: taxCodeOptions.find(({ value }) => value === activeTaxRate?.taxCode) || null
  };

  const getTaxRateMetadata = (taxRate: Omit<TaxRate, "shop">) => [
    taxCodeOptions.find((option) => option.value === taxRate.taxCode)?.label,
    getCountry(taxRate.country)?.label,
    getRegion({ countryCode: taxRate.country, regionCode: taxRate.region })?.label,
    taxRate.postal
  ].filter(Boolean);


  return (
    <Paper variant="outlined" sx={{ padding: 2, mt: 2 }} component={Container} maxWidth="md">
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>Custom Tax Rates</Typography>
            <Typography variant="body2" color="grey.600">Add and remove custom tax rates for your custom tax rates plugin</Typography>
          </Box>
          <Button variant="text" onClick={() => setOpen(true)}>Add</Button>
        </Stack>

        {isLoading ? <Loader/> :
          filterNodes(data?.taxRates?.nodes).map((taxRate) => {
            const metadata = getTaxRateMetadata(taxRate);
            return <Stack direction="row" justifyContent="space-between" alignItems="center" key={taxRate._id}>
              <Box>
                <Typography variant="subtitle1">{`${parseFloat(String(taxRate.rate)).toFixed(1)}%`}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                  <Typography variant="subtitle2" color="grey.600">
                    {`${sourcingOptions.find((source) => source.value === taxRate.sourcing)?.label} ${metadata.length ? "conditions" : ""}`}
                  </Typography>
                  {
                    metadata.map((value) => <Chip key={value} label={value}/>)
                  }
                </Stack>
              </Box>
              <Button variant="outlined" size="small" color="secondary" onClick={() => handleClickEdit(taxRate)}>
              Edit
              </Button>
            </Stack>;
          })
        }
      </Stack>
      <Drawer
        open={open}
        onClose={handleClose}
        title={activeTaxRate ? "Edit Custom Tax Rate" : "Add Custom Tax Rate"}
      >
        <Formik<CustomTaxRateFormValues>
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={taxRateSchema}
        >
          {({ isSubmitting, dirty }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Stack direction="column" width="50%" mb={2}>
                  <Field name="rate" label="Rate" component={TextField} inputComponent={taxRateInput}/>
                  <Field
                    name="sourcing"
                    component={AutocompleteField}
                    options={sourcingOptions}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableClearable
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <InputWithLabel
                        {...params}
                        name="sourcing"
                        label="Type"
                      />
                    )}/>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Type Conditions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.700" }}
                  gutterBottom
                >
                 For which addresses and for which products is this tax rate applicable? Leave these blank
                 to apply this rate to every product and every address.
                </Typography>
                <Stack direction="row" gap={2}>
                  <AddressField countryFieldProps={{ name: "country", label: "Country" }} regionFieldProps={{ name: "region", label: "Region" }}/>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Field name="postal" component={TextField} label="Postal"/>
                  <Field
                    name="taxCode"
                    component={AutocompleteField}
                    options={taxCodeOptions}
                    isOptionEqualToValue={isOptionEqualToValue}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <InputWithLabel
                        {...params}
                        name="taxCode"
                        label="Tax Code"
                      />
                    )}/>
                </Stack>
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeTaxRate ? (
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleDelete}
                      loading={isDeleting}
                      disabled={isSubmitting}
                    >
                    Delete
                    </LoadingButton>
                  ) : null
                }
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      size="small"
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                      disabled={!dirty}
                    >
                      Save Changes
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>

      </Drawer>
    </Paper>
  );
};
