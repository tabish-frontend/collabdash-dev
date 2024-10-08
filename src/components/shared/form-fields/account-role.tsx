import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

const Roles = [
  {
    label: "Employee",
    value: "employee",
  },
  {
    label: "Manager",
    value: "hr",
  },
];
interface AccountRoleFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const AccountRoleField: React.FC<AccountRoleFieldProps> = ({
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
      label="Account Role"
      name="role"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    >
      {Roles.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
