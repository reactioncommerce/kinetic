import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

type DisplayFieldProps = {
  label: string
  value?: string | JSX.Element | null
  gutterBottom?: boolean
  editable?: boolean
}

export const DisplayField = ({ label, value, gutterBottom = true, editable = true }: DisplayFieldProps) => (
  <Grid container sx={{ ...(gutterBottom && { mb: 1 }) }} rowSpacing={1}>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2" color="grey.700">{label}</Typography>
    </Grid>
    <Grid item xs={12} sm={8}>
      {!value ?
        <Typography
          variant="body2"
          sx={{ color: "grey.400", fontStyle: "italic" }}>
          Not provided
        </Typography>
        :
        <>
          {typeof value === "string" ?
            <Typography
              variant="body2"
              sx={{ wordBreak: "break-word", ...(!editable && { color: "grey.500" }) }}>
              {value}
            </Typography> : value}
        </>}

    </Grid>
  </Grid>
);
