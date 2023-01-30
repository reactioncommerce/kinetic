import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Field } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";

import { EditableCard, EditableCardProps } from "@components/Card";
import { DisplayField } from "@components/DisplayField";
import { useGetShopQuery, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { PhoneNumberField, TextField } from "@components/TextField";
import { Shop } from "types/shop";
import { countries, getRegion, locales } from "@utils/countries";
import { SelectOptionType } from "types/common";
import { AddressField } from "@components/AddressField";
import { decodeOpaqueId } from "@utils/decodedOpaqueId";
import { Switch } from "@components/Switch";
import { urlSchema } from "@utils/validate";
import { usePermission } from "@components/PermissionGuard";

type ShopFormValues = {
  name: string
  description?: string
  shopLogoUrls: Shop["shopLogoUrls"]
  storefrontUrls: Shop["storefrontUrls"]
  email?: string,
  legalName:string,
  phone: string,
  address1: string,
  address2: string,
  city: string,
  region?: SelectOptionType | null,
  postal: string,
  country?: SelectOptionType | null
  allowGuestCheckout: boolean
}

const shopGeneralSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  email: Yup.string().email("This email is invalid").required("This field is required"),
  shopLogoUrls: Yup.object().shape({
    primaryShopLogoUrl: Yup.string().url("Please enter a valid logo URL")
  }),
  storefrontUrls: Yup.object().shape({
    storefrontHomeUrl: urlSchema
  })
});

const shopPrimarySchema = Yup.object().shape({
  address1: Yup.string().required("This field is required"),
  country: Yup.object({
    label: Yup.string(),
    value: Yup.string()
  }).nullable().required("This field is required"),
  legalName: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  postal: Yup.string().required("This field is required"),
  city: Yup.string().required("This field is required")
});

const GeneralSettings = () => {
  const { shopId, setShop } = useShop();
  const { data, refetch, isLoading } = useGetShopQuery(client, { id: shopId! });
  const { mutate } = useUpdateShopMutation(client);


  const handleSubmitGeneralSettings: EditableCardProps<ShopFormValues>["onSubmit"] = ({ values, setSubmitting, setDrawerOpen }) => {
    const { name, description, email, shopLogoUrls, allowGuestCheckout, storefrontUrls } = values;
    mutate({
      input: {
        name,
        description,
        shopLogoUrls,
        emails: [{ address: email }],
        shopId: shopId!,
        allowGuestCheckout,
        storefrontUrls
      }
    }, {
      onSettled: () => setSubmitting(false),
      onSuccess: (updateResponse) => {
        setShop(updateResponse.updateShop.shop);
        setDrawerOpen(false);
        refetch();
      }
    });
  };

  const handleSubmitPrimaryAddress: EditableCardProps<ShopFormValues>["onSubmit"] = ({ values, setSubmitting, setDrawerOpen }) => {
    const { legalName, country, region, address1, address2, phone, postal, city } = values;
    const regionValue = country?.value && locales[country.value]?.states ? region?.value : region?.label;

    mutate({
      input: {
        shopId: shopId!,
        addressBook: [{
          address1,
          address2,
          phone,
          postal,
          city,
          fullName: legalName,
          company: legalName,
          isCommercial: false,
          country: country?.value || "",
          region: regionValue || ""
        }]
      }
    }, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        setDrawerOpen(false);
        refetch();
      }
    });
  };

  const country = countries.find(({ value }) => value === data?.shop?.addressBook?.[0]?.country) || null;
  const region = getRegion({ countryCode: country?.value, regionCode: data?.shop?.addressBook?.[0]?.region });

  const initialValues = {
    name: data?.shop?.name || "",
    description: data?.shop?.description || "",
    shopLogoUrls: data?.shop?.shopLogoUrls || { primaryShopLogoUrl: "" },
    storefrontUrls: data?.shop?.storefrontUrls || { storefrontHomeUrl: "" },
    email: data?.shop?.emails?.[0]?.address || "",
    legalName: data?.shop?.addressBook?.[0]?.company || data?.shop?.addressBook?.[0]?.fullName || "",
    phone: data?.shop?.addressBook?.[0]?.phone || "",
    address1: data?.shop?.addressBook?.[0]?.address1 || "",
    address2: data?.shop?.addressBook?.[0]?.address2 || "",
    city: data?.shop?.addressBook?.[0]?.city || "",
    region,
    postal: data?.shop?.addressBook?.[0]?.postal || "",
    country,
    allowGuestCheckout: !!data?.shop?.allowGuestCheckout
  };

  const canEditShop = usePermission(["reaction:legacy:shops/update"]);

  return (
    <Stack gap={3} component={Container}>
      <EditableCard<ShopFormValues>
        canEdit={canEditShop}
        isLoading={isLoading}
        cardTitle="Details"
        cardContent={
          <Grid container spacing={4}>
            <Grid item>
              <Avatar sx={{ width: 100, height: 100, objectFit: "contain" }} variant="rounded" src={data?.shop?.shopLogoUrls?.primaryShopLogoUrl || ""} />
            </Grid>
            <Grid item xs={12} md>
              <DisplayField label="Name" value={data?.shop?.name}/>
              <DisplayField label="Email" value={data?.shop?.emails?.[0]?.address}/>
              <DisplayField label="Description" value={data?.shop?.description}/>
              <DisplayField label="Storefront URL" value={data?.shop?.storefrontUrls?.storefrontHomeUrl}/>
              <DisplayField label="ID" value={decodeOpaqueId(data?.shop?._id)?.id} editable={false}/>
              <DisplayField label="Guest checkout" value={data?.shop?.allowGuestCheckout ? "Enabled" : "Disabled"} />
            </Grid>
          </Grid>}
        formTitle="Edit Shop Details"
        formConfig={{
          initialValues,
          validationSchema: shopGeneralSchema
        }}
        onSubmit={handleSubmitGeneralSettings}
        formContent={
          <>
            <Field name="name" component={TextField} placeholder="Enter Shop Name" label="Name" />
            <Field name="email" component={TextField} placeholder="Enter Shop Email" label="Email" />
            <Field name="description" component={TextField} placeholder="Enter Shop Description" label="Description" />
            <Field
              component={TextField}
              name="storefrontUrls.storefrontHomeUrl"
              label="Storefront URL"
              placeholder="Enter you shop homepage URL"
            />
            <Field name="shopLogoUrls.primaryShopLogoUrl" component={TextField} placeholder="Enter Shop Logo URL" label="Shop Logo URL" />
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Field
                  component={Switch}
                  label="Enable guest checkout"
                  name="allowGuestCheckout"
                />
              }
              label="Enable guest checkout"
            />
          </>
        }
      />

      <EditableCard<ShopFormValues>
        cardTitle="Primary Address"
        canEdit={canEditShop}
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
          validationSchema: shopPrimarySchema
        }}
        onSubmit={handleSubmitPrimaryAddress}
        formContent={
          <>
            <Field name="legalName" component={TextField} label="Legal Name" />
            <Field name="phone" component={PhoneNumberField} label="Phone Number" />
            <Field name="address1" component={TextField} label="Address Line 1" />
            <Field name="address2" component={TextField} label="Address Line 2" />
            <Stack direction="row" gap={2}>
              <AddressField countryFieldProps={{ name: "country", label: "Country" }} regionFieldProps={{ name: "region", label: "Region" }}/>
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
