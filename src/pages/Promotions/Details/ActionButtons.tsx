import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { Promotion } from "types/promotions";
import { useDisablePromotion, useEnablePromotion, useArchivePromotions } from "../hooks";
import { PromotionState, useDuplicatePromotionMutation } from "@graphql/generates";
import { usePermission } from "@components/PermissionGuard";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { useToast } from "@containers/ToastProvider";

type ActionButtonsProps = {
  loading: boolean
  submitForm: () => void
  promotion?: Promotion | null
  disabled: boolean
  onCancel: () => void
  onSuccess: () => void
}

export const ActionButtons = ({ loading, submitForm, promotion, disabled, onCancel, onSuccess }: ActionButtonsProps) => {
  const { shopId } = useShop();
  const navigate = useNavigate();
  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const canCreate = usePermission(["reaction:legacy:promotions/create"]);
  const { success, error } = useToast();

  const { enablePromotions } = useEnablePromotion(onSuccess);
  const { disablePromotions } = useDisablePromotion(onSuccess);
  const { archivePromotions } = useArchivePromotions(onSuccess);
  const { mutate: duplicatePromotion } = useDuplicatePromotionMutation(client);

  const handleDuplicatePromotion = (promotionId: string) => {
    duplicatePromotion(
      { input: { shopId: shopId!, promotionId } },
      {
        onSuccess: (response) => {
          if (!response.duplicatePromotion?.success) {
            error("Failed to duplicate promotion");
            return;
          }
          const duplicatedPromotionId = response.duplicatePromotion?.promotion?._id;

          if (duplicatedPromotionId) {
            navigate(`/promotions/${duplicatedPromotionId}`);
          } else {
            success("Duplicated promotion successfully");
          }
        }
      }
    );
  };

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
              hidden: !canUpdate || promotion.enabled
            },
            {
              label: "Disable",
              onClick: () => disablePromotions([promotion]),
              hidden: !canUpdate || !promotion.enabled
            },
            { label: "Duplicate", onClick: () => handleDuplicatePromotion(promotion._id), hidden: !canCreate },
            {
              label: "Archive",
              onClick: () => archivePromotions([promotion._id], promotion.shopId),
              hidden: !canUpdate || promotion.state === PromotionState.Archived
            }
          ]
        }
        renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
      />
  );
};
