import { Action, Rule, Trigger } from "types/promotions";
import { Operator } from "../constants";


const normalizeRuleCondition = (conditions: Rule["conditions"]) => {
  const newAllConditions = conditions.all?.map((condition) => {
    if (condition.operator === Operator.Equal) return { ...condition, value: condition.value[0] };
    return condition;
  });
  const newAnyConditions = conditions.any?.map((condition) => {
    if (condition.operator === Operator.Equal) return { ...condition, value: condition.value[0] };
    return condition;
  });

  return { all: newAllConditions, any: newAnyConditions };
};


const normalizeRule = (rule?: Rule) => {
  const newRule = { ...rule };
  if (newRule.conditions?.all && !newRule.conditions.all.length) newRule.conditions.all = undefined;
  if (newRule.conditions?.any && !newRule.conditions.any.length) newRule.conditions.any = undefined;
  if (!newRule.conditions?.all && !newRule.conditions?.any) newRule.conditions = undefined;

  return newRule.conditions ? { conditions: normalizeRuleCondition(newRule.conditions) } : undefined;
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

export const formatRule = (rule?: Rule) => {
  if (rule?.conditions) {
    return {
      conditions: {
        all: rule.conditions.all?.map((condition) => {
          if (condition.operator === Operator.Equal) return { ...condition, value: !Array.isArray(condition.value) ? [condition.value] : condition.value };
          return condition;
        }),
        any: rule.conditions.any?.map((condition) => {
          if (condition.operator === Operator.Equal) return { ...condition, value: !Array.isArray(condition.value) ? [condition.value] : condition.value };
          return condition;
        })
      }
    };
  }

  return rule;
};
