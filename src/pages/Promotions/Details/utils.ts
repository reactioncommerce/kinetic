import { Coupon, CouponInput } from "types/coupons";
import { Action, Rule, Trigger, TriggerKeys, TriggerType } from "types/promotions";

const normalizeRule = (rule?: Rule) => {
  const newRule = { ...rule };
  if (newRule.conditions?.all && !newRule.conditions.all.length) newRule.conditions.all = undefined;
  if (newRule.conditions?.any && !newRule.conditions.any.length) newRule.conditions.any = undefined;
  if (!newRule.conditions?.all && !newRule.conditions?.any) newRule.conditions = undefined;

  return newRule.conditions ? newRule : undefined;
};

export const normalizeTriggersData = (triggers?: Trigger[]) => {
  const coupons: CouponInput[] = [];

  const handler = {
    [TriggerKeys.Coupons]: (trigger: Trigger<TriggerKeys.Coupons>) => {
      const { code, name, canUseInStore, _id, maxUsageTimesPerUser } = trigger.triggerParameters;
      coupons.push({ code, name, canUseInStore, _id, maxUsageTimesPerUser });
      return {
        triggerKey: trigger.triggerKey,
        triggerParameters: {
          conditions: {}
        }
      };
    },
    [TriggerKeys.Offers]: (trigger: Trigger) => ({
      ...trigger,
      triggerParameters: {
        name: trigger.triggerParameters?.name,
        inclusionRules: normalizeRule(trigger.triggerParameters?.inclusionRules),
        exclusionRules: normalizeRule(trigger.triggerParameters?.exclusionRules),
        conditions: {
          all: trigger.triggerParameters?.conditions.all
            .map(({ triggerType, value }) => ({ fact: triggerType?.split("-")[0], operator: triggerType?.split("-")[1], value }))
        }
      }
    })
  };

  const formattedData = triggers?.map((trigger) => handler[trigger.triggerKey](trigger));
  return { triggers: formattedData, coupons };
};

export const normalizeActionsData = (actions?: Action[]) => actions?.map((action) => ({
  ...action,
  actionParameters: {
    ...action.actionParameters,
    discountMaxUnits: action.actionParameters?.discountMaxUnits || undefined,
    discountMaxValue: action.actionParameters?.discountMaxValue || undefined,
    inclusionRules: normalizeRule(action.actionParameters?.inclusionRules),
    exclusionRules: normalizeRule(action.actionParameters?.exclusionRules)
  }
}));


const getTriggerType = (triggerConditionAll?: {fact: string, operator: string, value: number}[]) => (triggerConditionAll ? triggerConditionAll
  .map((conditionAll) => ({ ...conditionAll, triggerType: `${conditionAll.fact}-${conditionAll.operator}` })) : []);


export const formatTriggers = (triggers: Trigger[], promotionName: string, coupon?: Coupon | null) =>
  triggers.map((trigger) => {
    const { triggerKey } = trigger;

    const formatFn = {
      [TriggerKeys.Offers]: {
        ...trigger,
        triggerParameters: {
          ...trigger.triggerParameters,
          name: trigger.triggerParameters?.name || promotionName,
          conditions: { all: getTriggerType(trigger.triggerParameters?.conditions.all) }
        }
      },
      [TriggerKeys.Coupons]: coupon ? {
        ...trigger,
        triggerParameters: {
          name: coupon.name,
          conditions: { all: [{ triggerType: TriggerType.CouponStandard }] },
          code: coupon.code,
          canUseInStore: coupon.canUseInStore,
          _id: coupon._id,
          maxUsageTimesPerUser: coupon.maxUsageTimesPerUser || 0
        }
      } : {
        ...trigger,
        triggerParameters: {
          name: trigger.triggerParameters?.name || promotionName,
          conditions: { all: [{ triggerType: TriggerType.CouponStandard }] },
          code: "",
          canUseInStore: false,
          maxUsageTimesPerUser: 0
        }
      }
    };

    return formatFn[triggerKey];
  });
