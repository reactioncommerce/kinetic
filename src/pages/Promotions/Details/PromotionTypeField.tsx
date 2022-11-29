import { Field, FieldProps, useFormikContext } from "formik";

import { SelectField } from "@components/SelectField";
import { DISCOUNT_TYPES_MAP, PROMOTION_TYPE_OPTIONS } from "../constants";
import { CalculationType, Promotion, PromotionType } from "types/promotions";

export const PromotionTypeField = () => {
  const { setFieldValue, values } = useFormikContext<Promotion>();
  const onPromotionTypeChange = (value: string) => {
    setFieldValue("promotionType", value);
    values.actions.forEach((action, index) => {
      setFieldValue(`actions[${index}].actionParameters.discountType`, DISCOUNT_TYPES_MAP[value as PromotionType]);
      setFieldValue(`actions[${index}].actionParameters.inclusionRules`, {});
      setFieldValue(`actions[${index}].actionParameters.exclusionRules`, {});
      if ((value === PromotionType.ItemDiscount || value === PromotionType.OrderDiscount) && action.actionParameters?.discountCalculationType === "flat") {
        setFieldValue(`actions[${index}].actionParameters.discountCalculationType`, CalculationType.Percentage);
      }
    });
  };

  return (
    <Field
      name="promotionType"
    >
      {(props: FieldProps) =>
        <SelectField
          {...props}
          label="Promotion Type"
          options={Object.values(PROMOTION_TYPE_OPTIONS)}
          onChange={(event) => onPromotionTypeChange(event.target.value as string)}
        />}
    </Field>
  );
};
