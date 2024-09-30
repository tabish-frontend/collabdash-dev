import { MenuItem, TextField } from "@mui/material";
import { handleKeyPress } from "src/utils";
import { Country } from "country-state-city";

interface CountryFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const CountryField: React.FC<CountryFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikError,
  formikTouched,
}) => {
  const Countries = Country.getAllCountries();

  return (
    <TextField
      fullWidth
      required
      select
      label="Country"
      name="country"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      error={!!(formikTouched && formikError)}
      helperText={formikTouched && formikError}
    >
      {Countries.map((country) => (
        <MenuItem key={country.name} value={country.isoCode}>
          {country.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
