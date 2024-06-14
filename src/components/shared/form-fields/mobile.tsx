import { Typography, useTheme } from "@mui/material";
import PhoneInput from "react-phone-input-2";

interface MobileFieldProps {
  value: string;
  handleChange: <T = string>(e: T) => void;
  handleBlur?: <T = string>(e: T) => void;
  formikTouched?: boolean | undefined;
  formikError?: string | undefined;
}

export const MobileField: React.FC<MobileFieldProps> = ({
  value,
  handleChange,
  handleBlur,
  formikTouched,
  formikError,
}) => {
  const theme = useTheme();
  return (
    <>
      <PhoneInput
        inputStyle={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          width: "100%",
        }}
        containerStyle={{ color: theme.palette.grey[900] }}
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
