import Button from "@mui/material/Button";
import { useState } from "react";
import { Form, Formik, FormikConfig } from "formik";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import { Drawer } from "@components/Drawer";

import { Card } from "./Card";

export type EditableCardProps<T> = {
  cardTitle: string
  cardContent: JSX.Element
  formContent: JSX.Element
  formTitle: string
  formConfig: Omit<FormikConfig<T>, "onSubmit">
  onSubmit: (props: {values: T, setDrawerOpen: (value: boolean) => void, setSubmitting: (value: boolean) => void}) => void
}


export const EditableCard = <T, >({ cardTitle, cardContent, formContent, formTitle, formConfig, onSubmit }: EditableCardProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleSubmit: FormikConfig<T>["onSubmit"] = (values, { setSubmitting }) => {
    onSubmit({ values, setDrawerOpen: setOpen, setSubmitting });
  };
  return (
    <>
      <Card title={cardTitle} action={<Button variant="text" onClick={() => setOpen(true)}>Edit</Button>}>
        {cardContent}
      </Card>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={formTitle}
      >
        <Formik<T>
          onSubmit={handleSubmit}
          {...formConfig}
        >
          {({ isSubmitting }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                {formContent}
              </Drawer.Content>
              <Drawer.Actions
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={() => setOpen(false)}
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
    </>
  );
};
