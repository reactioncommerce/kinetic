import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { startCase } from "lodash-es";
import { Field } from "formik";

import { TimePickerField } from "@components/TimePickerField";
import { StoreHours } from "types/location";

type StoreHoursProps = {
  storeHours: StoreHours
}

export const StoreHoursField = ({ storeHours }: StoreHoursProps) => (
  <Stack>
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography variant="subtitle2">
          Store Hours
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="subtitle2">
          Open
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="subtitle2">
          Close
        </Typography>
      </Grid>
    </Grid>
    {
      storeHours.map((storeHour, index) =>
        <Grid key={index} alignItems="center" container spacing={2}>
          <Grid item xs={3}>
            <Typography>
              {startCase(storeHour.day)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Field name={`storeHours[${index}].open`} component={TimePickerField}/>
          </Grid>
          <Grid item xs={4}>
            <Field name={`storeHours[${index}].close`} component={TimePickerField}/>
          </Grid>
        </Grid>)
    }
  </Stack>
);
