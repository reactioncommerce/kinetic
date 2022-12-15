import { useArchivePromotionMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";

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
