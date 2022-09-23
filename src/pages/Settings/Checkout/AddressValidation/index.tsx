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

import { useCreateAddressValidationRuleMutation,
  useGetAddressValidationRulesQuery,
  useGetAddressValidationServiceQuery,
  useUpdateAddressValidationRuleMutation }
  from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { useShop } from "@containers/ShopProvider";
import { getCountryOptions, locales } from "@utils/countries";
import { Drawer } from "@components/Drawer";
import { InputWithLabel, TextField } from "@components/TextField";
import { AutocompleteField, AutocompleteRenderInputProps, isOptionEqualToValue } from "@components/AutocompleteField";
import { AddressValidationService } from "@graphql/types";
import { SelectOptionType } from "types/common";
import { AddressValidationRule } from "types/addressValidation";
import { useToast } from "@containers/ToastProvider";

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


const validateCountryCode = (assignedCountryCodes: string[]) => (countryCodes: SelectOptionType[]) => {
  const invalidCountryCodes = countryCodes.filter((code) => assignedCountryCodes.includes(code.value));
  let error;
  if (invalidCountryCodes.length) {
    error =
    // eslint-disable-next-line max-len
    `${invalidCountryCodes.map(({ label }) => label).join(", ")} ${invalidCountryCodes.length === 1 ? "is" : "are"} already assigned to a different Address Validation service. Please remove it from the existing service first to assign it to a new service.`
    ;
  }
  return error;
};


const getCountryCodes = (validRules: AddressValidationRule[], serviceName: string) =>
[...new Set(validRules.filter((rule) => rule.serviceName === serviceName && !!rule.countryCodes?.length).map((rule) => rule.countryCodes).flat())] as string[];

const AddressValidation = () => {
  const { shopId } = useShop();
  const [activeRule, setActiveRule] = useState<ActiveRule>();
  const toast = useToast();

  const { data, isLoading } = useGetAddressValidationServiceQuery(client);
  const addressValidationRulesData = useGetAddressValidationRulesQuery(client, { shopId: shopId! });
  const { mutate: createRule } = useCreateAddressValidationRuleMutation(client);
  const { mutate: updateRule } = useUpdateAddressValidationRuleMutation(client);

  const validRules = filterNodes(addressValidationRulesData.data?.addressValidationRules.nodes);
  const assignedCountries =
  [...new Set(validRules.filter((rule) => rule.countryCodes?.length && rule.serviceName !== activeRule?.serviceName)
    .map((rule) => rule.countryCodes).flat())] as string[];

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

  const handleSuccess = () => {
    handleClose();
    addressValidationRulesData.refetch();
    toast.success("Update Address Validation Service successfully.");
  };

  const handleSubmit: FormikConfig<ValidationRuleFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    const existingRules = validRules.filter((rule) => rule.serviceName === values.serviceName);
    const countryCodes = values.countryCodes.map(({ value }) => value);

    const countryCodesToSave = countryCodes.length ? countryCodes : null;

    if (!existingRules.length) {
      createRule(
        { input: { shopId: shopId!, serviceName: values.serviceName, countryCodes: countryCodesToSave } },
        { onSettled: () => setSubmitting(false), onSuccess: () => handleSuccess() }
      );
    } else {
      existingRules.map((rule) =>
        updateRule(
          { input: { ruleId: rule._id, serviceName: values.serviceName, shopId: shopId!, countryCodes: countryCodesToSave } },
          { onSettled: () => setSubmitting(false), onSuccess: () => handleSuccess() }
        ));
    }
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
    <Paper variant="outlined" sx={{ padding: 2 }} component={Container} maxWidth="sm">
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

              <Button variant="outlined" color="secondary" size="small" onClick={() => handleClickEditService(service)}>Edit</Button>
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
                  validate={validateCountryCode(assignedCountries)}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params: AutocompleteRenderInputProps) => (
                    <InputWithLabel
                      {...params}
                      name="countryCodes"
                      label="Country"
                      placeholder="Type to enter a country"
                      helperText={params.helperText || "Use this service only for addresses in these countries"}
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
