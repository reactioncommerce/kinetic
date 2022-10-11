import Container from "@mui/material/Container";
import { Field } from "formik";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import * as Yup from "yup";

import { useShop } from "@containers/ShopProvider";
import { useGetShopQuery, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { EditableCard, EditableCardProps } from "@components/Card";
import { DisplayField } from "@components/DisplayField";
import { timezoneOptions } from "@utils/timezones";
import { currencyOptions } from "@utils/currency";
import { languageOptions } from "@utils/languages";
import { filterNodes } from "@utils/common";
import { SelectOptionType } from "types/common";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { InputWithLabel } from "@components/TextField";
import { usePermission } from "@components/PermissionGuard";

const localizationSettingSchema = Yup.object().shape({
  timezone: Yup.object().nullable().required("This field is required"),
  currency: Yup.object().nullable().required("This field is required"),
  language: Yup.object().nullable().required("This field is required"),
  uol: Yup.object().nullable().required("This field is required"),
  uom: Yup.object().nullable().required("This field is required")
});

type ShopLocalizationFormValues = {
  timezone?: SelectOptionType,
  currency?: SelectOptionType,
  language?: SelectOptionType,
  uol?: SelectOptionType,
  uom?: SelectOptionType,
}

const Localization = () => {
  const { shopId } = useShop();
  const { data, refetch, isLoading } = useGetShopQuery(client, { id: shopId! });
  const { mutate } = useUpdateShopMutation(client);

  const timezone = timezoneOptions.find((tz) => tz.value === data?.shop?.timezone);
  const currency = currencyOptions.find((cr) => cr.value === data?.shop?.currency.code);
  const language = languageOptions.find((lang) => lang.value === data?.shop?.language);

  const unitsOfLength = filterNodes(data?.shop?.unitsOfLength).map((uol) => ({ label: uol?.label || "", value: uol?.uol || "" }));
  const unitsOfMeasure = filterNodes(data?.shop?.unitsOfMeasure).map((uom) => ({ label: uom?.label || "", value: uom?.uom || "" }));

  const uol = unitsOfLength.find((option) => option.value === data?.shop?.baseUOL);
  const uom = unitsOfMeasure.find((option) => option.value === data?.shop?.baseUOM);

  const handleSubmit: EditableCardProps<ShopLocalizationFormValues>["onSubmit"] = ({ values, setSubmitting, setDrawerOpen }) => {
    mutate({
      input: {
        baseUOM: values.uom?.value,
        baseUOL: values.uol?.value,
        currency: values.currency?.value,
        timezone: values.timezone?.value,
        language: values.language?.value,
        shopId: shopId!
      }
    }, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        setDrawerOpen(false);
        refetch();
      }
    });
  };

  const initialValues = {
    timezone,
    currency,
    language,
    uol,
    uom
  };

  const canEditShop = usePermission(["shops/update"]);

  return (
    <Container disableGutters>
      <EditableCard<ShopLocalizationFormValues>
        isLoading={isLoading}
        canEdit={canEditShop}
        cardTitle="Shop Defaults"
        cardContent={
          <>
            <DisplayField label="Timezone" value={timezone?.label}/>
            <DisplayField label="Currency" value={currency?.label}/>
            <DisplayField label="Language" value={language?.label}/>
            <DisplayField label="Unit of Weight" value={uom?.label}/>
            <DisplayField label="Unit of Length" value={uol?.label}/>

          </>}
        formTitle="Edit Shop Defaults"
        formConfig={{
          initialValues,
          validationSchema: localizationSettingSchema
        }}
        onSubmit={handleSubmit}
        formContent={
          <>
            <Field
              name="timezone"
              component={AutocompleteField}
              options={timezoneOptions}
              loading={isLoading}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <InputWithLabel
                  {...params}
                  name="timezone"
                  label="Timezone"
                />
              )}
            />
            <Field
              name="currency"
              component={AutocompleteField}
              options={currencyOptions}
              loading={isLoading}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <InputWithLabel
                  {...params}
                  name="currency"
                  label="Currency"
                />
              )}
            />
            <Field
              name="language"
              component={AutocompleteField}
              options={languageOptions}
              loading={isLoading}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <InputWithLabel
                  {...params}
                  name="language"
                  label="Language"
                />
              )}
            />
            <Field
              name="uom"
              component={AutocompleteField}
              options={unitsOfMeasure}
              loading={isLoading}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <InputWithLabel
                  {...params}
                  name="uom"
                  label="Unit of Weight"
                />
              )}
            />
            <Field
              name="uol"
              component={AutocompleteField}
              options={unitsOfLength}
              loading={isLoading}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <InputWithLabel
                  {...params}
                  name="uol"
                  label="Unit of Length"
                />
              )}
            />
          </>
        }
      />

    </Container>
  );
};

export default Localization;
