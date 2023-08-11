import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Typography from "@mui/material/Typography";

import { AlertDialog } from "./AlertDialog";

type BlockNavigateDialogProps = {
  open: boolean
  onClose?: () => void
  onConfirm?: () => void
}

export const BlockNavigateDialog = ({ open, onClose, onConfirm }: BlockNavigateDialogProps) => <AlertDialog
  title="Save Change"
  icon={<InfoOutlinedIcon/>}
  content={
    <>
      <Typography variant="subtitle2" color="grey.600">Are you sure you want to leave this page?</Typography>
      <Typography variant="subtitle2" color="grey.600">Changes you made will not be saved.</Typography>
    </>}
  open={open}
  handleClose={onClose}
  cancelText="Cancel"
  confirmText="Leave"
  onConfirm={onConfirm}
/>;
