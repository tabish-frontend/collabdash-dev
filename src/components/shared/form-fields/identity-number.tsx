import { TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";

interface IdentityNumberFieldProps {
  value: number | undefined;
  handleChange: <T = string>(e: T) => void;
}

export const IdentityNumberField: React.FC<IdentityNumberFieldProps> = ({
  value,
  handleChange,
}) => {
  return (
    <TextField
      fullWidth
      label="Identity Number"
      name="identity_number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    />
  );
};
