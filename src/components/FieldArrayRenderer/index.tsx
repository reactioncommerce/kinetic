import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldArrayRenderProps } from "formik";
import Button, { ButtonProps } from "@mui/material/Button";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import { get } from "lodash-es";

type FieldArrayRendererProps<T> = FieldArrayRenderProps & {
  renderFieldItem: (index: number) => JSX.Element;
  initialValue: T
  addButtonProps?: ButtonProps
};

export const FieldArrayRenderer = <T, >({
  renderFieldItem,
  form: { values: formValues },
  name,
  initialValue,
  push,
  remove,
  addButtonProps
}: FieldArrayRendererProps<T>) => {
  const values = get(formValues, name, []);

  return (
    <Box>
      {values.map((_: T, index: number) => (
        <Grid container alignItems="baseline" spacing={1} key={index}>
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
        {...addButtonProps}
        sx={{ ...addButtonProps?.sx, mt: 1, color: "grey.600" }}
      >
        {addButtonProps?.children ?? <><AddCircleOutlineRoundedIcon sx={{ pr: 1 }}/> Add</>}
      </Button>
    </Box>
  );
};
