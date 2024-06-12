import { FormControl, FormLabel, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

interface MobileFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur: <T = string>(e: T) => void;
  formikTouched: boolean | undefined;
  formikError: string | undefined;
}

export const MobileField: React.FC<MobileFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikTouched,
  formikError,
}) => {
  return (
    <>
      <PhoneInput
        inputStyle={{ width: "100%", borderColor: "#9DA4AE" }}
        country="pk"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={formikTouched && !formikError}
        inputProps={{
          name: "mobile",
        }}
      />
      {formikTouched && formikError && (
        <Typography variant="caption" color="error">
          {formikError}
        </Typography>
      )}
    </>
  );
};
