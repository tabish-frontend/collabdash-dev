import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";
import { DepartmentNames } from "src/constants/departments";

interface DepartmentFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
  isDisabled?: boolean;
}

export const DepartmentField: React.FC<DepartmentFieldProps> = ({
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
      select={!isDisabled}
      label="Department"
      name="department"
      value={value}
      disabled={isDisabled}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    >
      {DepartmentNames.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
