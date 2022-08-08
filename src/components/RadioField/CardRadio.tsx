import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

type CardRadioProps = {
  title: string
  description?: string | null
  value: string
  selected: boolean
}

export const CardRadio = ({ title, description, value, selected }: CardRadioProps) => (
  <Paper variant="outlined" sx={{
    py: 2,
    px: 1,
    borderWidth: "2px",
    ...(selected ?
      {
        borderColor: "primary.main",
        backgroundColor: "background.lightGreen"
      } :
      { borderColor: "grey.300" })
  }}>
    <FormControlLabel
      control={<Radio/>}
      value={value}
      label={
        <Stack sx={{ pl: 1 }}>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Typography variant="body2" color="grey.700">{description}</Typography>
        </Stack>
      }
    />
  </Paper>

);
