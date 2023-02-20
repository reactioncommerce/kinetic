import * as Yup from "yup";

import { TriggerKeys, TriggerType } from "types/promotions";
import { NOOP_ACTION } from "../constants";

const ruleSchema = Yup.object({
  path: Yup.string().required("This field is required"),
  operator: Yup.string().required("This field is required"),
  value: Yup.array().min(1, "This field must have at least 1 value").when("operator", {
    is: "equal",
    then: (schema) => schema.length(1, "Change the operator to \"Is Any Of\" to add multiple values"),
    otherwise: (schema) => schema
  })
});

const shippingRuleSchema = Yup.object({ value: Yup.array().min(1, "This field must have at least 1 item") });

const inclusionExclusionValidation = {
  inclusionRules: Yup.object({
    conditions: Yup.object({
      any: Yup.array().of(ruleSchema),
      all: Yup.array().of(ruleSchema)
    })
  }),
  exclusionRules: Yup.object({
    conditions: Yup.object({
      any: Yup.array().of(ruleSchema),
      all: Yup.array().of(ruleSchema)
    })
  })
};
export const promotionSchema = Yup.object().shape({
  name: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  label: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  description: Yup.string().max(5000, "This field must be at most 5000 characters"),
  actions: Yup.array().of(Yup.object({
    actionKey: Yup.string(),
    actionParameters: Yup.object().when("actionKey", {
      is: NOOP_ACTION,
      then: (schema) => schema,
      otherwise: () => Yup.object({
        discountValue: Yup.number()
          .when("discountCalculationType", {
            is: "percentage",
            then: (schema) => schema.max(100, "This field must be less than or equal to 100%"),
            otherwise: (schema) => schema
          }).when("discountCalculationType", {
            is: "flat",
            then: (schema) => schema.notRequired(),
            otherwise: (schema) => schema.required("This field is required").moreThan(0, "Discount value must be greater than 0")
          }),
        discountMaxUnits: Yup.number().min(0, "This field must be greater than or equal to 0"),
        discountMaxValue: Yup.number().min(0, "This field must be greater than or equal to 0"),
        discountCalculationType: Yup.string().required("This field is required"),
        discountType: Yup.string().required(),
        inclusionRules: Yup.object().when("discountType", {
          is: "shipping",
          then: (schema) => schema.shape({
            conditions: Yup.object({
              all: Yup.array().of(shippingRuleSchema)
            })
          }),
          otherwise: (schema) => schema.shape({
            conditions: Yup.object({
              any: Yup.array().of(ruleSchema),
              all: Yup.array().of(ruleSchema)
            })
          })
        }),
        exclusionRules: Yup.object({
          conditions: Yup.object({
            any: Yup.array().of(ruleSchema),
            all: Yup.array().of(ruleSchema)
          })
        })
      })
    })
  })).min(1, "Promotion should have at least 1 action"),
  triggers: Yup.array().of(Yup.object({
    triggerKey: Yup.string(),
    triggerParameters: Yup.object({
      conditions: Yup.object({
        all: Yup.array().of(Yup.object({
          triggerType: Yup.string(),
          value: Yup.number().when("triggerType", {
            is: TriggerType.CouponStandard,
            then: (schema) => schema,
            otherwise: Yup.number().moreThan(0, "This field must be greater than 0").required("This field is required")
          })
        }))
      }),
      ...inclusionExclusionValidation
    }).when("triggerKey", {
      is: TriggerKeys.Coupons,
      then: () => Yup.object({
        code: Yup.string().trim().required("This field is required").matches(/^[a-zA-Z0-9]+$/, "Please enter an alphanumeric coupon code"),
        name: Yup.string().trim().required("This field is required"),
        maxUsageTimesPerUser: Yup.number().min(0, "This field must be greater than or equal to 0"),
        ...inclusionExclusionValidation
      }),
      otherwise: (schema) => schema
    })
  })).min(1, "Promotion should have at least 1 trigger"),
  startDate: Yup.date().nullable().required("This field is required"),
  endDate: Yup.date().nullable().min(Yup.ref("startDate"), "End date should be after start date")
});
