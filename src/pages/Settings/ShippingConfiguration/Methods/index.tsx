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
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import {
  useCreateFlatRateFulfillmentMethodMutation,
  useGetShippingMethodsQuery,
  useUpdateFlatRateFulfillmentMethodMutationMutation
} from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { FulfillmentGroup, ShippingMethod } from "types/shippingMethods";
import { Drawer } from "@components/Drawer";
import Switch from "@components/Switch";
import { SelectField } from "@components/SelectField";
import { TextField } from "@components/TextField";
import {
  FlatRateFulfillmentMethodInput,
  FulfillmentType
} from "@graphql/types";

type ShippingMethodFormValues = Omit<
  FlatRateFulfillmentMethodInput,
  "fulfillmentTypes"
> & {
  fulfillmentTypes: FulfillmentType;
};

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
        color={info.getValue() ? "success" : "warning"}
        size="small"
        label={info.getValue() ? "ENABLED" : "DISABLED"}
      />
    ),
    meta: {
      align: "right"
    }
  }
];

const shippingMethodSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  label: Yup.string().required("This field is required"),
  cost: Yup.number(),
  group: Yup.string().required("This field is required"),
  handling: Yup.number().required("This field is required"),
  rate: Yup.number().required("This field is required"),
  isEnabled: Yup.boolean().required("This field is required"),
  fulfillmentTypes: Yup.string()
    .oneOf(Object.values(FulfillmentType))
    .required("This field is required")
});

const fulfillmentTypeOptions = Object.values(FulfillmentType).map((value) => ({
  value,
  label: startCase(value)
}));

const fulfillmentGroupOptions = Object.values(FulfillmentGroup).map((value) => ({ label: value, value }));


const getFormInitialValues = (shippingMethod?: ShippingMethod): ShippingMethodFormValues => ({
  isEnabled: shippingMethod?.isEnabled ?? false,
  cost: shippingMethod?.cost ?? 0,
  fulfillmentTypes: shippingMethod?.fulfillmentTypes[0] ?? FulfillmentType.Shipping,
  group: shippingMethod?.group ?? FulfillmentGroup.Free,
  handling: shippingMethod?.handling ?? 0,
  label: shippingMethod?.label ?? "",
  name: shippingMethod?.name ?? "",
  rate: shippingMethod?.rate ?? 0
});

const ShippingMethods = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<ShippingMethod>();

  const { pagination, handlePaginationChange } = useTableState();

  const { data, refetch, isLoading } = useGetShippingMethodsQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize },
    {
      enabled: !!shopId,
      keepPreviousData: true
    }
  );

  const { mutate: create } = useCreateFlatRateFulfillmentMethodMutation(client);

  const { mutate: update } =
    useUpdateFlatRateFulfillmentMethodMutationMutation(client);

  const handleSubmit: FormikConfig<ShippingMethodFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    const onSuccess = () => {
      setOpen(false);
      refetch();
    };

    const method = { ...values, fulfillmentTypes: [values.fulfillmentTypes] };

    activeRow
      ? update(
        {
          input: {
            shopId: shopId!,
            methodId: activeRow._id,
            method
          }
        },
        { onSettled: () => setSubmitting(false), onSuccess }
      )
      : create(
        {
          input: {
            shopId: shopId!,
            method
          }
        },
        {
          onSettled: () => setSubmitting(false),
          onSuccess
        }
      );
  };

  const handleRowClick = (rowData: ShippingMethod) => {
    setActiveRow(rowData);
    setOpen(true);
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
        onRowClick={handleRowClick}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
      />
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveRow(undefined);
        }}
        title="Add Shipping Method"
      >
        <Formik<ShippingMethodFormValues>
          onSubmit={handleSubmit}
          initialValues={
            getFormInitialValues(activeRow)
          }
          validationSchema={shippingMethodSchema}
        >
          {({ isSubmitting }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
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
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeRow ? (
                    <Button variant="outlined" color="error" size="small">
                      Delete
                    </Button>
                  ) : null
                }
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      size="small"
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                    >
                      Save Changes
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default ShippingMethods;
