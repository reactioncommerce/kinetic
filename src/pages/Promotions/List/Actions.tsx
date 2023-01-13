import { useNavigate } from "react-router-dom";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { useShop } from "@containers/ShopProvider";
import { usePermission } from "@components/PermissionGuard";
import { Promotion, PromotionTabs } from "types/promotions";
import { useDisablePromotion, useEnablePromotion, useArchivePromotions } from "../hooks";
import { useDuplicatePromotionMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useToast } from "@containers/ToastProvider";

type ActionsProps = {
  selectedPromotions: Promotion[]
  onSuccess: () => void
  activeTab: PromotionTabs
}
export const Actions = ({ selectedPromotions, onSuccess, activeTab }:ActionsProps) => {
  const disabled = selectedPromotions.length === 0;
  const selectedPromotionIds = selectedPromotions.map(({ _id }) => _id);
  const navigate = useNavigate();
  const { shopId } = useShop();
  const { success } = useToast();
  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const canCreate = usePermission(["reaction:legacy:promotions/create"]);


  const { enablePromotions } = useEnablePromotion(onSuccess);
  const { disablePromotions } = useDisablePromotion(onSuccess);
  const { archivePromotions } = useArchivePromotions(onSuccess);
  const { mutate: duplicatePromotion } = useDuplicatePromotionMutation(client);

  const handleArchivePromotions = () => {
    archivePromotions(selectedPromotionIds, shopId!);
  };

  const onClickDuplicatePromotion = () => {
    selectedPromotionIds.forEach((id) => {
      duplicatePromotion({ input: { promotionId: id, shopId: shopId! } }, {
        onSuccess: (response) => {
          if (response.duplicatePromotion?.success) {
            onSuccess();
            success(selectedPromotionIds.length === 1 ? "Duplicated promotion successfully" : "Duplicated promotions successfully");
          }
        }
      });
    });
  };
  const onClickEnablePromotion = () => {
    enablePromotions(selectedPromotions);
  };

  const onClickDisablePromotion = () => {
    disablePromotions(selectedPromotions);
  };

  const hideArchivedAction = !canUpdate || activeTab === "archived";
  const hideEnableAction = !canUpdate || activeTab === "active" || activeTab === "past";
  const hideDisableAction = !canUpdate || activeTab === "disabled" || activeTab === "past";

  return (
    canUpdate || canCreate ?
      (<MenuActions
        options={
          [
            { label: "Create New", onClick: () => navigate("create"), hidden: !canCreate },
            { label: "Duplicate", onClick: onClickDuplicatePromotion, disabled, hidden: !canCreate },
            { label: "Enable", onClick: onClickEnablePromotion, disabled, hidden: hideEnableAction },
            { label: "Disable", onClick: onClickDisablePromotion, disabled, hidden: hideDisableAction },
            { label: "Archive", onClick: handleArchivePromotions, disabled, hidden: hideArchivedAction }
          ]
        }
        renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
      />) : null
  );
};
