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
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";

import { useShop } from "@containers/ShopProvider";
import { ShippingRestriction } from "types/shippingRestrictions";
import { DestinationCell } from "../components/DestinationCell";
import { MethodCell } from "../components/MethodCell";
import { AttributeRestrictionsInput, RestrictionTypeEnum } from "@graphql/types";
import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useCreateShippingRestrictionMutation, useDeleteShippingRestrictionMutation,
  useGetShippingMethodsQuery,
  useGetShippingRestrictionsQuery,
  useUpdateShippingRestrictionMutation }
  from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes, getPropertyType } from "@utils/common";
import { Drawer } from "@components/Drawer";
import { SelectField } from "@components/SelectField";
import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { OperatorsField } from "../components/OperatorsField";
import { DestinationField, getInitialDestinationValue } from "../components/DestinationField";
import { ShippingMethodsField } from "../components/ShippingMethodsField";
import { CountryType } from "@utils/countries";
import { SelectOptionType } from "types/common";

type ShippingRestrictionFormValues = {
  type: RestrictionTypeEnum;
  attributes?: AttributeRestrictionsInput[];
  destination?: {
    country: Pick<CountryType, "code" | "label">[];
    postal: string[];
    region: string[];
  };
  methods?: SelectOptionType[];
};

const shippingRestrictionSchema = Yup.object().shape({
  attributes: Yup.array().of(Yup.object({
    operator: Yup.string().required("This field is required"),
    property: Yup.string().required("This field is required"),
    value: Yup.string().required("This field is required")
  }))
});


const getInitialValues = ({ restriction, shippingMethods }:
  {restriction?: ShippingRestriction, shippingMethods: SelectOptionType[]}): ShippingRestrictionFormValues => ({
  attributes: filterNodes(restriction?.attributes),
  destination: getInitialDestinationValue(restriction?.destination),
  methods: filterNodes(restriction?.methodIds).map((id) => ({ label: shippingMethods.find((method) => method.value === id)?.label ?? "Unknown", value: id })),
  type: restriction?.type ?? RestrictionTypeEnum.Allow
});

const OperatorsTooltipTitle = ({ attributes }: {attributes: AttributeRestrictionsInput[]}) =>
  <>{attributes.map((attr, index) => <Typography variant="body2" key={index}>{`${attr.property} ${attr.operator} ${attr.value}`}</Typography>)}</>;

const Restrictions = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<ShippingRestriction>();

  const columns: ColumnDef<ShippingRestriction>[] = useMemo(
    () => [
      {
        accessorKey: "attributes",
        header: "Conditions",
        cell: (info) => {
          const attributes = info.getValue<AttributeRestrictionsInput[]>();
          if (attributes.length === 0) return "0 Conditions";
          const firstCondition = `${attributes[0].property} ${attributes[0].operator} ${attributes[0].value}`;
          const totalRemainConditions = attributes.length - 1;

          return totalRemainConditions > 0 ?
            <Tooltip placement="bottom-start" title={<OperatorsTooltipTitle attributes={attributes}/>}>
              <Typography variant="body2">{`${firstCondition} ${totalRemainConditions > 0 ? `+ ${totalRemainConditions} condition(s)` : ""}`}
              </Typography>
            </Tooltip>
            : <Typography variant="body2">{firstCondition}</Typography>;
        }
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

  const { data, isLoading, refetch } = useGetShippingRestrictionsQuery(client, {
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
        filterNodes(response.flatRateFulfillmentMethods.nodes).map(({ _id, name }) => ({ label: name, value: _id }))
    }
  );

  const initialValues = useMemo(
    () => getInitialValues({ restriction: activeRow, shippingMethods: shippingMethods.data ?? [] }),
    [activeRow, shippingMethods.data]
  );

  const { mutate: create } = useCreateShippingRestrictionMutation(client);
  const { mutate: update } = useUpdateShippingRestrictionMutation(client);

  const { mutate: deleteRestriction, isLoading: isDeleting } = useDeleteShippingRestrictionMutation(client);

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const handleRowClick = (rowData: ShippingRestriction) => {
    setActiveRow(rowData);
    setOpen(true);
  };


  const onSuccess = () => {
    handleClose();
    refetch();
  };


  const onSubmit: FormikConfig<ShippingRestrictionFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    const restriction = {
      type: values.type,
      methodIds: values.methods?.map(({ value }) => value),
      destination: {
        ...values.destination,
        country: values.destination?.country.map(({ code }) => code)
      },
      attributes: values.attributes?.map((attr) => ({ ...attr, propertyType: getPropertyType((attr.value ?? "").trim()) }))
    };

    activeRow ?
      update(
        {
          input: {
            shopId: shopId!,
            restrictionId: activeRow._id,
            restriction
          }
        },
        {
          onSettled: () => setSubmitting(false),
          onSuccess
        }
      ) :
      create({
        input: {
          shopId: shopId!,
          restriction
        }
      }, {
        onSettled: () => setSubmitting(false),
        onSuccess
      });
  };

  const handleDeleteShippingRestriction = (restrictionId: string) => {
    deleteRestriction({ input: { restrictionId, shopId: shopId! } }, {
      onSuccess
    });
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
        onRowClick={handleRowClick}
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
        <Formik<ShippingRestrictionFormValues>
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={shippingRestrictionSchema}
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
                <DestinationField
                  isInvalid={touched.destination && !!errors.destination}
                  errors={touched.destination ? errors.destination : undefined}
                />
                <Divider sx={{ my: 2 }} />
                <ShippingMethodsField
                  shippingMethodOptions={shippingMethods.data}
                  isLoading={shippingMethods.isLoading}
                  isInvalid={touched.methods && !!errors.methods}
                  errors={touched.methods ? errors.methods : ""}
                />
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeRow ? (
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteShippingRestriction(activeRow._id)}
                      loading={isDeleting}
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
