import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Field } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";

import { EditableCard, EditableCardProps } from "@components/Card";
import { DisplayField } from "@components/DisplayField";
import { useGetShopQuery, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { PhoneNumberField, TextField } from "@components/TextField";
import { Shop } from "types/shop";
import { Loader } from "@components/Loader";
import { countries, getRegion } from "@utils/countries";
import { SelectOptionType } from "types/common";
import { CountryField, RegionField } from "@components/AddressField";

type ShopFormValues = {
  name: string
  description?: string
  shopLogoUrls: Shop["shopLogoUrls"]
  email?: string,
  legalName:string,
  phone: string,
  address1: string,
  address2: string,
  city: string,
  region?: SelectOptionType | null,
  postal: string,
  country?: SelectOptionType
}

const shopSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  email: Yup.string().email("This email is invalid"),
  shopLogoUrls: Yup.object().shape({
    primaryShopLogoUrl: Yup.string().url("Please enter a valid logo URL")
  }),
  address1: Yup.string().required("This field is required"),
  country: Yup.object({
    label: Yup.string(),
    value: Yup.string()
  }).nullable().required("This field is required"),
  legalName: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  postal: Yup.string().required("This field is required"),
  region: Yup.object({
    label: Yup.string(),
    value: Yup.string()
  }).nullable().required("This field is required")
});

const GeneralSettings = () => {
  const { shopId } = useShop();
  const { data, refetch, isLoading } = useGetShopQuery(client, { id: shopId! });
  const { mutate } = useUpdateShopMutation(client);

  const handleSubmit: EditableCardProps<ShopFormValues>["onSubmit"] = ({ values, setSubmitting, setDrawerOpen }) => {
    const { name, description, email, shopLogoUrls, legalName, country, region, ...rest } = values;
    mutate({
      input: {
        name,
        description,
        shopLogoUrls,
        emails: [{ address: email }],
        shopId: shopId!,
        addressBook: [{ ...rest, fullName: legalName, company: legalName, isCommercial: false, country: country?.value || "", region: region?.value || "" }]
      }
    }, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        setDrawerOpen(false);
        refetch();
      }
    });
  };

  const country = countries.find(({ value }) => value === data?.shop?.addressBook?.[0]?.country);
  const region = getRegion({ countryCode: country?.value, regionCode: data?.shop?.addressBook?.[0]?.region });

  const initialValues = {
    name: data?.shop?.name || "",
    description: data?.shop?.description || "",
    shopLogoUrls: data?.shop?.shopLogoUrls || { primaryShopLogoUrl: "" },
    email: data?.shop?.emails?.[0]?.address || "",
    legalName: data?.shop?.addressBook?.[0]?.company || data?.shop?.addressBook?.[0]?.fullName || "",
    phone: data?.shop?.addressBook?.[0]?.phone || "",
    address1: data?.shop?.addressBook?.[0]?.address1 || "",
    address2: data?.shop?.addressBook?.[0]?.address2 || "",
    city: data?.shop?.addressBook?.[0]?.city || "",
    region,
    postal: data?.shop?.addressBook?.[0]?.postal || "",
    country
  };

  if (isLoading) return <Loader/>;

  return (
    <Stack gap={3} component={Container}>
      <EditableCard<ShopFormValues>
        cardTitle="Details"
        cardContent={
          <Grid container spacing={4}>
            <Grid item>
              <Avatar sx={{ width: 100, height: 100 }} variant="rounded" src={data?.shop?.shopLogoUrls?.primaryShopLogoUrl || ""} />
            </Grid>
            <Grid item xs={12} md>
              <DisplayField label="Name" value={data?.shop?.name}/>
              <DisplayField label="Email" value={data?.shop?.emails?.[0]?.address}/>
              <DisplayField label="Description" value={data?.shop?.description}/>
              <DisplayField label="Storefront URL" value={data?.shop?.storefrontUrls?.storefrontHomeUrl} editable={false}/>
              <DisplayField label="ID" value={data?.shop?._id} editable={false}/>
            </Grid>
          </Grid>}
        formTitle="Edit Shop Details"
        formConfig={{
          initialValues,
          validationSchema: shopSchema
        }}
        onSubmit={handleSubmit}
        formContent={
          <>
            <Field name="name" component={TextField} placeholder="Enter Shop Name" label="Name" />
            <Field name="email" component={TextField} placeholder="Enter Shop Email" label="Email" />
            <Field name="description" component={TextField} placeholder="Enter Shop Description" label="Description" />
            <Field name="shopLogoUrls.primaryShopLogoUrl" component={TextField} placeholder="Enter Shop Logo URL" label="Shop Logo URL" />
          </>
        }
      />

      <EditableCard<ShopFormValues>
        cardTitle="Primary Address"
        cardContent={
          <Stack gap={3} direction="column">
            <Stack>
              <DisplayField label="Legal Name" value={data?.shop?.addressBook?.[0]?.fullName}/>
              <DisplayField label="Phone Name" value={data?.shop?.addressBook?.[0]?.phone}/>
            </Stack>
            <Stack>
              <DisplayField label="Address Line 1" value={data?.shop?.addressBook?.[0]?.address1}/>
              <DisplayField label="Address Line 2" value={data?.shop?.addressBook?.[0]?.address2}/>
              <DisplayField label="City" value={data?.shop?.addressBook?.[0]?.city}/>
              <DisplayField label="Region" value={region?.label}/>
              <DisplayField label="Postal" value={data?.shop?.addressBook?.[0]?.postal}/>
              <DisplayField label="Country" value={country?.label}/>
            </Stack>

          </Stack>
        }
        formTitle="Edit Primary Address"
        formConfig={{
          initialValues,
          validationSchema: shopSchema
        }}
        onSubmit={handleSubmit}
        formContent={
          <>
            <Field name="legalName" component={TextField} label="Legal Name" />
            <Field name="phone" component={PhoneNumberField} label="Phone Number" />
            <Field name="address1" component={TextField} label="Address Line 1" />
            <Field name="address2" component={TextField} label="Address Line 2" />
            <Stack direction="row" gap={2}>
              <CountryField name="country" label="Country"/>
              <RegionField name="region" label="Region"/>
            </Stack>

            <Stack direction="row" gap={2}>
              <Field name="city" component={TextField} label="City" />
              <Field name="postal" component={TextField} label="Postal"/>
            </Stack>

          </>}
      />
    </Stack>
  );
};

export default GeneralSettings;
