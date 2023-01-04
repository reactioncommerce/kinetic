import * as Yup from "yup";

const ruleSchema = Yup.object({
  path: Yup.string().required("This field is required"),
  operator: Yup.string().required("This field is required"),
  value: Yup.array().min(1, "This field must have at least 1 item")
});

const shippingRuleSchema = Yup.object({ value: Yup.array().min(1, "This field must have at least 1 item") });

export const promotionSchema = Yup.object().shape({
  name: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  label: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  description: Yup.string().max(5000, "This field must be at most 5000 characters"),
  actions: Yup.array().of(Yup.object({
    actionKey: Yup.string(),
    actionParameters: Yup.object({
      discountValue: Yup.number().moreThan(0, "Discount value must be greater than 0").required("This field is required")
        .when("discountCalculationType", {
          is: "percentage",
          then: (schema) => schema.max(100, "This field must be less than or equal to 100%"),
          otherwise: (schema) => schema
        }),
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
  })).min(1, "Promotion should have at least 1 action"),
  triggers: Yup.array().of(Yup.object({
    triggerKey: Yup.string(),
    triggerParameters: Yup.object({
      conditions: Yup.object({
        all: Yup.array().of(Yup.object({
          value: Yup.number().moreThan(0, "Cart value must be greater than 0").required("This field is required")
        }))
      }),
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
    })
  })).min(1, "Promotion should have at least 1 trigger"),
  startDate: Yup.date().nullable().required("This field is required"),
  endDate: Yup.date().nullable()
});
