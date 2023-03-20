import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Field, Form, Formik } from "formik";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { Location, LocationType, StoreHours } from "types/location";
import { LocationAddress, useGetLocationsQuery } from "@graphql/generates";
import { filterNodes } from "@utils/common";
import { client } from "@graphql/graphql-request-client";
import { Drawer } from "@components/Drawer";
import { InputWithLabel, PhoneNumberField, TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Switch } from "@components/Switch";
import { AddressField } from "@components/AddressField";
import { countries, getRegion } from "@utils/countries";
import { AutocompleteField, isOptionEqualToValue } from "@components/AutocompleteField";
import { SelectOptionType } from "types/common";

import { formatStoreHours, fulfillmentMethodOptions, locationSchema, pluralTitleMapping, titleMapping } from "./utils";
import { StoreHoursField } from "./StoreHoursField";

type LocationsProps = {
  type: LocationType
}

type LocationFormValues = Pick<Location, "name" | "identifier" | "phoneNumber" | "localFulfillmentOnly"> & {
 address: {
  address1: string,
  address2: string,
  city: string,
  region?: SelectOptionType | null,
  postal?: string | null,
  country?: SelectOptionType | null
 }
 storeHours: StoreHours
}


const Locations = ({ type }: LocationsProps) => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<Location>();

  const { data: { locations = [], totalCount } = {}, isLoading } = useGetLocationsQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize, filter: { type } },
    {
      enabled: !!shopId,
      keepPreviousData: true,
      select: (response) => ({ locations: filterNodes(response.locations?.nodes) as Location[], totalCount: response.locations?.totalCount })
    }
  );

  const columns = useMemo((): ColumnDef<Location>[] => [
    {
      accessorKey: "identifier",
      header: "Identifier"
    },
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "address",
      header: "City, Region",
      cell: (info) => {
        const address = info.getValue<LocationAddress>();
        return <Typography>
          {`${address.city}, ${address.region}`}
        </Typography>;
      }
    },
    {
      accessorKey: "enabled",
      header: "Active",
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
  ], []);

  const handleSubmitLocation = () => {

  };

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const country = countries.find(({ value }) => value === activeRow?.address.country) || null;
  const region = getRegion({ countryCode: country?.value, regionCode: activeRow?.address.region });

  const initialValues = {
    name: activeRow?.name || "",
    identifier: activeRow?.identifier || "",
    type: activeRow?.type || type,
    enabled: activeRow?.enabled ?? false,
    address: activeRow ? {
      ...activeRow.address,
      country,
      region,
      address2: activeRow.address.address2 || ""
    } : {
      address1: "",
      address2: "",
      country: null,
      region: null,
      postal: "",
      city: ""
    },
    phoneNumber: activeRow?.phoneNumber || "",
    localFulfillmentOnly: activeRow?.localFulfillmentOnly ?? false,
    storeHours: formatStoreHours(activeRow?.storeHours)
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title={pluralTitleMapping[type]}
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}
      />
      <Table<Location>
        columns={columns}
        data={locations}
        totalCount={totalCount}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <LocationOnIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Locations</Typography>
              <Typography variant="body2" color="grey.600">Get started by adding your first location.</Typography>
            </div>
            <Button variant="contained" size="small" sx={{ width: "120px" }} onClick={() => setOpen(true)}>
             Add
            </Button>

          </Stack>}
      />

      <Drawer
        open={open}
        onClose={handleClose}
        title={activeRow ? `Edit ${titleMapping[type]}` : `Add ${titleMapping[type]}`}
      >
        <Formik<LocationFormValues>
          onSubmit={handleSubmitLocation}
          initialValues={initialValues}
          validationSchema={locationSchema}
        >
          {({ isSubmitting, dirty, handleSubmit, values }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Stack direction="row" gap="18px">
                  <Field
                    component={TextField}
                    name="identifier"
                    label="Location Identifier"
                    helperText="Internal use only"
                  />
                  <Field
                    component={TextField}
                    name="name"
                    label="Location Name"
                    helperText="Customer-Facing"
                  />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Grid container alignItems="flex-end" spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      component={SelectField}
                      name="type"
                      label="Type"
                      options={Object.values(LocationType).map((locationType) => ({ label: titleMapping[locationType], value: locationType }))}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Stack direction="row" gap={2} mb={2}>
                      <FormControlLabel
                        control={
                          <Field
                            component={Switch}
                            label="Active"
                            name="enabled"
                          />
                        }
                        label="Active"
                      />
                      <FormControlLabel
                        control={
                          <Field
                            component={Switch}
                            label="Local Fulfillment Only"
                            name="localFulfillmentOnly"
                          />
                        }
                        label="Local Fulfillment Only"
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Stack direction="column">
                  <Field name="address.address1" component={TextField} label="Address Line 1" />
                  <Field name="address.address2" component={TextField} label="Address Line 2" />
                  <Stack direction="row" gap={2}>
                    <AddressField
                      countryFieldProps={{ name: "address.country", label: "Country" }} regionFieldProps={{ name: "address.region", label: "Region" }}/>
                  </Stack>

                  <Stack direction="row" gap={2}>
                    <Field name="address.city" component={TextField} label="City" />
                    <Field name="address.postal" component={TextField} label="Postal"/>
                  </Stack>
                  <Field name="phoneNumber" component={PhoneNumberField} label="Phone Number" />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fulfillment Methods
                </Typography>
                <Field
                  name="fulfillmentMethods"
                  multiple
                  component={AutocompleteField}
                  options={fulfillmentMethodOptions}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <InputWithLabel
                      {...params}
                      name="fulfillmentMethods"
                      label="Fulfillment Methods"
                      hiddenLabel
                      placeholder="Select fulfillment method(s)"
                    />
                  )}
                />
                <Divider sx={{ my: 2 }} />
                <StoreHoursField storeHours={values.storeHours}/>
              </Drawer.Content>
              <Drawer.Actions
                left={
                  activeRow ? (
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      size="small"
                      loading={false}
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
                      type="submit"
                      loading={isSubmitting}
                      disabled={!dirty}
                      onClick={() => handleSubmit()}
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

export default Locations;
