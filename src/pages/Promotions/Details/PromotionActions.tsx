import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Field, FieldArray } from "formik";

import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { Promotion } from "types/promotions";
import { CALCULATION_OPTIONS } from "../constants";

import { PromotionFieldArray } from "./PromotionFieldArray";


const getSymbolBasedOnType = (action: Promotion["actions"][0]) => {
  const calculationType = action.actionParameters?.discountCalculationType;
  return calculationType ? CALCULATION_OPTIONS[calculationType].symbol : "%";
};

type PromotionActionsProps = {
  actions: Promotion["actions"]
}

export const PromotionActions = ({ actions }: PromotionActionsProps) => (
  <Stack direction="column" mt={2} gap={2}>
    <FieldArray
      name="actions"
      render={(props) =>
        <PromotionFieldArray
          {...props}
          renderFieldItem={() => <div></div>}
          label="Select an action for your promotion"
          addButtonLabel="Add Action"
          removeButtonLabel="Remove Action"
          hideAddButton={!!actions.length}
          renderHeaderField={(index) =>
            <Stack direction="row" alignItems="center" gap={1} justifyContent="flex-start">
              <Field
                name={`actions[${index}].actionParameters.discountCalculationType`}
                component={SelectField}
                hiddenLabel
                label="Select Action Calculate Type"
                options={Object.values(CALCULATION_OPTIONS)}
                sx={{ width: "100px" }}
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
                sx={{ width: "100px" }}
              />
            </Stack>
          }
          initialValue={{
            actionKey: "noop",
            actionParameters: {
              discountValue: 0,
              discountCalculationType: "percentage"
            }
          }}
        />}
    />
  </Stack>
);
