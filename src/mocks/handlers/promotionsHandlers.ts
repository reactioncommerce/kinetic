import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { CalculationType, Promotion, Stackability } from "types/promotions";
import { PromotionState, TriggerType } from "@graphql/generates";

const date = new Date("2022-02-28");

const promotion = (index: number): Promotion => {
  const startDate = new Date(date.getTime());
  startDate.setDate(startDate.getDate() + index);
  return {
    _id: faker.datatype.uuid(),
    label: faker.word.noun(),
    triggerType: TriggerType.Implicit,
    name: faker.word.noun(),
    promotionType: "order-discount",
    createdAt: date,
    updatedAt: date,
    referenceId: index + 1000,
    actions: [{
      actionKey: "noop",
      actionParameters: {
        discountCalculationType: CalculationType.Percentage,
        discountType: "order",
        discountValue: 50
      }
    }],
    startDate,
    enabled: index % 2 === 0,
    endDate: index % 2 === 0 ? faker.date.future() : date,
    triggers: [{
      triggerKey: "offer"
    }],
    description: "description",
    shopId: "id",
    state: PromotionState.Created,
    stackability: { key: Stackability.All, parameters: {} }
  };
};

export const promotions = new Array(10).fill(0)
  .map((_, index) => promotion(index)).map((promo) => ({ ...promo, state: promo.enabled ? PromotionState.Active : PromotionState.Created }));

export const enabledPromotions = promotions.filter(({ enabled }) => enabled);
export const disabledPromotions = promotions.filter(({ enabled }) => !enabled);

const getPromotionsHandler = graphql.query("getPromotions", (req, res, ctx) => {
  const { filter } = req.variables;
  if (filter.enabled || filter.state === PromotionState.Active) {
    return res(ctx.data({ promotions: { nodes: enabledPromotions, totalCount: enabledPromotions.length } }));
  }
  return res(ctx.data({ promotions: { nodes: promotions, totalCount: promotions.length } }));
});

export const handlers = [getPromotionsHandler];
