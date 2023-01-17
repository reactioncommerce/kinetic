import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { Field } from "formik";

import { TextField } from "@components/TextField";
import { Trigger, TriggerKeys, TriggerType } from "types/promotions";

type TriggerValuesFieldProps = {
  trigger: Trigger
  index: number
  disabled: boolean
}

export const TriggerValuesField = ({ trigger, index, disabled }: TriggerValuesFieldProps) => {
  const triggerType = trigger.triggerKey === TriggerKeys.Offers ? trigger.triggerParameters?.conditions.all?.[0].triggerType?.split("-")[0] : null;

  const fieldComponentMap: Record<string, JSX.Element> = {
    [TriggerType.ItemAmount]: <Field
      component={TextField}
      name={`triggers[${index}].triggerParameters.conditions.all[0].value`}
      label="Value"
      ariaLabel="Trigger Value"
      type="number"
      hiddenLabel
      startAdornment={
        <InputAdornment position="start">$</InputAdornment>
      }
      sx={{ width: "100px" }}
      disabled={disabled}
    />,
    [TriggerType.ItemCount]: <Field
      component={TextField}
      name={`triggers[${index}].triggerParameters.conditions.all[0].value`}
      label="Number of items required in cart"
      ariaLabel="Number of items required in cart"
      type="number"
      hiddenLabel
      endAdornment={
        <InputAdornment position="end">items</InputAdornment>
      }
      sx={{ width: "130px" }}
      disabled={disabled}
    />
  };

  return triggerType ?
    (
      <Grid item>{fieldComponentMap[triggerType]}</Grid>
    )
    : null;
};
