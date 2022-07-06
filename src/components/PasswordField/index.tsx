import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { TextField, TextFieldProps } from "@components/TextField";

type PasswordFieldProps = TextFieldProps;

export const PasswordField = (props: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      autoComplete="current-password"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            onMouseDown={(e) => e.preventDefault()}
            edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
};
