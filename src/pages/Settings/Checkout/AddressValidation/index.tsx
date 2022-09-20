import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import { useGetAddressValidationRulesQuery, useGetAddressValidationServiceQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { MenuActions } from "@components/MenuActions";
import { useShop } from "@containers/ShopProvider";
import { getCountryOptions, locales } from "@utils/countries";
import { Drawer } from "@components/Drawer";
import { InputWithLabel, TextField } from "@components/TextField";
import { AutocompleteField, AutocompleteRenderInputProps, isOptionEqualToValue } from "@components/AutocompleteField";
import { AddressValidationService } from "@graphql/types";
import { SelectOptionType } from "types/common";
import { AddressValidationRule } from "types/addressValidation";

type ValidationRuleFormValues = {
  serviceName: string
  countryCodes: SelectOptionType[]
  displayName: string
}

type ActiveRule = {
  serviceName: string
  displayName: string
  countryCodes: string[]
  supportedCountryCodes: string[]
}

const getCountryCodes = (validRules: AddressValidationRule[], serviceName: string) =>
[...new Set(validRules.filter((rule) => rule.serviceName === serviceName && !!rule.countryCodes?.length).map((rule) => rule.countryCodes).flat())] as string[];

const AddressValidation = () => {
  const { shopId } = useShop();
  const [activeRule, setActiveRule] = useState<ActiveRule>();

  const { data, isLoading } = useGetAddressValidationServiceQuery(client);
  const addressValidationRulesData = useGetAddressValidationRulesQuery(client, { shopId: shopId! });

  const validRules = filterNodes(addressValidationRulesData.data?.addressValidationRules.nodes);

  const handleClose = () => {
    setActiveRule(undefined);
  };

  const handleClickEditService = (service: AddressValidationService) => {
    setActiveRule({
      serviceName: service.name,
      displayName: service.displayName,
      countryCodes: getCountryCodes(validRules, service.name),
      supportedCountryCodes: filterNodes(service.supportedCountryCodes)
    });
  };

  const handleSubmit: FormikConfig<ValidationRuleFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {

  };

  const getAffectingCountries = (serviceName: string) => getCountryCodes(validRules, serviceName).map((code) => locales[code].name);

  const supportedCountryOptions = getCountryOptions(activeRule?.supportedCountryCodes || []);

  const initialValues: ValidationRuleFormValues = {
    serviceName: activeRule?.serviceName || "",
    displayName: activeRule?.displayName || "",
    countryCodes: activeRule ? filterNodes(activeRule.countryCodes).map((countryCode) =>
      ({ value: countryCode, label: supportedCountryOptions.find(({ value }) => value === countryCode)?.label ?? "Unknown" })) : []
  };

  return (
    <Paper variant="outlined" sx={{ padding: 2 }} component={Container} maxWidth="xs">
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Address Validation Services</Typography>
          <Typography variant="body2" color="grey.600">Manage your address validation plugins below.</Typography>
        </Box>
        {(isLoading || addressValidationRulesData.isLoading) ? <Loader/> :
          filterNodes(data?.addressValidationServices).map((service) => {
            const settingCountries = getAffectingCountries(service.name);
            return <Stack direction="row" justifyContent="space-between" alignItems="center" key={service.name}>
              <Box>
                <Typography variant="subtitle1">{service.displayName}</Typography>
                <Typography variant="subtitle2" color="grey.600">{settingCountries.length ? settingCountries.join(", ") : "All Countries"}</Typography>
              </Box>
              <MenuActions options={[{
                label: "Edit Country Settings",
                onClick: () => handleClickEditService(service)
              }]}/>
            </Stack>;
          })
        }
      </Stack>

      <Drawer
        open={!!activeRule}
        onClose={handleClose}
        title="Edit Address Validation Service"
      >
        <Formik<ValidationRuleFormValues>
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {({ isSubmitting, dirty }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Field
                  component={TextField}
                  name="displayName"
                  label="Name"
                  disabled
                />
                <Field
                  name="countryCodes"
                  multiple
                  component={AutocompleteField}
                  options={supportedCountryOptions}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params: AutocompleteRenderInputProps) => (
                    <InputWithLabel
                      {...params}
                      name="countryCodes"
                      label="Country"
                      placeholder="Type to enter a country"
                      helperText="Use this service only for addresses in these countries"
                    />
                  )}
                />
              </Drawer.Content>
              <Drawer.Actions
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

export default AddressValidation;
