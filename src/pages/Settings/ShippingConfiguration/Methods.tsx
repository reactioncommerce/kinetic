
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { Table, TableAction, TableContainer } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingMethodsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { ShippingMethod } from "types/shippingMethods";
import { Drawer } from "@components/Drawer";
import Switch from "@components/Switch";
import { SelectField } from "@components/SelectField";
import { TextField } from "@components/TextField";


const columns: ColumnDef<ShippingMethod>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "label",
    header: "Label"
  },
  {
    accessorKey: "group",
    header: "Group"
  },
  {
    accessorKey: "rate",
    header: "S&H Fee"
  },
  {
    accessorKey: "isEnabled",
    header: "Status",
    cell: (info) => <Chip color="info" size="small" label={info.getValue() ? "ENABLED" : "DISABLED"}/>,
    meta: {
      align: "right"
    }
  }
];

const ShippingMethods = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(true);
  const { data } = useGetShippingMethodsQuery(
    client,
    { shopId: shopId! },
    {
      enabled: !!shopId
    }
  );

  const handleSubmit: FormikConfig<any>["onSubmit"] = (values, { setSubmitting }) => {
    console.log({ values });
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Methods"
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}/>
      <Table columns={columns} data={filterNodes(data?.flatRateFulfillmentMethods.nodes)}/>
      <Drawer open={open} onClose={() => setOpen(false)} title="Add Shipping Method">
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            isEnabled: false
          }}
        >
          {({ isSubmitting }) => (
            <Box
              component={Form}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <FormControlLabel
                control={
                  <Field component={Switch} label="Enabled" name="isEnabled" />
                }
                label="Enabled" />
              <Divider sx={{ mt: "20px", mb: "20px" }} />
              <Stack direction="row" gap="18px">
                <Field component={SelectField} name="fulfillmentType" label="Fulfillment Type" options={[{ value: "test", label: "test" }]}/>
                <Field component={SelectField} name="group" label="Group" options={[{ value: "test", label: "test" }]}/>
              </Stack>
              <Field component={TextField} name="name" label="Name" helperText="Internal use only"/>
              <Field component={TextField} name="label" label="Label" helperText="Customer-Facing"/>
              <Divider sx={{ mt: "20px", mb: "20px" }} />
              <Typography variant="h6" gutterBottom>Shipping & Handling Fees</Typography>
              <Typography variant="body2" sx={{ color: "grey.700" }} gutterBottom>What you charge your customers to use this method</Typography>
              <Stack direction="row" gap="18px">
                <Field component={TextField} name="shipping" label="Shipping" startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
                <Field component={TextField} name="handling" label="Handling" startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
              </Stack>
              <Divider sx={{ mt: "20px", mb: "20px" }} />
              <Typography variant="h6" gutterBottom>Shipping Cost</Typography>
              <Typography variant="body2" sx={{ color: "grey.700" }} gutterBottom>What this method costs your business. For internal use only.</Typography>
              <Stack direction="row" width="50%">
                <Field component={TextField} name="cost" label="Cost" startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
              </Stack>

            </Box>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default ShippingMethods;
