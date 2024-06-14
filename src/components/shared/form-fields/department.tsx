import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "./key-press-function";
import { DepartmentNames } from "src/constants/departments";

interface DepartmentFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const DepartmentField: React.FC<DepartmentFieldProps> = ({
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
      label="Department"
      name="department"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
      SelectProps={{
        MenuProps: {
          style: {
            maxHeight: "200px",
          },
        },
      }}
    >
      {DepartmentNames.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
