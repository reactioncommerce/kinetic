import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldArrayRenderProps } from "formik";
import Button from "@mui/material/Button";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

type FieldArrayRendererProps<T> = FieldArrayRenderProps & {
  renderFieldItem: (index: number) => JSX.Element;
  initialValue: T
};

export const FieldArrayRenderer = <T, >({
  renderFieldItem,
  form: { values },
  name,
  initialValue,
  push,
  remove
}: FieldArrayRendererProps<T>) => (
    <Box>
      {values[name].map((_: T, index: number) => (
        <Grid container alignItems={"center"} spacing={1} key={index}>
          <Grid item xs={11}>
            {renderFieldItem(index)}
          </Grid>
          <Grid item xs={1}>
            <IconButton
              color="secondary"
              sx={{ color: "grey.500", width: "34px", height: "34px" }}
              onClick={() => remove(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        size="small"
        variant="outlined"
        color="secondary"
        onClick={() => push(initialValue)}
        sx={{ mt: 1, color: "grey.600" }}
      >
        <AddCircleOutlineRoundedIcon sx={{ pr: 1 }}/> Add
      </Button>
    </Box>
  );
