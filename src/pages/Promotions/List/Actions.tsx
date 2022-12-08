import { noop } from "lodash-es";
import { useNavigate } from "react-router-dom";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { useArchivePromotionMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { usePermission } from "@components/PermissionGuard";
import { PromotionTabs } from "types/promotions";

type ActionsProps = {
  selectedPromotionIds: string[]
  onSuccess: () => void
  activeTab: PromotionTabs
}
export const Actions = ({ selectedPromotionIds, onSuccess, activeTab }:ActionsProps) => {
  const disabled = selectedPromotionIds.length === 0;
  const navigate = useNavigate();
  const { shopId } = useShop();
  const { mutate: archivePromotion } = useArchivePromotionMutation(client);

  const canArchive = usePermission(["reaction:legacy:promotions/archive"]);

  const archivePromotions = () => {
    selectedPromotionIds.forEach((id) =>
      archivePromotion(
        { input: { promotionId: id, shopId: shopId! } },
        { onSuccess }
      ));
  };

  const hideArchivedAction = !canArchive || activeTab === "archived";
  const hideEnableAction = activeTab === "active" || activeTab === "past";
  const hideDisableAction = activeTab === "disabled" || activeTab === "past";

  return (
    <MenuActions
      options={
        [
          { label: "Create New", onClick: () => navigate("create") },
          { label: "Duplicate", onClick: noop, disabled },
          { label: "Enable", onClick: noop, disabled, hidden: hideEnableAction },
          { label: "Disable", onClick: noop, disabled, hidden: hideDisableAction },
          { label: "Archive", onClick: archivePromotions, disabled, hidden: hideArchivedAction }
        ]
      }
      renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
    />
  );
};
