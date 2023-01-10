import Grid from "@mui/material/Grid";
import { Field, useFormikContext } from "formik";

import { SelectField } from "@components/SelectField";
import { TRIGGER_TYPE_OPTIONS } from "../constants";
import { Promotion, Trigger, TriggerKeys } from "types/promotions";

type TriggerTypeFieldProps = {
  index: number
  trigger: Trigger

}

export const TriggerTypeField = ({ index, trigger }: TriggerTypeFieldProps) => {
  const { setFieldValue } = useFormikContext<Promotion>();

  return (
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
  );
};
