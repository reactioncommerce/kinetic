import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type ToastProps = AlertProps & {
  open: boolean
  handleClose: () => void
  message?: string
}

export const Toast = ({ handleClose, open, message, severity = "success", ...rest }: ToastProps) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }} {...rest}>
      {message}
    </Alert>
  </Snackbar>
);
