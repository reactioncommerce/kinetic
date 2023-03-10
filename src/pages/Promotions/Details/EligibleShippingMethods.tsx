import { Field, FieldArray } from "formik";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import { get } from "lodash-es";

import { useGetShippingMethodsQuery } from "@graphql/generates";
import { useShop } from "@containers/ShopProvider";
import { client } from "@graphql/graphql-request-client";
import { usePermission } from "@components/PermissionGuard";
import { filterNodes } from "@utils/common";
import { AutocompleteField } from "@components/AutocompleteField";
import { InputWithLabel } from "@components/TextField";
import { FieldArrayRenderer } from "@components/FieldArrayRenderer";


type EligibleShippingMethodsProps = {
  inclusionFieldName: string
  disabled: boolean
}

export const EligibleShippingMethods = ({ inclusionFieldName, disabled }: EligibleShippingMethodsProps) => {
  const { shopId } = useShop();

  const canReadShippingMethods = usePermission(["reaction:legacy:shippingMethods/read"]);

  const { data, isLoading } = useGetShippingMethodsQuery(
    client,
    { shopId: shopId! },
    {
      enabled: !!shopId && canReadShippingMethods,
      select: (response) =>
        filterNodes(response.flatRateFulfillmentMethods.nodes).map(({ name }) => name)
    }
  );
  const shippingMethodFieldName = `${inclusionFieldName}[0].value`;

  return (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle2">Eligible Shipping Methods</Typography>
      <FieldArray
        name={inclusionFieldName}
        render={(props) => (
          <Paper sx={{ py: 1, backgroundColor: "grey.100" }}>
            {get(props.form.values, inclusionFieldName, []).length ?
              <Typography variant="subtitle2" sx={{ pl: 5.7 }}>
                Including the following shipping methods
              </Typography>
              :
              <Typography variant="subtitle2" sx={{ pl: 5.7 }}>Including all shipping methods</Typography>
            }

            <FieldArrayRenderer
              {...props}
              addButtonProps={{ disabled, children: "Add Shipping Method", sx: { ml: 5.7 }, hidden: get(props.form.values, inclusionFieldName, []).length > 0 }}
              initialValue={{ fact: "shipping", path: "$.shipmentMethod.name", value: [], operator: "in" }}
              renderFieldItem={() => (
                <Stack pl={5.7}>
                  <Field
                    name={shippingMethodFieldName}
                    multiple
                    component={AutocompleteField}
                    options={data || []}
                    loading={isLoading}
                    disabled={disabled}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <InputWithLabel
                        {...params}
                        name={shippingMethodFieldName}
                        label="Methods"
                        hiddenLabel
                        placeholder="Type to select shipping method(s)"
                      />
                    )}
                  />
                </Stack>
              )}
            />
          </Paper>
        )}
      />
    </Stack>

  );
};
