import { TextField } from "@mui/material";
import { handleKeyPress } from "./key-press-function";

interface UsernameFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikError,
  formikTouched,
}) => {
  return (
    <TextField
      fullWidth
      required
      label="Username"
      name="username"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
