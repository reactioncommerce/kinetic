import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Field, FieldArray } from "formik";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Promotion, PromotionType } from "types/promotions";
import { CALCULATION_OPTIONS, DISCOUNT_TYPES_MAP } from "../constants";

import { PromotionFieldArray } from "./PromotionFieldArray";
import { EligibleItems } from "./EligibleItems";


const getSymbolBasedOnType = (action: Promotion["actions"][0]) => {
  const calculationType = action.actionParameters?.discountCalculationType;
  return calculationType ? CALCULATION_OPTIONS[calculationType].symbol : "%";
};

type PromotionActionsProps = {
  actions: Promotion["actions"]
  promotionType: PromotionType
}

export const PromotionActions = ({ actions, promotionType }: PromotionActionsProps) => (
  <Stack direction="column" mt={2} gap={2}>
    <FieldArray
      name="actions"
      render={(props) =>
        <PromotionFieldArray
          {...props}
          renderFieldItem={() => <EligibleItems/>}
          label="Select an action for your promotion"
          addButtonLabel="Add Action"
          removeButtonLabel="Remove Action"
          hideAddButton={!!actions.length}
          renderHeaderField={(index) =>
            <Stack direction="row" alignItems="flex-start" gap={1} justifyContent="flex-start">
              <Field
                name={`actions[${index}].actionParameters.discountCalculationType`}
                component={SelectField}
                hiddenLabel
                label="Select Action Calculate Type"
                options={Object.values(CALCULATION_OPTIONS)}
              />
              <Field
                component={TextField}
                name={`actions[${index}].actionParameters.discountValue`}
                label="Discount Value"
                type="number"
                hiddenLabel
                startAdornment={
                  <InputAdornment position="start">{getSymbolBasedOnType(actions[index])}</InputAdornment>
                }
              />
            </Stack>
          }
          initialValue={{
            actionKey: "noop",
            actionParameters: {
              discountValue: 0,
              discountCalculationType: "percentage",
              discountType: DISCOUNT_TYPES_MAP[promotionType]
            }
          }}
        />}
    />
  </Stack>
);
