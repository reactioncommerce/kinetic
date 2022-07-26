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
  SurchargeTypeEnum
} from "@graphql/types";
import { Surcharge } from "types/surcharges";
import { Drawer } from "@components/Drawer";
import { TextField } from "@components/TextField";
import { CountryType } from "@utils/countries";
import { FieldArrayRenderer } from "@components/FieldArrayRenderer";
import { SelectOptionType } from "types/common";
import { DestinationCell } from "../components/DestinationCell";
import { MethodCell } from "../components/MethodCell";
import { OperatorsField } from "../components/OperatorsField";
import { DestinationField, getInitialDestinationValue } from "../components/DestinationField";
import { ShippingMethodsField } from "../components/ShippingMethodsField";


type ShippingSurchargeFormValues = {
  amount: number;
  attributes?: SurchargeAttributeRestrictions[];
  destination?: {
    country: Pick<CountryType, "code" | "label">[];
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
    operator: Yup.string().required("This field is required"),
    property: Yup.string().required("This field is required"),
    value: Yup.string().required("This field is required")
  })),
  messagesByLanguage: Yup.object()
    .shape({ content: Yup.string().required("This field is required") })
    .required("This field is required")
});


const getInitialValues = ({ surcharge, shippingMethods }:{surcharge?: Surcharge, shippingMethods: SelectOptionType[]}): ShippingSurchargeFormValues => ({
  amount: surcharge?.amount.amount ?? 0,
  attributes: filterNodes(surcharge?.attributes),
  destination: getInitialDestinationValue(surcharge?.destination),
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
        cell: (info) => <DestinationCell data={info.getValue()} />
      },
      {
        accessorKey: "methodIds",
        header: "Methods",
        cell: (info) => <MethodCell data={info.getValue()} />
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
        filterNodes(response.flatRateFulfillmentMethods.nodes).map(({ _id, name }) => ({ label: name, value: _id }))
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
                        <OperatorsField index={index} />
                      )}
                    />
                  )}
                />

                <Divider sx={{ my: 2 }} />
                <DestinationField isInvalid={touched.destination && !!errors.destination} errors={touched.destination ? errors.destination : undefined} />
                <Divider sx={{ my: 2 }} />
                <ShippingMethodsField
                  shippingMethodOptions={shippingMethods.data}
                  isLoading={shippingMethods.isLoading}
                  isInvalid={touched.methods && !!errors.methods}
                  errors={touched.methods ? errors.methods : undefined}
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
