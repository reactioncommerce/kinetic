import Stack from "@mui/material/Stack";
import { FieldArray } from "formik";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import Alert from "@mui/material/Alert";

import { TRIGGER_TYPE_OPTIONS } from "../constants";
import { AlertDialog } from "@components/Dialog";
import { Trigger, TriggerKeys } from "types/promotions";

import { EligibleItems } from "./EligibleItems";
import { TriggerValuesField } from "./TriggerValuesField";
import { TriggerTypeField } from "./TriggerTypeField";
import { CouponsField } from "./CouponsField";


export const PromotionTriggers = () => {
  const [activeField, setActiveField] = useState<number>();
  const handleClose = () => setActiveField(undefined);

  return (
    <Stack direction="column" mt={2} gap={2}>
      <FieldArray
        name="triggers"
        render={({ form: { values, errors, touched }, remove, push }) =>
          <Stack direction="column" gap={1}>
            <Typography variant="subtitle2">Customers qualify for this offer when</Typography>
            {values.triggers.map((_: Trigger, index: number) =>
              <Paper key={index} variant="outlined" sx={{ padding: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <FieldArray
                    name={`triggers[${index}].triggerParameters.conditions.all`}
                    render={() =>
                      <Grid container spacing={1} width="70%">
                        <TriggerTypeField fieldName={`triggers[${index}].triggerParameters.conditions.all[0].triggerType`} index={index}/>
                        <TriggerValuesField trigger={values.triggers[index]} index={index}/>
                      </Grid>
                    }
                  />
                  <Button variant="text" color="error" onClick={() => setActiveField(index)}>
                Remove Trigger
                  </Button>
                </Stack>
                {values.triggers[index].triggerKey === TriggerKeys.Coupons ? <CouponsField index={index}/> : null}
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
            {!values.triggers.length ? <Button
              color="secondary"
              variant="outlined"
              onClick={() => push({
                triggerKey: TriggerKeys.Offers,
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
            </Button> : null}
            {touched.triggers && errors.triggers && typeof errors.triggers === "string" ? <Alert severity="error">{errors.triggers}</Alert> : null}
          </Stack>}
      />
    </Stack>
  );
};
