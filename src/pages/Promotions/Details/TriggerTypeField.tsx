import Grid from "@mui/material/Grid";
import { Field, FieldProps, useFormikContext } from "formik";

import { SelectField } from "@components/SelectField";
import { TRIGGER_TYPE_OPTIONS } from "../constants";
import { Promotion, TriggerKeys, TriggerType } from "types/promotions";

type TriggerTypeFieldProps = {
  fieldName: string
  index: number
}

export const TriggerTypeField = ({ fieldName, index }: TriggerTypeFieldProps) => {
  const { setFieldValue } = useFormikContext<Promotion>();
  const onTriggerTypeChange = (value: string) => {
    setFieldValue(fieldName, value);
    if (value.split("-")[0] === TriggerType.CouponStandard) {
      setFieldValue(`triggers[${index}].triggerKey`, TriggerKeys.Coupons);
    } else {
      setFieldValue(`triggers[${index}].triggerKey`, TriggerKeys.Offers);
      setFieldValue(`triggers[${index}].triggerParameters.couponCode`, undefined);
      setFieldValue(`triggers[${index}].triggerParameters.conditions.all[0].value`, 0);
    }
  };

  return (
    <Grid item>
      <Field name={fieldName}>
        {(props: FieldProps) =>
          <SelectField
            {...props}
            hiddenLabel
            label="Select Trigger Type"
            options={TRIGGER_TYPE_OPTIONS}
            onChange={(event) => onTriggerTypeChange(event.target.value as string)}
            autoWidth
          />}
      </Field>

    </Grid>
  );
};
