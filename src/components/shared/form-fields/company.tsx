import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface CompanyFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
  isDisabled?: boolean;
}

export const CompanyField: React.FC<CompanyFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikError,
  formikTouched,
  isDisabled = false,
}) => {
  return (
    <TextField
      fullWidth
      required
      label="Company"
      name="company"
      value={value}
      disabled={isDisabled}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
