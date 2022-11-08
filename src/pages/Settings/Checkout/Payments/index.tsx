import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import CheckIcon from "@mui/icons-material/Check";
import Container from "@mui/material/Container";

import { useShop } from "@containers/ShopProvider";
import { useGetPaymentMethodsQuery, useUpdatePaymentMethodMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Loader } from "@components/Loader";
import { filterNodes } from "@utils/common";
import { usePermission } from "@components/PermissionGuard";

const PaymentMethods = () => {
  const { shopId } = useShop();

  const { data, isLoading, refetch } = useGetPaymentMethodsQuery(client, { shopId: shopId! });
  const { mutate } = useUpdatePaymentMethodMutation(client);

  const handleToggleStatus = (name: string, isEnabled: boolean) => {
    mutate({ input: { isEnabled, shopId: shopId!, paymentMethodName: name } }, { onSuccess: () => refetch() });
  };
  const canEditShop = usePermission(["reaction:legacy:shops/update"]);

  return (
    <Paper variant="outlined" sx={{ padding: 2 }} component={Container} maxWidth="sm">
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Payment Methods</Typography>
          <Typography variant="body2" color="grey.600">Manage your available payment plugins below</Typography>
        </Box>
        {isLoading ? <Loader/> :
          filterNodes(data?.paymentMethods).map(({ displayName, pluginName, isEnabled, name }) =>
            <Stack direction="row" justifyContent="space-between" alignItems="center" key={pluginName}>
              <Box>
                <Typography variant="subtitle1">{displayName}</Typography>
                <Typography variant="subtitle2" color="grey.600">{isEnabled ? "Enabled" : "Disabled"}</Typography>
              </Box>
              {canEditShop ?
                <Switch
                  checked={isEnabled}
                  onChange={(_, checked) => handleToggleStatus(name, checked)} checkedIcon={<CheckIcon sx={{ width: "18px", height: "18px" }} />}
                  inputProps={{ "aria-label": "Toggle payment method" }}/> : null}
            </Stack>)
        }
      </Stack>
    </Paper>
  );
};

export default PaymentMethods;
