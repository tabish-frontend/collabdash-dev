import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface EmailFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikError: string | undefined;
  formikTouched: boolean | undefined;
}

export const EmailField: React.FC<EmailFieldProps> = ({
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
      label="Email"
      name="email"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
