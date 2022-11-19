import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FieldArrayRenderProps } from "formik";

type PromotionFieldArrayProps<T> = FieldArrayRenderProps & {
  renderFieldItem: (index: number) => JSX.Element;
  initialValue: T
  label: string
  addButtonLabel: string
  removeButtonLabel: string
  renderHeaderField: (index: number) => JSX.Element
  hideAddButton?: boolean
};

export const PromotionFieldArray = <T, >({
  label,
  addButtonLabel,
  initialValue,
  push,
  remove,
  form: { values },
  name,
  renderFieldItem,
  renderHeaderField,
  removeButtonLabel,
  hideAddButton = false
}: PromotionFieldArrayProps<T>) => (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle2">{label}</Typography>
      {values[name].map((_: T, index: number) =>
        <Paper key={index} variant="outlined" sx={{ padding: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {renderHeaderField(index)}
            <Button variant="text" color="error" onClick={() => remove(index)}>
              {removeButtonLabel}
            </Button>
          </Stack>
          {renderFieldItem(index)}
        </Paper>)
      }
      {!hideAddButton ?
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => push(initialValue)}
          sx={{ width: "fit-content" }}
          size="small"
        >
          {addButtonLabel}
        </Button> : null}
    </Stack>
  );
