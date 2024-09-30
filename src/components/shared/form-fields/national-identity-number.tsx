import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface NationalIdentityFieldProps {
  value: number | undefined;
  handleChange: <T = string>(e: T) => void;
  handleBlur?: <T = string>(e: T) => void;
  formikTouched?: boolean | undefined;
  formikError?: string | undefined;
}

export const NationalIdentityField: React.FC<NationalIdentityFieldProps> = ({
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
      label="Natinal Identity Number"
      name="national_identity_number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    />
  );
};
