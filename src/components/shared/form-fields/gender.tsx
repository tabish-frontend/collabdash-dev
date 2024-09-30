import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

const Genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];
interface GenderFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const GenderField: React.FC<GenderFieldProps> = ({
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
      select
      label="Gender"
      name="gender"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    >
      {Genders.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
