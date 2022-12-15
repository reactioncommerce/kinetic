import { noop } from "lodash-es";
import { useNavigate } from "react-router-dom";

import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { useShop } from "@containers/ShopProvider";
import { usePermission } from "@components/PermissionGuard";
import { Promotion, PromotionTabs } from "types/promotions";
import { useArchivePromotions } from "../hooks";

type ActionsProps = {
  selectedPromotions: Promotion[]
  onSuccess: () => void
  activeTab: PromotionTabs
}

export const Actions = ({ selectedPromotions, onSuccess, activeTab }:ActionsProps) => {
  const disabled = selectedPromotions.length === 0;
  const navigate = useNavigate();
  const { shopId } = useShop();

  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const canCreate = usePermission(["reaction:legacy:promotions/create"]);

  const { archivePromotions } = useArchivePromotions(onSuccess);

  const handleArchivePromotions = () => {
    archivePromotions(selectedPromotions.map(({ _id }) => _id), shopId!);
  };

  const hideArchivedAction = !canUpdate || activeTab === "archived";
  const hideEnableAction = !canUpdate || activeTab === "active" || activeTab === "past";
  const hideDisableAction = !canUpdate || activeTab === "disabled" || activeTab === "past";

  return (
    canUpdate || canCreate ?
      <MenuActions
        options={
          [
            { label: "Create New", onClick: () => navigate("create"), hidden: !canCreate },
            { label: "Duplicate", onClick: noop, disabled },
            { label: "Enable", onClick: noop, disabled, hidden: hideEnableAction },
            { label: "Disable", onClick: noop, disabled, hidden: hideDisableAction },
            { label: "Archive", onClick: handleArchivePromotions, disabled, hidden: hideArchivedAction }
          ]
        }
        renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
      />
      : null);
};
