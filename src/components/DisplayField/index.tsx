import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

type DisplayFieldProps = {
  label: string
  value: string | JSX.Element
  gutterBottom?: boolean
  editable?: boolean
}

export const DisplayField = ({ label, value, gutterBottom = true, editable = true }: DisplayFieldProps) => (
  <Grid container sx={{ ...(gutterBottom && { mb: 1 }) }} spacing={1} wrap="nowrap">
    <Grid item xs={4}>
      <Typography variant="body2" color="grey.700">{label}</Typography>
    </Grid>
    <Grid item xs={8}>
      {typeof value === "string" ?
        <Typography
          variant="body2"
          sx={{ wordBreak: "break-word", ...(!editable && { color: "grey.500" }) }}>
          {value}
        </Typography> : value}
    </Grid>
  </Grid>
);
