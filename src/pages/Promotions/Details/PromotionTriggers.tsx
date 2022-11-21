import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Field, FieldArray } from "formik";
import Grid from "@mui/material/Grid";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Promotion, PromotionType } from "types/promotions";
import { TRIGGER_TYPE_OPTIONS } from "../constants";

import { PromotionFieldArray } from "./PromotionFieldArray";
import { EligibleItems } from "./EligibleItems";


type PromotionTriggersProps = {
  triggers: Promotion["triggers"]
  promotionType: PromotionType
}

export const PromotionTriggers = ({ triggers, promotionType }: PromotionTriggersProps) => (
  <Stack direction="column" mt={2} gap={2}>
    <FieldArray
      name="actions"
      render={(props) =>
        <PromotionFieldArray
          {...props}
          renderFieldItem={() => <EligibleItems/>}
          label="Customers qualify for this offer when"
          addButtonLabel="Add Trigger"
          removeButtonLabel="Remove Trigger"
          renderHeaderField={(index) =>
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
          }
          initialValue={{
            triggerKey: "offers",
            triggerParameters: {
              conditions: {
                all: [{
                  triggerType: TRIGGER_TYPE_OPTIONS[0].value,
                  value: 0
                }]
              }
            }
          }}
        />}
    />
  </Stack>
);
