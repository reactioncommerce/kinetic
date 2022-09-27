import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useShop } from "@containers/ShopProvider";
import { useGetShopTaxesSettingQuery, useGetTaxServicesQuery, useUpdateTaxServiceMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { MenuActions } from "@components/MenuActions";
import { TaxService } from "@graphql/types";
import { useToast } from "@containers/ToastProvider";

import { CustomTaxRates } from "./CustomTaxRates";

enum TaxServiceMethod {
  Primary = "Primary",
  Fallback = "Fallback"
}

const Taxes = () => {
  const { shopId } = useShop();
  const { data, isLoading } = useGetTaxServicesQuery(client, { shopId: shopId! });

  const { data: shopTaxSettingsData, refetch } = useGetShopTaxesSettingQuery(client, { shopId: shopId! });

  const { mutate } = useUpdateTaxServiceMutation(client);
  const { success } = useToast();

  const handleUpdateTaxService = ({ taxService, type }: {taxService: TaxService, type: TaxServiceMethod}) => {
    mutate({
      input: {
        shopId: shopId!,
        settingsUpdates: {
          ...(type === TaxServiceMethod.Primary ? { primaryTaxServiceName: taxService.name } : {}),
          ...(type === TaxServiceMethod.Fallback ? { fallbackTaxServiceName: taxService.name } : {})
        }
      }
    }, {
      onSuccess: () => {
        success(`Set ${taxService.displayName} as ${type} Method successfully.`);
        refetch();
      }
    });
  };

  const handleRemoveSetMethod = (type: TaxServiceMethod) => {
    mutate({
      input: {
        shopId: shopId!,
        settingsUpdates: {
          ...(type === TaxServiceMethod.Primary ? { primaryTaxServiceName: "" } : {}),
          ...(type === TaxServiceMethod.Fallback ? { fallbackTaxServiceName: "" } : {})
        }
      }
    }, {
      onSuccess: () => {
        success(`Remove as ${type} Method successfully.`);
        refetch();
      }
    });
  };

  const getMethodTypeText = (name: string) => {
    const isPrimaryMethod = name === shopTaxSettingsData?.shopSettings.primaryTaxServiceName;
    const isFallbackMethod = name === shopTaxSettingsData?.shopSettings.fallbackTaxServiceName;

    if (isPrimaryMethod && isFallbackMethod) {
      return "Primary & Fallback";
    }
    if (isPrimaryMethod) {
      return "Primary";
    }
    if (isFallbackMethod) {
      return "Fallback";
    }
    return null;
  };

  const getMenuOptions = (taxService: TaxService) => {
    const isPrimaryMethod = taxService.name === shopTaxSettingsData?.shopSettings.primaryTaxServiceName;
    const isFallbackMethod = taxService.name === shopTaxSettingsData?.shopSettings.fallbackTaxServiceName;

    if (!isPrimaryMethod && !isFallbackMethod) {
      return [
        { label: "Set as Primary Method", onClick: () => handleUpdateTaxService({ taxService, type: TaxServiceMethod.Primary }) },
        { label: "Set as Fallback Method", onClick: () => handleUpdateTaxService({ taxService, type: TaxServiceMethod.Fallback }) }];
    }
    if (isPrimaryMethod) {
      return [
        { label: "Remove as Primary Method", onClick: () => handleRemoveSetMethod(TaxServiceMethod.Primary) },
        { label: "Set as Fallback Method", onClick: () => handleUpdateTaxService({ taxService, type: TaxServiceMethod.Fallback }) }];
    }
    return [
      { label: "Remove as Fallback Method", onClick: () => handleRemoveSetMethod(TaxServiceMethod.Fallback) },
      { label: "Set as Primary Method", onClick: () => handleUpdateTaxService({ taxService, type: TaxServiceMethod.Primary }) }];
  };

  return (
    <>
      <Paper variant="outlined" sx={{ padding: 2 }} component={Container} maxWidth="md">
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
            filterNodes(data?.taxServices).map((taxService) => {
              const methodType = getMethodTypeText(taxService.name);
              return <Stack direction="row" justifyContent="space-between" alignItems="center" key={taxService.pluginName}>
                <Box>
                  <Typography variant="subtitle1">{taxService.displayName}</Typography>
                  {methodType ? <Typography variant="subtitle2" color="grey.600">{methodType}</Typography> : null}
                </Box>
                <MenuActions
                  options={getMenuOptions(taxService)}/>
              </Stack>;
            })
          }
        </Stack>
      </Paper>
      <CustomTaxRates/>
    </>
  );
};

export default Taxes;
