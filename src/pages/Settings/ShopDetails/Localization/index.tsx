import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useShop } from "@containers/ShopProvider";
import { useGetShopQuery, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { EditableCard } from "@components/Card";
import { DisplayField } from "@components/DisplayField";

const Localization = () => {
  const { shopId } = useShop();
  const { data, refetch, isLoading } = useGetShopQuery(client, { id: shopId! });
  const { mutate } = useUpdateShopMutation(client);

  return (
    <Container disableGutters>
      <EditableCard<any>
        isLoading={isLoading}
        cardTitle="Shop Defaults"
        cardContent={
          <Stack gap={3} direction="column">
            {/* <DisplayField label="Legal Name" value={data?.shop?.addressBook?.[0]?.fullName}/>
            <DisplayField label="Phone Name" value={data?.shop?.addressBook?.[0]?.phone}/>
            <DisplayField label="Address Line 1" value={data?.shop?.addressBook?.[0]?.address1}/>
            <DisplayField label="Address Line 2" value={data?.shop?.addressBook?.[0]?.address2}/>
            <DisplayField label="City" value={data?.shop?.addressBook?.[0]?.city}/>
            <DisplayField label="Region" value={data?.shop?.addressBook?.[0]?.region}/>
            <DisplayField label="Postal" value={data?.shop?.addressBook?.[0]?.postal}/>
            <DisplayField label="Country" value={country?.label}/> */}

          </Stack>}
        formTitle="Edit Shop Defaults"
        formConfig={{
          initialValues: {}
          // validationSchema: shopSchema
        }}
        onSubmit={() => {}}
        formContent={
          <>
            {/* <Field name="name" component={TextField} placeholder="Enter Shop Name" label="Name" />
            <Field name="email" component={TextField} placeholder="Enter Shop Email" label="Email" />
            <Field name="description" component={TextField} placeholder="Enter Shop Description" label="Description" />
            <Field name="shopLogoUrls.primaryShopLogoUrl" component={TextField} placeholder="Enter Shop Logo URL" label="Shop Logo URL" /> */}
          </>
        }
      />

    </Container>
  );
};

export default Localization;
