
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import Box from "@mui/material/Box";
import { FormControlLabel } from "@mui/material";

import { Table, TableAction, TableContainer } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetShippingMethodsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/filterEdges";
import { ShippingMethod } from "types/shippingMethods";
import { Drawer } from "@components/Drawer";
import Switch from "@components/Switch";


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
  const [open, setOpen] = useState(false);
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
                  <Field component={Switch}
                    label="Enabled"
                    autoComplete="isEnabled" />
                }
                label="Enabled" />
            </Box>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default ShippingMethods;
