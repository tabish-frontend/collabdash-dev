import MuiPhoneNumber from "mui-phone-number";
import { GlobalStyles } from "@mui/system";

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
  return (
    <>
      <GlobalStyles
        styles={{
          ".custom-dropdown .MuiPaper-root.MuiMenu-paper": {
            maxHeight: "250px", // Set max height
            overflowY: "auto", // Enable scrolling
          },
        }}
      />

      <MuiPhoneNumber
        defaultCountry="pk"
        onChange={handleChange}
        value={value}
        name="mobile"
        variant="filled"
        required
        label="Phone"
        fullWidth
        onBlur={handleBlur}
        error={!!(formikTouched && formikError)}
        helperText={formikTouched && formikError}
        dropdownClass="custom-dropdown"
      />
    </>
  );
};
