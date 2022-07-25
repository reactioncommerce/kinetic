import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Field, FieldArray, Form, Formik, FormikConfig } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import { AutocompleteRenderInputParams } from "@mui/material";
import * as Yup from "yup";

import {
  Table,
  TableAction,
  TableContainer,
  useTableState
} from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import {
  useCreateShippingSurchargeMutation,
  useDeleteShippingSurchargeMutation,
  useGetShippingMethodsQuery,
  useGetShippingSurchargesQuery,
  useUpdateShippingSurchargeMutation
} from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes, getPropertyType } from "@utils/common";
import {
  Money,
  SurchargeAttributeRestrictions,
  SurchargeAttributeRestrictionsInput,
  SurchargeDestinationRestrictions,
  SurchargeTypeEnum
} from "@graphql/types";
import { Surcharge } from "types/surcharges";
import { Drawer } from "@components/Drawer";
import { InputWithLabel, TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { AutocompleteField } from "@components/AutocompleteField";
import { countries } from "@utils/countries";
import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { SelectOptionType } from "types/common";
import { Operator } from "types/operator";

type ShippingSurchargeFormValues = {
  amount: number;
  attributes?: SurchargeAttributeRestrictions[];
  destination?: {
    country: { label: string; code: string }[];
    postal: string[];
    region: string[];
  };
  messagesByLanguage: {
    content: string;
    language: string;
  };
  methods?: SelectOptionType[];
};

const shippingSurchargeSchema = Yup.object().shape({
  amount: Yup.number().moreThan(0, "Amount must be greater than 0")
    .required("This field is required"),
  attributes: Yup.array().of(Yup.object({
    operator: Yup.string(),
    property: Yup.string(),
    value: Yup.string()
  })),
  destination: Yup.object().shape({
    country: Yup.array(),
    postal: Yup.array(),
    region: Yup.array()
  }),
  messagesByLanguage: Yup.object()
    .shape({ content: Yup.string().required("This field is required") })
    .required("This field is required"),
  methods: Yup.array()
});


const getInitialValues = ({ surcharge, shippingMethods }:{surcharge?: Surcharge, shippingMethods: SelectOptionType[]}): ShippingSurchargeFormValues => ({
  amount: surcharge?.amount.amount ?? 0,
  attributes: filterNodes(surcharge?.attributes),
  destination: surcharge?.destination ?
    {
      region: filterNodes(surcharge.destination.region),
      postal: filterNodes(surcharge.destination.postal),
      country: filterNodes(surcharge.destination.country).map((countryCode) =>
        ({ code: countryCode, label: countries.find(({ code }) => code === countryCode)?.label ?? "Unknown" }))
    } : {
      country: [],
      postal: [],
      region: []
    },
  methods: filterNodes(surcharge?.methodIds).map((id) => ({ label: shippingMethods.find((method) => method.value === id)?.label ?? "Unknown", value: id })),
  messagesByLanguage: surcharge?.messagesByLanguage ? filterNodes(surcharge.messagesByLanguage)?.[0] : {
    content: "",
    language: "en"
  }
});

const Surcharges = () => {
  const { shopId } = useShop();
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<Surcharge>();

  const columns: ColumnDef<Surcharge>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.messagesByLanguage?.[0]?.content || "--",
        header: "Nickname"
      },
      {
        accessorKey: "destination",
        header: "Destination",
        cell: (info) => {
          const rowValue = info.getValue<SurchargeDestinationRestrictions>();
          const totalCountry = rowValue?.country?.length ?? 0;
          const totalPostal = rowValue?.postal?.length ?? 0;
          const totalRegion = rowValue?.region?.length ?? 0;
          const totalDestinations = totalCountry + totalRegion + totalPostal;

          return (
            <>
              {totalDestinations === 1
                ? "1 Destination"
                : `${totalDestinations} Destinations`}
            </>
          );
        }
      },
      {
        accessorKey: "methodIds",
        header: "Methods",
        cell: (info) => (
          <>
            {info.getValue<string[]>()?.length === 1
              ? "1 Method"
              : `${info.getValue<string[]>()?.length} Methods`}
          </>
        )
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => info.getValue<Money>().displayAmount,
        meta: {
          align: "right"
        }
      }
    ],
    []
  );

  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading, refetch } = useGetShippingSurchargesQuery(
    client,
    {
      shopId: shopId!,
      first: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize
    },
    { enabled: !!shopId }
  );

  const shippingMethods = useGetShippingMethodsQuery(
    client,
    { shopId: shopId! },
    {
      enabled: !!shopId,
      select: (response) =>
        filterNodes(response.flatRateFulfillmentMethods.nodes).map(({ _id, label }) => ({ label, value: _id }))
    }
  );

  const initialValues = useMemo(
    () => getInitialValues({ surcharge: activeRow, shippingMethods: shippingMethods.data ?? [] }),
    [activeRow, shippingMethods.data]
  );

  const { mutate: create } = useCreateShippingSurchargeMutation(client);

  const { mutate: update } = useUpdateShippingSurchargeMutation(client);

  const { mutate: deleteSurcharge, isLoading: isDeleting } = useDeleteShippingSurchargeMutation(client);

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const onSuccess = () => {
    handleClose();
    refetch();
  };


  const onSubmit: FormikConfig<ShippingSurchargeFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    const surchargeData = {
      amount: values.amount,
      methodIds: values.methods?.map(({ value }) => value),
      messagesByLanguage: [values.messagesByLanguage],
      destination: {
        ...values.destination,
        country: values.destination?.country.map(({ code }) => code)
      },
      attributes: values.attributes?.map((attr) => ({ ...attr, propertyType: getPropertyType((attr.value ?? "").trim()) })),
      type: SurchargeTypeEnum.Surcharge
    };
    activeRow ?
      update(
        {
          input: {
            shopId: shopId!,
            surchargeId: activeRow._id,
            surcharge: surchargeData
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
          surcharge: surchargeData
        }
      }, {
        onSettled: () => setSubmitting(false),
        onSuccess
      });
  };

  const handleRowClick = (rowData: Surcharge) => {
    setActiveRow(rowData);
    setOpen(true);
  };

  const handleDeleteShippingSurcharge = (surchargeId: string) => {
    deleteSurcharge({ input: { surchargeId, shopId: shopId! } }, {
      onSuccess
    });
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Shipping Surcharges"
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.surcharges.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.surcharges.totalCount ?? 0}
        onRowClick={handleRowClick}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <LocalShippingOutlinedIcon
              sx={{ color: "grey.500", fontSize: "42px" }}
            />
            <div>
              <Typography variant="h6" gutterBottom>
                No Shipping Surcharges
              </Typography>
              <Typography variant="body2" color="grey.600">
                Get started by adding your first shipping surcharge.
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
        title={activeRow ? "Edit Shipping Surcharge" : "Add Shipping Surcharge"}
      >
        <Formik<ShippingSurchargeFormValues>
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={shippingSurchargeSchema}
        >
          {({ isSubmitting, touched, errors, submitForm }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Stack direction="row" width="50%" mb={2}>
                  <Field
                    component={TextField}
                    name="amount"
                    label="Amount"
                    type="number"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </Stack>
                <FormLabel>Conditions</FormLabel>
                <FieldArray
                  name="attributes"
                  render={(props) => (
                    <FieldArrayRenderer<SurchargeAttributeRestrictionsInput>
                      {...props}
                      initialValue={{ property: "", value: "", operator: "eq" }}
                      renderFieldItem={(index) => (
                        <Stack direction="row" gap={3}>
                          <Field
                            component={TextField}
                            name={`attributes[${index}].property`}
                            placeholder="Property"
                            ariaLabel="Property"
                            hiddenLabel
                          />
                          <Field
                            component={SelectField}
                            name={`attributes[${index}].operator`}
                            options={Object.values(Operator).map((value) => ({ value, label: value }))}
                            ariaLabel="Operator"
                            hiddenLabel
                          />
                          <Field
                            component={TextField}
                            name={`attributes[${index}].value`}
                            placeholder="Value"
                            ariaLabel="Value"
                            hiddenLabel
                          />
                        </Stack>
                      )}
                    />
                  )}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Destinations
                </Typography>
                <Field
                  name="destination.country"
                  multiple
                  component={AutocompleteField}
                  options={countries}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <InputWithLabel
                      {...params}
                      name="autocomplete"
                      error={touched.destination && !!errors.destination}
                      helperText={touched.destination && errors.destination}
                      label="Country"
                      placeholder="Type to enter a country"
                    />
                  )}
                />
                <Field
                  name="destination.postal"
                  multiple
                  component={AutocompleteField}
                  freeSolo
                  options={[]}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <InputWithLabel
                      {...params}
                      name="postal"
                      error={touched.destination && !!errors.destination}
                      helperText={touched.destination && errors.destination}
                      label="Postal Code"
                      placeholder="Type to enter a zip code"
                    />
                  )}
                />
                <Field
                  name="destination.region"
                  multiple
                  component={AutocompleteField}
                  freeSolo
                  options={[]}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <InputWithLabel
                      {...params}
                      name="autocomplete"
                      error={touched.destination && !!errors.destination}
                      helperText={touched.destination && errors.destination}
                      label="Region"
                      placeholder="Type to enter a region"
                    />
                  )}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Shipping Methods
                </Typography>
                <Field
                  name="methods"
                  multiple
                  component={AutocompleteField}
                  options={shippingMethods.data}
                  loading={shippingMethods.isLoading}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <InputWithLabel
                      {...params}
                      name="methodIds"
                      error={touched.methods && !!errors.methods}
                      helperText={touched.methods && errors.methods}
                      label="Methods"
                      hiddenLabel
                      placeholder="Type to select shipping method(s)"
                    />
                  )}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Storefront
                </Typography>
                <Field
                  component={TextField}
                  name="messagesByLanguage.content"
                  label="Customer Message"
                />
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeRow ? (
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteShippingSurcharge(activeRow._id)}
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

export default Surcharges;
