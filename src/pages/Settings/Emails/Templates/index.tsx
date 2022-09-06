import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { EmailTemplate } from "types/email";
import { useGetEmailTemplatesQuery, useUpdateEmailTemplateMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { filterNodes } from "@utils/common";
import { Drawer } from "@components/Drawer";
import { TextField } from "@components/TextField";

type EmailTemplateFormValue = Omit<EmailTemplate, "_id">

const EmailTemplates = () => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();
  const [activeRow, setActiveRow] = useState<EmailTemplate>();

  const { data, isLoading, refetch } = useGetEmailTemplatesQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize }
  );

  const { mutate } = useUpdateEmailTemplateMutation(client);
  const columns = useMemo((): ColumnDef<EmailTemplate>[] => [
    {
      accessorKey: "title",
      header: "Title"
    },
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "subject",
      header: "Subject"
    },
    {
      accessorKey: "language",
      header: "Language",
      meta: {
        align: "right"
      }
    }
  ], []);

  const handleClose = () => setActiveRow(undefined);

  const handleSubmit: FormikConfig<EmailTemplateFormValue>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    activeRow && mutate(
      {
        input: {
          shopId: shopId!,
          id: activeRow._id,
          title: values.title,
          template: values.template,
          subject: values.subject
        }
      },
      {
        onSettled: () => setSubmitting(false),
        onSuccess: () => {
          handleClose();
          refetch();
        }
      }
    );
  };
  const initialValues = activeRow ?? {
    title: "",
    name: "",
    language: "",
    subject: "",
    template: ""
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Email Templates"
        action={<TableAction>Configure</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.emailTemplates?.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.emailTemplates?.totalCount}
        maxHeight={600}
        onRowClick={setActiveRow}
      />
      <Drawer
        open={!!activeRow}
        onClose={handleClose}
        title={"Edit Email Template"}
      >
        <Formik<EmailTemplateFormValue>
          onSubmit={handleSubmit}
          initialValues={initialValues}
          // validationSchema={shippingMethodSchema}
        >
          {({ isSubmitting }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Field
                  component={TextField}
                  name="title"
                  label="Title"
                />
                <Stack direction="row" gap={3}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Name"
                    disabled
                  />
                  <Field
                    component={TextField}
                    name="language"
                    label="Language"
                    disabled
                  />
                </Stack>
                <Field
                  component={TextField}
                  name="subject"
                  label="Subject"
                />
                <Field
                  component={TextField}
                  name="template"
                  label="Template"
                  multiline
                />
              </Drawer.Content>
              <Drawer.Actions
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

export default EmailTemplates;
