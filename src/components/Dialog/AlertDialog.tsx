import DialogTitle from "@mui/material/DialogTitle";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ReactNode } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

type AlertDialogProps = DialogProps & {
  title: string
  content: ReactNode
  handleClose: () => void
  cancelText: string
  confirmText: string
  onConfirm: () => void
  icon: JSX.Element
}

export const AlertDialog = ({ title, content, handleClose, cancelText, confirmText, onConfirm, icon, ...props }: AlertDialogProps) => (
  <Dialog onClose={handleClose} {...props}>
    <DialogTitle>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <IconButton color="error">
          {icon}
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>


      <Typography variant="h6">{title}</Typography>
    </DialogTitle>
    <DialogContent>
      {content}
    </DialogContent>
    <Stack alignItems="center" direction="row" justifyContent="center" gap={1} mb={2} px={3}>
      <Button onClick={handleClose} fullWidth color="secondary" variant="outlined">{cancelText}</Button>
      <Button onClick={onConfirm} fullWidth color="error" variant="contained">
        {confirmText}
      </Button>
    </Stack>
  </Dialog>
);
