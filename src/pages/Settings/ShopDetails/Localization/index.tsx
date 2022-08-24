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
          <>
            <DisplayField label="Timezone" value={data?.shop?.timezone}/>
            <DisplayField label="Currency" value={data?.shop?.currency.code}/>
            <DisplayField label="Language" value={data?.shop?.language}/>
            <DisplayField label="Unit of Weight" value={data?.shop?.unitsOfMeasure?.[0]?.label}/>
            <DisplayField label="Unit of Length" value={data?.shop?.unitsOfLength?.[0]?.label}/>

          </>}
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
