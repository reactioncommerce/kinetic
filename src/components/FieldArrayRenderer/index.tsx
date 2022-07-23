import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldArrayRenderProps } from "formik";
import Button from "@mui/material/Button";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Box from "@mui/material/Box";

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
        <Stack direction="row" alignItems="center" gap={1} key={index}>
          {renderFieldItem(index)}
          <IconButton
            color="secondary"
            sx={{ color: "grey.500", width: "34px", height: "34px" }}
            onClick={() => remove(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
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
