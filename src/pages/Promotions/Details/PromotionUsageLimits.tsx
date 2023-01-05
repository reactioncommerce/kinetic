import Stack from "@mui/material/Stack";
import { Field } from "formik";

import { TextField } from "@components/TextField";

export const PromotionUsageLimits = () => (
  <Stack direction="row" gap={2} mt={1} sx={{ width: { md: "80%", xs: "100%" } }}>
    <Field name="maxUsagePerOrder" component={TextField} type="number" label="Max # uses per Order"/>
    <Field name="maxDiscountPerOrder" component={TextField} type="number" label="Max $ discount on an Order"/>
    <Field name="maxUsagePerCustomer" component={TextField} type="number" label="Max # uses per Customer"/>
  </Stack>
);
