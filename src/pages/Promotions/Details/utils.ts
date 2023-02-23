import { Action, Rule, Trigger } from "types/promotions";

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
    discountMaxUnits: action.actionParameters?.discountMaxUnits || undefined,
    discountMaxValue: action.actionParameters?.discountMaxValue || undefined,
    inclusionRules: normalizeRule(action.actionParameters?.inclusionRules),
    exclusionRules: normalizeRule(action.actionParameters?.exclusionRules)
  }
}));
