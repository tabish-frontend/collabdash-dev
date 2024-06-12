import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

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
    <FormControl error={formikTouched && Boolean(formikError)}>
      <FormLabel sx={{ fontSize: "0.875rem" }} required>
        Gender
      </FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        value={value}
        name="gender"
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <FormControlLabel value="male" label="Male" control={<Radio />} />
        <FormControlLabel value="female" label="Female" control={<Radio />} />
      </RadioGroup>
      {formikTouched && formikError && (
        <Typography variant="caption" color="error">
          {formikError}
        </Typography>
      )}
    </FormControl>
  );
};
