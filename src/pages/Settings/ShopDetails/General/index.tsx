import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Field } from "formik";
import * as Yup from "yup";

import { EditableCard, EditableCardProps } from "@components/Card";
import { DisplayField } from "@components/DisplayField";
import { useGetShopQuery, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { TextField } from "@components/TextField";
import { Shop } from "types/shop";
import { Loader } from "@components/Loader";
import { decodeOpaqueId } from "@utils/decodedOpaqueId";

type ShopFormValues = {
  name: string
  description?: string
  shopLogoUrls: Shop["shopLogoUrls"]
  email?: string
}

const shopSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email(),
  shopLogoUrls: Yup.object().shape({
    primaryShopLogoUrl: Yup.string().url("Please enter a valid logo URL")
  })
});

const GeneralSettings = () => {
  const { shopId } = useShop();
  const { data, refetch, isLoading } = useGetShopQuery(client, { id: shopId! });
  const { mutate } = useUpdateShopMutation(client);

  const handleSubmit: EditableCardProps<ShopFormValues>["onSubmit"] = ({ values, setSubmitting, setDrawerOpen }) => {
    const { name, description, email, shopLogoUrls } = values;
    mutate({
      input: {
        name,
        description,
        shopLogoUrls,
        emails: [{ address: email }],
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
    name: data?.shop?.name || "",
    description: data?.shop?.description || "",
    shopLogoUrls: data?.shop?.shopLogoUrls || { primaryShopLogoUrl: "" },
    email: data?.shop?.emails?.[0]?.address || ""
  };

  if (isLoading) return <Loader/>;

  return (
    <Container disableGutters>
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
              <DisplayField label="ID" value={decodeOpaqueId(data?.shop?._id)?.id} editable={false}/>
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

    </Container>
  );
};

export default GeneralSettings;
