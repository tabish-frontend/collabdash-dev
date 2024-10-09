import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface DesignationFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
  isDisabled?: boolean;
}

export const DesignationField: React.FC<DesignationFieldProps> = ({
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
      label="Designation"
      name="designation"
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
