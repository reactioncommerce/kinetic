import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { useState } from "react";

export type ToastMessage = {
  key: number
  message: string
  severity: AlertColor
}

type ToastProps = Omit<SnackbarProps, "message"> & {
  message: ToastMessage
  onExited: () => void
}

export const Toast = ({ message, autoHideDuration, onExited, ...rest }: ToastProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar key={message.key} open={open} autoHideDuration={autoHideDuration || 6000} onClose={handleClose} TransitionProps={{ onExited }} {...rest}>
      <Alert onClose={handleClose} severity={message.severity} sx={{ width: "100%" }} variant="filled">
        {message.message}
      </Alert>
    </Snackbar>
  );
};
