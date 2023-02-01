import { FastField, useFormikContext } from "formik";
import Stack from "@mui/material/Stack";
import { ChangeEventHandler } from "react";
import Box from "@mui/material/Box";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { COUPON_USAGE } from "../constants";

export type CouponsFieldProps = {
  index: number
  disabled: boolean
}

export const CouponsField = ({ index, disabled }: CouponsFieldProps) => {
  const { setFieldValue } = useFormikContext();

  const onChangeCouponCode: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFieldValue(`triggers[${index}].triggerParameters.code`, event.target.value.toUpperCase());
  };

  return (
    <Stack direction="column" mb={1}>
      <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 }, alignItems: { md: "flex-end" } }}>
        <FastField
          component={TextField}
          name={`triggers[${index}].triggerParameters.name`}
          label="Give your coupon a name"
        />
        <FastField
          component={TextField}
          onChange={onChangeCouponCode}
          name={`triggers[${index}].triggerParameters.code`}
          label="Enter the coupon code (avoid characters like I, L, 0, and O)"
          disabled={disabled}
        />
      </Stack>
      <Box sx={{ width: { md: "300px" } }}>
        <FastField
          component={SelectField}
          name={`triggers[${index}].triggerParameters.canUseInStore`}
          label="Coupon can be used in store?"
          options={COUPON_USAGE}
          disabled={disabled}
        />
      </Box>
    </Stack>
  );
};
