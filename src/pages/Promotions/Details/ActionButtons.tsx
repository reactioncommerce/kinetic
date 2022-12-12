import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop } from "lodash-es";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { Promotion } from "types/promotions";
import { useDisablePromotion, useEnablePromotion } from "../hooks";
import { PromotionState } from "@graphql/generates";

type ActionButtonsProps = {
  loading: boolean
  submitForm: () => void
  promotion?: Promotion | null
  disabled: boolean
  onCancel: () => void
  onSuccess: () => void
}

export const ActionButtons = ({ loading, submitForm, promotion, disabled, onCancel, onSuccess }: ActionButtonsProps) => {
  const { enablePromotions } = useEnablePromotion(onSuccess);
  const { disablePromotions } = useDisablePromotion(onSuccess);

  return (
    !promotion || !disabled ?
      <Stack direction="row" gap={1}>
        <Button
          variant="text"
          color="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <LoadingButton
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
            { label: "Enable", onClick: () => enablePromotions([promotion]), hidden: promotion.enabled || promotion.state === PromotionState.Archived },
            { label: "Disable", onClick: () => disablePromotions([promotion]), hidden: !promotion.enabled || promotion.state === PromotionState.Archived },
            { label: "Duplicate", onClick: noop },
            { label: "Delete", onClick: noop }
          ]
        }
        renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
      />
  );
};
