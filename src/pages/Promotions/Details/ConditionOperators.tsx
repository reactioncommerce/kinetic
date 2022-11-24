import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";

import { CONDITION_OPERATORS } from "../constants";

export const ConditionOperators = (props: SelectProps) => (
  <Select
    {...props}
    label="Operator"
    size="small"
    variant="standard"
    defaultValue="all"
    renderValue={(value) =>
      <Typography variant="subtitle2" color="primary.main">
        {CONDITION_OPERATORS[value as string]?.label}
      </Typography>}
    sx={{
      ".MuiSelect-iconStandard": { color: "primary.main", fontSize: "1.5rem", mt: "-3px" },
      "&::before, ::after": { borderBottom: "none" },
      "&:hover:not(.Mui-disabled), &:active": { "&::before, &::after": { borderBottom: "none" } },
      ".MuiSelect-standard": { "backgroundColor": "transparent", "ml": "5px", "&:focus": { backgroundColor: "transparent" } }
    }}
  >
    {Object.values(CONDITION_OPERATORS).map((option) =>
      <MenuItem value={option.value} key={option.value}>{option.label}
      </MenuItem>)}
  </Select>
);
