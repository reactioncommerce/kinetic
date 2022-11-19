import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop } from "lodash-es";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";

type ActionButtonsProps = {
  loading: boolean
  submitForm: () => void
  promotionId?: string
  disabled: boolean
  onCancel: () => void
}
export const ActionButtons = ({ loading, submitForm, promotionId, disabled, onCancel }: ActionButtonsProps) => (
  !promotionId || !disabled ?
    <Stack direction="row" gap={1}>
      <Button
        size="small"
        variant="outlined"
        color="secondary"
        onClick={onCancel}
        disabled={loading}
      >
          Cancel
      </Button>
      <LoadingButton
        size="small"
        variant="contained"
        disabled={disabled}
        loading={loading}
        onClick={submitForm}
      >
        Save Changes
      </LoadingButton>
    </Stack>
    :
    <MenuActions
      options={
        [
          { label: "Enable", onClick: noop },
          { label: "Duplicate", onClick: noop },
          { label: "Delete", onClick: noop }
        ]
      }
      renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
    />

);
