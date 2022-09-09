import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Field, Form, Formik, FormikConfig } from "formik";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { EmailTemplate, EmailVariables } from "types/email";
import { useGetEmailTemplatesQuery, useGetEmailVariablesQuery, useUpdateEmailTemplateMutation, useUpdateShopMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { filterNodes } from "@utils/common";
import { Drawer } from "@components/Drawer";
import { TextField } from "@components/TextField";

const emailTemplateSchema = Yup.object({
  title: Yup.string().required("This field is required."),
  subject: Yup.string().required("This field is required."),
  template: Yup.string().required("This field is required.")
});

const emailVariablesSchema = Yup.object({
  storefrontAccountProfileUrl: Yup.string().url("Please enter a valid url"),
  storefrontHomeUrl: Yup.string().url("Please enter a valid url"),
  storefrontLoginUrl: Yup.string().url("Please enter a valid url"),
  storefrontOrdersUrl: Yup.string().url("Please enter a valid url"),
  storefrontOrderUrl: Yup.string().url("Please enter a valid url")
});

type EmailTemplateFormValue = Omit<EmailTemplate, "_id">


const EmailTemplates = () => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();
  const [activeRow, setActiveRow] = useState<EmailTemplate>();
  const [openConfigurePanel, setOpenConfigurePanel] = useState(false);

  const { data, isLoading, refetch } = useGetEmailTemplatesQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize }
  );

  const emailVariables = useGetEmailVariablesQuery(
    client,
    { id: shopId! }
  );

  const { mutate } = useUpdateEmailTemplateMutation(client);
  const { mutate: updateEmailVariables } = useUpdateShopMutation(client);

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
      accessorKey: "language",
      header: "Language",
      meta: {
        align: "right"
      }
    }
  ], []);

  const handleCloseEditPanel = () => setActiveRow(undefined);
  const handleCloseConfigurePanel = () => setOpenConfigurePanel(false);

  const handleSubmitTemplate: FormikConfig<EmailTemplateFormValue>["onSubmit"] = (
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
          handleCloseEditPanel();
          refetch();
        }
      }
    );
  };

  const handleSubmitEmailVariables: FormikConfig<EmailVariables>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    updateEmailVariables({ input: { shopId: shopId!, storefrontUrls: values } }, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        handleCloseConfigurePanel();
        emailVariables.refetch();
      }
    });
  };


  const initialTemplatesValues = activeRow ?? {
    title: "",
    name: "",
    language: "",
    subject: "",
    template: ""
  };

  const initialEmailVariablesValues = emailVariables.data?.shop?.storefrontUrls ?? {
    storefrontAccountProfileUrl: "",
    storefrontHomeUrl: "",
    storefrontLoginUrl: "",
    storefrontOrdersUrl: "",
    storefrontOrderUrl: ""
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Email Templates"
        action={<TableAction onClick={() => setOpenConfigurePanel(true)}>Configure</TableAction>}
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
        onClose={handleCloseEditPanel}
        title={"Edit Email Template"}
      >
        <Formik<EmailTemplateFormValue>
          onSubmit={handleSubmitTemplate}
          initialValues={initialTemplatesValues}
          validationSchema={emailTemplateSchema}
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
                      onClick={handleCloseEditPanel}
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

      <Drawer
        open={openConfigurePanel}
        onClose={handleCloseConfigurePanel}
        title={"Configure Email Templates"}
      >
        <Formik<EmailVariables>
          onSubmit={handleSubmitEmailVariables}
          initialValues={initialEmailVariablesValues}
          validationSchema={emailVariablesSchema}
        >
          {({ isSubmitting }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Field
                  component={TextField}
                  name="storefrontHomeUrl"
                  label="Homepage URL"
                />
                <Field
                  component={TextField}
                  name="storefrontLoginUrl"
                  label="Login URL"
                />
                <Field
                  component={TextField}
                  name="storefrontOrderUrl"
                  label="Single Order Page URL"
                  helperText="In order for email links to work, you must provide an `:orderId` and `:token` in this field. These act as placeholders that are replaced with the correct data in your email template when an order email is generated. For example: http://shop.example.com/my-orders/:orderId?token=:token"
                />
                <Field
                  component={TextField}
                  name="storefrontOrdersUrl"
                  label="Orders Page URL"
                />
                <Field
                  component={TextField}
                  name="storefrontAccountProfileUrl"
                  label="Account Profile Page URL"
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
                      onClick={handleCloseConfigurePanel}
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
