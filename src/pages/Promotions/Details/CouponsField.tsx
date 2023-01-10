import { Field } from "formik";
import Stack from "@mui/material/Stack";

import { TextField } from "@components/TextField";

export type CouponsFieldProps = {
  index: number
}

export const CouponsField = ({ index }: CouponsFieldProps) => (
  <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 3 } }}>
    <Field
      component={TextField}
      name={`triggers[${index}].triggerParameters.name`}
      label="Give your coupon a name"
    />
    <Field
      component={TextField}
      name={`triggers[${index}].triggerParameters.couponCode`}
      label="Enter the coupon code (avoid characters like I, L, 0, and O)"
    />
  </Stack>

);
