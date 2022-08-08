import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type ToastProps = {
  open: boolean
  handleClose: () => void
  message: string
  severity?: AlertColor
}

export const Toast = ({ handleClose, open, message, severity = "success" }: ToastProps) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);
