import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { startCase } from "lodash-es";

import { Table, TableAction, TableContainer } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingMethodsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { FulfillmentGroup, ShippingMethod } from "types/shippingMethods";
import { Drawer } from "@components/Drawer";
import Switch from "@components/Switch";
import { SelectField } from "@components/SelectField";
import { TextField } from "@components/TextField";
import { FulfillmentType } from "@graphql/types";

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
    cell: (info) => (
      <Chip
        color="info"
        size="small"
        label={info.getValue() ? "ENABLED" : "DISABLED"}
      />
    ),
    meta: {
      align: "right"
    }
  }
];

const fulfillmentTypeOptions = Object.values(FulfillmentType).map((value) => ({
  value,
  label: startCase(value)
}));

const fulfillmentGroupOptions = Object.values(FulfillmentGroup).map((value) => ({ label: value, value }));

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

  const handleSubmit: FormikConfig<any>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    console.log({ values });
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Methods"
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.flatRateFulfillmentMethods.nodes)}
      />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Add Shipping Method"
      >
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            isEnabled: false,
            cost: 0,
            fulfillmentTypes: FulfillmentType.Shipping,
            group: FulfillmentGroup.Free,
            handling: 0,
            label: "",
            name: "",
            rate: 0
          }}
        >
          {({ isSubmitting }) => (
            <>
              <Drawer.Content>
                <Form>
                  <FormControlLabel
                    control={
                      <Field
                        component={Switch}
                        label="Enabled"
                        name="isEnabled"
                      />
                    }
                    label="Enabled"
                  />
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" gap="18px">
                    <Field
                      component={SelectField}
                      name="fulfillmentTypes"
                      label="Fulfillment Type"
                      options={fulfillmentTypeOptions}
                    />
                    <Field
                      component={SelectField}
                      name="group"
                      label="Group"
                      options={fulfillmentGroupOptions}
                    />
                  </Stack>
                  <Field
                    component={TextField}
                    name="name"
                    label="Name"
                    helperText="Internal use only"
                  />
                  <Field
                    component={TextField}
                    name="label"
                    label="Label"
                    helperText="Customer-Facing"
                  />
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Shipping & Handling Fees
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "grey.700" }}
                    gutterBottom
                  >
                    What you charge your customers to use this method
                  </Typography>
                  <Stack direction="row" gap="18px">
                    <Field
                      component={TextField}
                      name="rate"
                      label="Shipping"
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                    <Field
                      component={TextField}
                      name="handling"
                      label="Handling"
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Shipping Cost
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "grey.700" }}
                    gutterBottom
                  >
                    What this method costs your business. For internal use only.
                  </Typography>
                  <Stack direction="row" width="50%">
                    <Field
                      component={TextField}
                      name="cost"
                      label="Cost"
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </Stack>
                </Form>
              </Drawer.Content>
              <Drawer.Actions
                left={
                  <Button variant="outlined" color="error" size="small">
                    Delete
                  </Button>
                }
                right={
                  <Stack direction="row" gap={1}>
                    <Button size="small" variant="outlined" color="secondary">
                      Cancel
                    </Button>
                    <Button size="small" variant="contained">
                      Save Changes
                    </Button>
                  </Stack>
                }
              />
            </>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default ShippingMethods;
