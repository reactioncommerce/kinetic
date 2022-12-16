import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop } from "lodash-es";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { Promotion } from "types/promotions";
import { useDisablePromotion, useEnablePromotion, useArchivePromotions } from "../hooks";
import { PromotionState } from "@graphql/generates";
import { usePermission } from "@components/PermissionGuard";

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
  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const { archivePromotions } = useArchivePromotions(onSuccess);

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
            {
              label: "Enable",
              onClick: () => enablePromotions([promotion]),
              hidden: !canUpdate || promotion.enabled || promotion.state === PromotionState.Active
            },
            {
              label: "Disable",
              onClick: () => disablePromotions([promotion]),
              hidden: !canUpdate || !promotion.enabled || promotion.state === PromotionState.Active
            },
            { label: "Duplicate", onClick: noop },
            {
              label: "Archive",
              onClick: () => archivePromotions([promotion._id], promotion.shopId),
              hidden: !canUpdate || promotion.state === PromotionState.Active
            }
          ]
        }
        renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
      />
  );
};
