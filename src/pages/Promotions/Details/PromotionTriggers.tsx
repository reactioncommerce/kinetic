import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Field, FieldArray } from "formik";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { TRIGGER_TYPE_OPTIONS } from "../constants";
import { Promotion } from "types/promotions";
import { AlertDialog } from "@components/Dialog";

import { EligibleItems } from "./EligibleItems";


export const PromotionTriggers = () => {
  const [activeField, setActiveField] = useState<number>();
  const handleClose = () => setActiveField(undefined);
  return (
    <Stack direction="column" mt={2} gap={2}>
      <FieldArray
        name="triggers"
        render={({ form: { values }, remove, push }) =>
          <Stack direction="column" gap={1}>
            <Typography variant="subtitle2">Customers qualify for this offer when</Typography>
            {values.triggers.map((_: Promotion["triggers"][0], index: number) =>
              <Paper key={index} variant="outlined" sx={{ padding: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <FieldArray
                    name={`triggers[${index}].triggerParameters.conditions.all`}
                    render={() =>
                      <Grid container spacing={1} width="70%">
                        <Grid item>
                          <Field
                            name={`triggers[${index}].triggerParameters.conditions.all[0].triggerType`}
                            component={SelectField}
                            hiddenLabel
                            label="Select Trigger Type"
                            options={TRIGGER_TYPE_OPTIONS}
                            autoWidth
                          />
                        </Grid>
                        <Grid item>
                          <Field
                            component={TextField}
                            name={`triggers[${index}].triggerParameters.conditions.all[0].value`}
                            label="Value"
                            type="number"
                            hiddenLabel
                            startAdornment={
                              <InputAdornment position="start">$</InputAdornment>
                            }
                            sx={{ width: "100px" }}
                          />
                        </Grid>
                      </Grid>
                    }
                  />
                  <Button variant="text" color="error" onClick={() => setActiveField(index)}>
                Remove Trigger
                  </Button>
                </Stack>
                <EligibleItems
                  inclusionFieldName={
                    `triggers[${index}].triggerParameters.inclusionRules.conditions`
                  }
                  exclusionFieldName={`triggers[${index}].triggerParameters.exclusionRules.conditions`}/>
                <AlertDialog
                  title="Delete Trigger"
                  icon={<DeleteOutlineOutlinedIcon/>}
                  content={
                    <>
                      <Typography variant="subtitle2" color="grey.600">Are you sure you want to delete this trigger?</Typography>
                      <Typography variant="subtitle2" color="grey.600">Once you save the promotion, this change cannot be undone.</Typography>
                    </>}
                  open={activeField === index}
                  handleClose={handleClose}
                  cancelText="Cancel"
                  confirmText="Delete"
                  onConfirm={() => {
                    remove(index);
                    handleClose();
                  }}
                />
              </Paper>)
            }
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => push({
                triggerKey: "offers",
                triggerParameters: {
                  name: values.name,
                  conditions: {
                    all: [{
                      triggerType: TRIGGER_TYPE_OPTIONS[0].value,
                      value: 0,
                      fact: TRIGGER_TYPE_OPTIONS[0].value.split("-")[0],
                      operator: TRIGGER_TYPE_OPTIONS[0].value.split("-")[1]
                    }]
                  }
                }
              })}
              sx={{ width: "fit-content" }}
              size="small"
            >
            Add Trigger
            </Button>
          </Stack>}
      />
    </Stack>
  );
};
