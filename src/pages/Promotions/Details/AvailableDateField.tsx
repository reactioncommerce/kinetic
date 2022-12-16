import Stack from "@mui/material/Stack";
import { Field, useFormikContext } from "formik";
import { format, isBefore } from "date-fns";

import { DatePickerField } from "@components/DatePickerField";
import { DATE_FORMAT } from "../constants";
import { Promotion } from "types/promotions";

type AvailableDateFieldProps = {
  disabled?: boolean
}
export const AvailableDateField = ({ disabled }: AvailableDateFieldProps) => {
  const { setFieldValue, values } = useFormikContext<Promotion>();

  const onStartDateAccept = (value: Date | null) => {
    setFieldValue("startDate", value ? format(value, DATE_FORMAT) : null);
    if (value && isBefore(new Date(values.endDate), new Date(value))) {
      setFieldValue("endDate", null);
    }
  };

  return (
    <Stack direction="row" gap={2} mt={1} position="relative" sx={{ width: { md: "50%", xs: "100%" } }}>
      <Field
        name="startDate"
        component={DatePickerField}
        label="Available From"
        inputFormat={DATE_FORMAT}
        onAccept={onStartDateAccept}
      />
      <Field
        name="endDate"
        component={DatePickerField}
        label="Available To"
        inputFormat={DATE_FORMAT}
        minDate={values.startDate}
        disabled={disabled}
      />
    </Stack>
  );
};
