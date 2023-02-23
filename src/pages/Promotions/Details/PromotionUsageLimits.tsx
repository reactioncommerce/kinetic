import Stack from "@mui/material/Stack";
import { Field } from "formik";

import { TextField } from "@components/TextField";

type PromotionUsageLimitsProps = {
  actionParametersFieldName: string
}

export const PromotionUsageLimits = ({ actionParametersFieldName }: PromotionUsageLimitsProps) => (
  <Stack sx={{ width: { lg: "50%", md: "100%" }, flexDirection: { lg: "row", md: "column" }, gap: { lg: 2, md: 0 }, alignItems: { lg: "flex-start" } }}>
    <Field name={`${actionParametersFieldName}.discountMaxUnits`} component={TextField} type="number" label="Max # uses per Order" />
    <Field name={`${actionParametersFieldName}.discountMaxValue`} component={TextField} type="number" label="Max $ discount on an Order" />
  </Stack>
);
