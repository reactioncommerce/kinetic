import * as Yup from "yup";

const ruleSchema = Yup.object({
  path: Yup.string().required("This field is required"),
  operator: Yup.string().required("This field is required"),
  value: Yup.array().of(Yup.string()).min(1, "This field must have at least 1 item")
});

export const promotionSchema = Yup.object().shape({
  name: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  label: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  description: Yup.string().max(5000, "This field must be at most 5000 characters"),
  actions: Yup.array().of(Yup.object({
    actionKey: Yup.string(),
    actionParameters: Yup.object({
      discountValue: Yup.number().moreThan(0, "Discount value must be greater than 0").required("This field is required"),
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
  })),
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
  })),
  startDate: Yup.date().nullable().required("This field is required"),
  endDate: Yup.date().nullable()
});
