import { FastField, useFormikContext } from "formik";
import Stack from "@mui/material/Stack";
import { ChangeEventHandler } from "react";

import { TextField } from "@components/TextField";

export type CouponsFieldProps = {
  index: number
}

export const CouponsField = ({ index }: CouponsFieldProps) => {
  const { setFieldValue } = useFormikContext();

  const onChangeCouponCode: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFieldValue(`triggers[${index}].triggerParameters.couponCode`, event.target.value.toUpperCase());
  };

  return (
    <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 } }}>
      <FastField
        component={TextField}
        name={`triggers[${index}].triggerParameters.name`}
        label="Give your coupon a name"
      />
      <FastField
        component={TextField}
        onChange={onChangeCouponCode}
        name={`triggers[${index}].triggerParameters.couponCode`}
        label="Enter the coupon code (avoid characters like I, L, 0, and O)"
      />
    </Stack>
  );
};
