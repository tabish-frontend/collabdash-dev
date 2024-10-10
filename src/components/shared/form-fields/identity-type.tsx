import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

const IdentityTypesMap = [
  "ID Card",
  "Passport",
  "Driving License",
  "Residence",
];

interface IdentityTypeFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
}

export const IdentityTypeField: React.FC<IdentityTypeFieldProps> = ({
  value,
  handleChange,
}) => {
  return (
    <TextField
      fullWidth
      select
      label="Identity Type"
      name="identity_type"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    >
      {IdentityTypesMap.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
