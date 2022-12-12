import { noop } from "lodash-es";
import { useNavigate } from "react-router-dom";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { useArchivePromotionMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { usePermission } from "@components/PermissionGuard";
import { Promotion, PromotionTabs } from "types/promotions";
import { useDisablePromotion, useEnablePromotion } from "../hooks";

type ActionsProps = {
  selectedPromotions: Promotion[]
  onSuccess: () => void
  activeTab: PromotionTabs
}
export const Actions = ({ selectedPromotions, onSuccess, activeTab }:ActionsProps) => {
  const disabled = selectedPromotions.length === 0;
  const navigate = useNavigate();
  const { shopId } = useShop();
  const { mutate: archivePromotion } = useArchivePromotionMutation(client);

  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);

  const archivePromotions = () => {
    selectedPromotions.forEach(({ _id }) =>
      archivePromotion(
        { input: { promotionId: _id, shopId: shopId! } },
        { onSuccess }
      ));
  };

  const { enablePromotions } = useEnablePromotion(onSuccess);
  const { disablePromotions } = useDisablePromotion(onSuccess);

  const onClickEnablePromotion = () => {
    enablePromotions(selectedPromotions);
  };

  const onClickDisablePromotion = () => {
    disablePromotions(selectedPromotions);
  };

  const hideArchivedAction = !canUpdate || activeTab === "archived";
  const hideEnableAction = !canUpdate || activeTab === "active" || activeTab === "past" || activeTab === "archived";
  const hideDisableAction = !canUpdate || activeTab === "disabled" || activeTab === "past" || activeTab === "archived";

  return (
    <MenuActions
      options={
        [
          { label: "Create New", onClick: () => navigate("create") },
          { label: "Duplicate", onClick: noop, disabled },
          { label: "Enable", onClick: onClickEnablePromotion, disabled, hidden: hideEnableAction },
          { label: "Disable", onClick: onClickDisablePromotion, disabled, hidden: hideDisableAction },
          { label: "Archive", onClick: archivePromotions, disabled, hidden: hideArchivedAction }
        ]
      }
      renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
    />
  );
};
