import { TextField } from "@mui/material";
import { handleKeyPress } from "./key-press-function";

interface DesignationFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const DesignationField: React.FC<DesignationFieldProps> = ({
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
      label="Designation"
      name="designation"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
