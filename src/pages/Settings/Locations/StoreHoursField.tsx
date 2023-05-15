import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { startCase } from "lodash-es";
import { FastField, Field, FieldProps, getIn } from "formik";
import InputAdornment from "@mui/material/InputAdornment";

import { TimePickerField } from "@components/TimePickerField";
import { StoreHours } from "types/location";
import { TextField } from "@components/TextField";


export const StoreHoursField = ({ form: { values }, field: { name } }: FieldProps) => {
  const storeHours = getIn(values, name) as StoreHours;

  return (
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
              <FastField name={`storeHours[${index}].open`} component={TimePickerField}/>
            </Grid>
            <Grid item xs={4}>
              <FastField name={`storeHours[${index}].close`} component={TimePickerField}/>
            </Grid>
          </Grid>)
      }
      <Box width="50%">
        <Field
          name="storePickupHours"
          component={TextField}
          type="number"
          label="Expected Pick Up Time"
          endAdornment={
            <InputAdornment position="end">hours</InputAdornment>
          }
        />
      </Box>
      <Field
        name="storePickupInstructions"
        component={TextField}
        label="Store Pick Up Instructions"
      />
    </Stack>
  );
};
