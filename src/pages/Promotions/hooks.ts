import { useToast } from "@containers/ToastProvider";
import { useUpdatePromotionMutation,
  useArchivePromotionMutation,
  PromotionState,
  useCreateStandardCouponMutation,
  useUpdateStandardCouponMutation,
  useArchiveCouponMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { formatErrorResponse } from "@utils/errorHandlers";
import { CouponInput } from "types/coupons";
import { Promotion } from "types/promotions";

const getUpdatePromotionInput = (promotion: Promotion) => {
  const { referenceId, state, createdAt, updatedAt, coupon, ...restPromotion } = promotion;
  return restPromotion;
};

export const useEnablePromotion = (onSuccess?: () => void) => {
  const { mutate: update } = useUpdatePromotionMutation(client);

  const { success, error } = useToast();
  const enablePromotions = (promotions: Promotion[]) => {
    promotions.forEach((promotion) => update({ input: { ...getUpdatePromotionInput(promotion), enabled: true } }, {
      onSuccess: () => {
        onSuccess?.();
        success(promotions.length === 1 ? "Enabled promotion successfully" : "Enabled promotions successfully");
      },
      onError: (errorResponse) => {
        const { message } = formatErrorResponse(errorResponse);
        error(message || "Failed to enable this promotion");
      }
    }));
  };

  return { enablePromotions };
};

export const useDisablePromotion = (onSuccess?: () => void) => {
  const { mutate: update } = useUpdatePromotionMutation(client);
  const { success, error } = useToast();

  const disablePromotions = (promotions: Promotion[]) => {
    promotions.forEach((promotion) => update({
      input:
      {
        ...getUpdatePromotionInput(promotion),
        enabled: false,
        state: promotion.state === PromotionState.Active ? PromotionState.Created : promotion.state
      }
    }, {
      onSuccess: () => {
        onSuccess?.();
        success(promotions.length === 1 ? "Disabled promotion successfully" : "Disabled promotions successfully");
      },
      onError: (errorResponse) => {
        const { message } = formatErrorResponse(errorResponse);
        error(message || "Failed to enable this promotion");
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

export const useUpdateCouponInPromotion = () => {
  const { mutate: create } = useCreateStandardCouponMutation(client);
  const { mutate: updateCoupon } = useUpdateStandardCouponMutation(client);
  const { mutate: archiveCoupon } = useArchiveCouponMutation(client);
  const { error } = useToast();

  const handleCouponError = (couponId?: string) => (errorResponse: unknown) => {
    const { message } = formatErrorResponse(errorResponse);
    error(message || `Failed to ${couponId ? "update" : "create"} a coupon.`);
  };

  const handleArchiveCouponError = (errorResponse: unknown) => {
    const { message } = formatErrorResponse(errorResponse);
    error(message || "Failed to delete a coupon.");
  };

  const updateCouponInPromotion = (promotion: Promotion, newCoupons: CouponInput[]) => {
    const { shopId, _id, coupon } = promotion;
    if (coupon && !newCoupons.length) {
      archiveCoupon({ input: { couponId: coupon._id, shopId } }, {
        onError: handleArchiveCouponError
      });
    }

    if (newCoupons.length) {
      newCoupons.forEach((newCoupon) => {
        if (newCoupon._id) {
          updateCoupon({ input: { ...newCoupon, shopId, _id: newCoupon._id } }, { onError: handleCouponError(newCoupon._id) });
        } else if (coupon) {
          archiveCoupon({ input: { couponId: coupon._id, shopId } }, {
            onError: handleArchiveCouponError,
            onSuccess: () => {
              create({ input: { ...newCoupon, shopId, promotionId: _id } }, { onError: handleCouponError() });
            }
          });
        } else {
          create({ input: { ...newCoupon, shopId, promotionId: _id } }, { onError: handleCouponError() });
        }
      });
    }
  };

  const createCoupon = ({ promotionId, shopId, newCoupons }: {promotionId?: string, newCoupons: CouponInput[], shopId: string}) => {
    if (newCoupons.length && promotionId) {
      newCoupons.forEach((coupon) => {
        create({ input: { ...coupon, shopId, promotionId } }, { onError: handleCouponError() });
      });
    }
  };
  return { updateCouponInPromotion, createCoupon };
};
