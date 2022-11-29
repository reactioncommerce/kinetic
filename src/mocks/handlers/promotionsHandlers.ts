import { graphql } from "msw";
import { faker } from "@faker-js/faker";

import { Promotion } from "types/promotions";
import { PromotionState, TriggerType } from "@graphql/generates";

const date = new Date("2022-02-28");

const promotion = (index: number): Promotion => {
  const startDate = new Date(date.getTime());
  startDate.setDate(startDate.getDate() + index);
  return {
    _id: faker.datatype.uuid(),
    label: faker.word.noun(),
    name: faker.word.noun(),
    triggerType: TriggerType.Implicit,
    promotionType: "order-discount",
    createdAt: date,
    updatedAt: date,
    referenceId: index + 1000,
    state: PromotionState.Created,
    actions: [{
      actionKey: "noop",
      actionParameters: {
        discountCalculationType: "percentage",
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
    shopId: "id"
  };
};

export const promotions = new Array(10).fill(0).map((_, index) => promotion(index));

export const enabledPromotions = promotions.filter(({ enabled }) => enabled);
export const disabledPromotions = promotions.filter(({ enabled }) => !enabled);

const getPromotionsHandler = graphql.query("getPromotions", (req, res, ctx) => {
  const { filter } = req.variables;
  if (filter.enabled) {
    return res(ctx.data({ promotions: { nodes: enabledPromotions, totalCount: enabledPromotions.length } }));
  }
  return res(ctx.data({ promotions: { nodes: promotions, totalCount: promotions.length } }));
});

export const handlers = [getPromotionsHandler];
