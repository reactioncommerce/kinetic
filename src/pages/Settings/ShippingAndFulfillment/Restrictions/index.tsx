import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Field, FieldArray, Form, Formik, FormikConfig } from "formik";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import { startCase } from "lodash-es";

import { useShop } from "@containers/ShopProvider";
import { ShippingRestriction } from "types/shippingRestrictions";
import { DestinationCell } from "../components/DestinationCell";
import { MethodCell } from "../components/MethodCell";
import { AttributeRestrictionsInput, RestrictionTypeEnum } from "@graphql/types";
import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useGetShippingMethodsQuery, useGetShippingRestrictionsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Drawer } from "@components/Drawer";
import { SelectField } from "@components/SelectField";
import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { OperatorsField } from "../components/OperatorsField";
import { DestinationField } from "../components/DestinationField";
import { ShippingMethodsField } from "../components/ShippingMethodsField";

const Restrictions = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<ShippingRestriction>();

  const columns: ColumnDef<ShippingRestriction>[] = useMemo(
    () => [
      {
        accessorKey: "attributes",
        header: "Conditions",
        cell: () => "--"
      },
      {
        accessorKey: "destination",
        header: "Destination",
        cell: (info) => <DestinationCell data={info.getValue()} />
      },
      {
        accessorKey: "methodIds",
        header: "Methods",
        cell: (info) => <MethodCell data={info.getValue()} />
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: (info) => {
          const type = info.getValue<RestrictionTypeEnum>();
          return (
            <Chip
              color={type === RestrictionTypeEnum.Allow ? "success" : "error"}
              size="small"
              label={type === RestrictionTypeEnum.Allow ? "ALLOW" : "DENY"}
            />
          );
        },
        meta: {
          align: "right"
        }
      }
    ],
    []
  );

  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading } = useGetShippingRestrictionsQuery(client, {
    shopId: shopId!,
    first: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize
  }, { enabled: !!shopId });

  const shippingMethods = useGetShippingMethodsQuery(
    client,
    { shopId: shopId! },
    {
      enabled: !!shopId,
      select: (response) =>
        filterNodes(response.flatRateFulfillmentMethods.nodes).map(({ _id, label }) => ({ label, value: _id }))
    }
  );

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const onSubmit: FormikConfig<any>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
  };


  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Restrictions"
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.getFlatRateFulfillmentRestrictions.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.getFlatRateFulfillmentRestrictions.totalCount ?? 0}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <LocalShippingOutlinedIcon
              sx={{ color: "grey.500", fontSize: "42px" }}
            />
            <div>
              <Typography variant="h6" gutterBottom>
                No Shipping Restrictions
              </Typography>
              <Typography variant="body2" color="grey.600">
                Get started by adding your first shipping restriction.
              </Typography>
            </div>
            <Button
              variant="contained"
              size="small"
              sx={{ width: "120px" }}
              onClick={() => setOpen(true)}
            >
              Add
            </Button>
          </Stack>
        }
      />
      <Drawer
        open={open}
        onClose={handleClose}
        title={activeRow ? "Edit Shipping Restriction" : "Add Shipping Restriction"}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            type: RestrictionTypeEnum.Allow,
            destination: {
              country: [],
              postal: [],
              region: []
            },
            methods: [],
            attributes: []
          }}
        >
          {({ isSubmitting, touched, errors, submitForm }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Stack direction="row" width="50%" mb={2}>
                  <Field
                    component={SelectField}
                    name="type"
                    label="Type"
                    options={Object.values(RestrictionTypeEnum).map((value) => ({ value, label: startCase(value) }))}
                  />
                </Stack>
                <FormLabel>Conditions</FormLabel>
                <FieldArray
                  name="attributes"
                  render={(props) => (
                    <FieldArrayRenderer<AttributeRestrictionsInput>
                      {...props}
                      initialValue={{ property: "", value: "", operator: "eq", propertyType: "string" }}
                      renderFieldItem={(index) => (
                        <OperatorsField index={index}/>
                      )}
                    />
                  )}
                />

                <Divider sx={{ my: 2 }} />
                <DestinationField isInvalid={touched.destination && !!errors.destination} />

                <Divider sx={{ my: 2 }} />
                <ShippingMethodsField
                  shippingMethodOptions={shippingMethods.data}
                  isLoading={shippingMethods.isLoading} isInvalid={touched.methods && !!errors.methods} />
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeRow ? (
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      size="small"
                      // onClick={() => handleDeleteShippingSurcharge(activeRow._id)}
                      // loading={isDeleting}
                      disabled={isSubmitting}
                    >
                      Delete
                    </LoadingButton>
                  ) : null
                }
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      size="small"
                      variant="contained"
                      loading={isSubmitting}
                      onClick={submitForm}
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

export default Restrictions;
