import Button, { ButtonProps } from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const ActionsTriggerButton = (props?: ButtonProps) => (
  <Button
    aria-label="actions"
    id="actions-button"
    aria-haspopup="true"
    color="secondary"
    variant="outlined"
    endIcon={<KeyboardArrowDownIcon/>}
    {...props}
  >
    Actions
  </Button>
);
