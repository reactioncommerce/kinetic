import Stack from "@mui/material/Stack";
import { Field, useFormikContext } from "formik";
import { isBefore } from "date-fns";

import { Promotion } from "types/promotions";
import { DateTimePickerField } from "@components/DateTimePickerField";

type AvailableDateFieldProps = {
  disabled?: boolean
}
export const AvailableDateField = ({ disabled }: AvailableDateFieldProps) => {
  const { setFieldValue, values } = useFormikContext<Promotion>();

  const onStartDateAccept = (value: Date | null) => {
    setFieldValue("startDate", value);
    if (value && isBefore(new Date(values.endDate), new Date(value))) {
      setFieldValue("endDate", null);
    }
  };

  return (
    <Stack gap={2} mt={1} position="relative" sx={{ width: { md: "fit-content", xs: "100%" }, flexDirection: { md: "row", xs: "column" } }}>
      <Field
        name="startDate"
        component={DateTimePickerField}
        label="Available From"
        onAccept={onStartDateAccept}
        disabled={disabled}
      />
      <Field
        name="endDate"
        component={DateTimePickerField}
        label="Available To"
        minDate={values.startDate}
      />
    </Stack>
  );
};
