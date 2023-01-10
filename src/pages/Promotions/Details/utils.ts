import { Action, Rule, Trigger, TriggerKeys, TriggerType } from "types/promotions";

const normalizeRule = (rule?: Rule) => {
  const newRule = { ...rule };
  if (newRule.conditions?.all && !newRule.conditions.all.length) newRule.conditions.all = undefined;
  if (newRule.conditions?.any && !newRule.conditions.any.length) newRule.conditions.any = undefined;
  if (!newRule.conditions?.all && !newRule.conditions?.any) newRule.conditions = undefined;

  return newRule.conditions ? newRule : undefined;
};

export const normalizeTriggersData = (triggers?: Trigger[]) => triggers?.map((trigger) => ({
  ...trigger,
  triggerParameters: {
    ...trigger.triggerParameters,
    inclusionRules: normalizeRule(trigger.triggerParameters?.inclusionRules),
    exclusionRules: normalizeRule(trigger.triggerParameters?.exclusionRules),
    conditions: {
      all: trigger.triggerParameters?.conditions.all
        .map(({ triggerType, value }) => ({ fact: triggerType?.split("-")[0], operator: triggerType?.split("-")[1], value }))
    }
  }
}));

export const normalizeActionsData = (actions?: Action[]) => actions?.map((action) => ({
  ...action,
  actionParameters: {
    ...action.actionParameters,
    inclusionRules: normalizeRule(action.actionParameters?.inclusionRules),
    exclusionRules: normalizeRule(action.actionParameters?.exclusionRules)
  }
}));


const getTriggerType = (triggerConditionAll?: {fact: string, operator: string, value: number}[]) => (triggerConditionAll ? triggerConditionAll
  .map((conditionAll) => ({ ...conditionAll, triggerType: `${conditionAll.fact}-${conditionAll.operator}` })) : []);


const formatOffersTrigger = (trigger: Trigger<TriggerKeys.Offers>, promotionName: string) => ({
  ...trigger,
  triggerParameters: {
    ...trigger.triggerParameters,
    name: trigger.triggerParameters?.name || promotionName,
    conditions: { all: getTriggerType(trigger.triggerParameters?.conditions.all) }
  }
});

const formatCouponsTrigger = (trigger: Trigger<TriggerKeys.Coupons>) => ({
  ...trigger,
  triggerParameters: {
    name: trigger.triggerParameters.name,
    conditions: { all: [{ triggerType: TriggerType.CouponStandard }] },
    couponCode: trigger.triggerParameters.couponCode
  }
});

export const formatTriggers = (triggers: Trigger[], promotionName: string) =>
  triggers.map((trigger) => {
    const { triggerKey } = trigger;

    const formatFn = {
      [TriggerKeys.Offers]: formatOffersTrigger,
      [TriggerKeys.Coupons]: formatCouponsTrigger
    };

    return formatFn[triggerKey](trigger, promotionName);
  });
