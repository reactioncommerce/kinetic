import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useShop } from "@containers/ShopProvider";
import { useGetShopTaxesSettingQuery, useGetTaxServicesQuery, useUpdateTaxServiceMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { MenuActions } from "@components/MenuActions";

const Taxes = () => {
  const { shopId } = useShop();
  const { data, isLoading } = useGetTaxServicesQuery(client, { shopId: shopId! });

  const { data: shopTaxSettingsData, refetch } = useGetShopTaxesSettingQuery(client, { shopId: shopId! });

  const { mutate } = useUpdateTaxServiceMutation(client);

  const handleUpdateTaxService = (name: string, type: "primary" | "fallback") => {
    mutate({
      input: {
        shopId: shopId!,
        settingsUpdates: {
          ...(type === "primary" ? { primaryTaxServiceName: name } : {}),
          ...(type === "fallback" ? { fallbackTaxServiceName: name } : {})
        }
      }
    }, { onSuccess: () => refetch() });
  };

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Tax Methods</Typography>
          <Typography variant="body2" color="grey.600">Manage your available tax plugins below</Typography>
        </Box>
        {isLoading ? <Loader/> :
          filterNodes(data?.taxServices).map(({ displayName, pluginName, name }) =>
            <Stack direction="row" justifyContent="space-between" alignItems="center" key={pluginName}>
              <Box>
                <Typography variant="subtitle1">{displayName}</Typography>
                {name === shopTaxSettingsData?.shopSettings.primaryTaxServiceName &&
                <Typography variant="subtitle2" color="grey.600">Primary</Typography>}
                {name === shopTaxSettingsData?.shopSettings.fallbackTaxServiceName &&
                <Typography variant="subtitle2" color="grey.600">Fallback</Typography>}
              </Box>
              <MenuActions
                options={[
                  { label: "Set as Primary Method", onClick: () => handleUpdateTaxService(name, "primary") },
                  { label: "Set as Fallback Method", onClick: () => handleUpdateTaxService(name, "fallback") }]}/>
            </Stack>)
        }
      </Stack>
    </Paper>
  );
};

export default Taxes;
