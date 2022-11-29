import { Field, FieldProps, useFormikContext } from "formik";

import { SelectField } from "@components/SelectField";
import { DISCOUNT_TYPES_MAP, PROMOTION_TYPE_OPTIONS } from "../constants";
import { Promotion, PromotionType } from "types/promotions";

export const PromotionTypeField = () => {
  const { setFieldValue, values } = useFormikContext<Promotion>();
  const onPromotionTypeChange = (value: string) => {
    setFieldValue("promotionType", value);
    values.actions.map((_, index) => setFieldValue(`actions[${index}].actionParameters.discountType`, DISCOUNT_TYPES_MAP[value as PromotionType]));
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
