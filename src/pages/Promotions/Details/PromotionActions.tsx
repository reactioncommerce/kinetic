import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Field, FieldArray } from "formik";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Promotion, PromotionType } from "types/promotions";
import { CALCULATION_OPTIONS, DISCOUNT_TYPES_MAP } from "../constants";
import { AlertDialog } from "@components/Dialog";

import { EligibleItems } from "./EligibleItems";

type Action = Promotion["actions"][0]

const getSymbolBasedOnType = (action: Action) => {
  const calculationType = action.actionParameters?.discountCalculationType;
  return calculationType ? CALCULATION_OPTIONS[calculationType].symbol : "%";
};

export const PromotionActions = () => {
  const [activeField, setActiveField] = useState<number>();
  const handleClose = () => setActiveField(undefined);

  return (
    <Stack direction="column" mt={2} gap={2}>
      <FieldArray
        name="actions"
        render={({ form: { values }, remove, push }) =>
          <Stack direction="column" gap={1}>
            <Typography variant="subtitle2">Select an action for your promotion</Typography>
            {values.actions.map((_: Action, index: number) =>
              <Paper key={index} variant="outlined" sx={{ padding: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="flex-start" gap={1} justifyContent="flex-start">
                    <Field
                      name={`actions[${index}].actionParameters.discountCalculationType`}
                      component={SelectField}
                      hiddenLabel
                      label="Select Action Calculate Type"
                      options={Object.values(CALCULATION_OPTIONS)}
                    />
                    <Field
                      component={TextField}
                      name={`actions[${index}].actionParameters.discountValue`}
                      label="Discount Value"
                      type="number"
                      hiddenLabel
                      startAdornment={
                        <InputAdornment position="start">{getSymbolBasedOnType(values.actions[index])}</InputAdornment>
                      }
                    />
                  </Stack>
                  <Button variant="text" color="error" onClick={() => setActiveField(index)}>
                  Remove Action
                  </Button>
                </Stack>
                <EligibleItems
                  inclusionFieldName={
                    `actions[${index}].actionParameters.inclusionRules.conditions.all`
                  }
                  exclusionFieldName={`actions[${index}].actionParameters.exclusionRules.conditions.all`}
                />
                <AlertDialog
                  title="Delete Action"
                  icon={<DeleteOutlineOutlinedIcon/>}
                  content={
                    <>
                      <Typography variant="subtitle2" color="grey.600">Are you sure you want to delete this action?</Typography>
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
            {!values.actions.length ?
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => push({
                  actionKey: "noop",
                  actionParameters: {
                    discountValue: 0,
                    discountCalculationType: "percentage",
                    discountType: DISCOUNT_TYPES_MAP[values.promotionType as PromotionType],
                    inclusionRules: {
                      conditions: { all: [] }
                    }
                  }
                })}
                sx={{ width: "fit-content" }}
                size="small"
              >
              Add Action
              </Button> : null}
          </Stack>}
      />
    </Stack>
  );
};
