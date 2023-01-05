import { useToast } from "@containers/ToastProvider";
import { useUpdatePromotionMutation, useArchivePromotionMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { Promotion } from "types/promotions";

const getUpdatePromotionInput = (promotion: Promotion) => {
  const { referenceId, state, createdAt, updatedAt, ...restPromotion } = promotion;
  return restPromotion;
};

export const useEnablePromotion = (onSuccess?: () => void) => {
  const { mutate: update } = useUpdatePromotionMutation(client);
  const { success } = useToast();
  const enablePromotions = (promotions: Promotion[]) => {
    promotions.forEach((promotion) => update({ input: { ...getUpdatePromotionInput(promotion), enabled: true } }, {
      onSuccess: () => {
        onSuccess?.();
        success(promotions.length === 1 ? "Enabled promotion successfully" : "Enabled promotions successfully");
      }
    }));
  };

  return { enablePromotions };
};

export const useDisablePromotion = (onSuccess?: () => void) => {
  const { mutate: update } = useUpdatePromotionMutation(client);
  const { success } = useToast();

  const disablePromotions = (promotions: Promotion[]) => {
    promotions.forEach((promotion) => update({ input: { ...getUpdatePromotionInput(promotion), enabled: false } }, {
      onSuccess: () => {
        onSuccess?.();
        success(promotions.length === 1 ? "Disabled promotion successfully" : "Disabled promotions successfully");
      }
    }));
  };

  return { disablePromotions };
};

export const useArchivePromotions = (onSuccess?: () => void) => {
  const { mutate: archive } = useArchivePromotionMutation(client);

  const archivePromotions = (promotionIds: string[], shopId: string) => {
    promotionIds.forEach((promotionId) =>
      archive(
        { input: { promotionId, shopId } },
        { onSuccess }
      ));
  };
  return { archivePromotions };
};
